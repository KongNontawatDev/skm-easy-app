import type { ContractCard } from '@/features/home/types'
import type { ContractData, PaymentData } from '@/types/billing'

function str(v: unknown, fallback = ''): string {
  return v === undefined || v === null ? fallback : String(v)
}

function num(v: unknown, fallback = 0): number {
  if (typeof v === 'number' && !Number.isNaN(v)) return v
  if (typeof v === 'string') {
    const n = Number(v.replace(/,/g, ''))
    return Number.isNaN(n) ? fallback : n
  }
  return fallback
}

function firstText(values: unknown[], fallback = ''): string {
  for (const value of values) {
    const text = str(value).trim()
    if (text && text !== '---' && text !== '—') return text
  }
  return fallback
}

function unwrapContractDetail(row: Record<string, unknown>): Record<string, unknown> {
  const detail = row.detail
  if (detail && typeof detail === 'object' && !Array.isArray(detail)) {
    return detail as Record<string, unknown>
  }
  return row
}

function isRowEmpty(row: Record<string, unknown>): boolean {
  return Object.keys(row).length === 0
}

export function contractRefFromDetailRow(row: Record<string, unknown>, fallback: string): string {
  const source = unwrapContractDetail(row)
  return str(
    source.contractRef ??
      source.contract_ref ??
      source.contractNumber ??
      source.contract_no ??
      source.CONT_NO ??
      source.cont_no ??
      fallback,
  )
}

export function mapLegacyContractDetailToContractData(
  row: Record<string, unknown>,
  contractRefFromUrl: string,
): ContractData | null {
  const source = unwrapContractDetail(row)
  if (isRowEmpty(source)) return null

  const contractRefResolved = str(
    source.contractRef ?? source.contract_ref ?? source.contractref ?? contractRefFromUrl,
    contractRefFromUrl,
  )
  const contractNumber = str(
    source.contractNumber ??
      source.contract_no ??
      source.contno ??
      contractRefFromDetailRow(source, contractRefFromUrl),
  )
  if (!contractRefResolved.trim()) return null

  const statusRaw = str(source.status ?? source.contract_status, 'active').toLowerCase()
  const status: ContractData['contractInfo']['status'] =
    statusRaw === 'overdue' || statusRaw === 'ค้าง'
      ? 'overdue'
      : statusRaw === 'completed' || statusRaw === 'ปิด'
        ? 'completed'
        : 'active'

  const vehicleImage = str(
    source.imageUrl ?? source.vehicle_image ?? source.image_url ?? source.vehicleImage ?? '',
  )
  const monthlyPayment =
    num(source.monthlyPayment ?? source.monthly_payment ?? source.installmentAmount ?? source.install_amt) +
    num(source.installmentVatAmount)
  const term = num(source.totalTerms ?? source.term ?? source.term_months ?? source.install_count, 0)

  return {
    id: contractRefResolved,
    contractNumber: contractNumber || contractRefFromUrl.replace(/^[^:]+:/, ''),
    vehicleInfo: {
      brand: firstText([source.brand, source.vehicle_brand, source.BRAND], '—'),
      model: firstText(
        [source.modelDescription, source.model, source.vehicle_model, source.MODEL, source.modelCode],
        '—',
      ),
      year: num(source.year ?? source.vehicle_year ?? source.CARYEAR, new Date().getFullYear()),
      color: firstText([source.colorDescription, source.color, source.vehicle_color, source.COLOR, source.colorCode], '—'),
      plateNumber: firstText(
        [source.plateNumber, source.plate_no, source.plate, source.license_plate, source.LICNO],
        '—',
      ),
      imageUrl: vehicleImage ? vehicleImage : '',
      engineNumber: firstText(
        [source.engineNumber, source.engine_no, source.engineNo, source.engineno, source.ENGNO, source.ENGINE_NO],
        '',
      ),
      chassisNumber: firstText(
        [source.chassisNumber, source.chassis_no, source.chassisNo, source.frameno, source.FRAME_NO, source.CHASNO],
        '',
      ),
      taxDueDate: firstText(
        [source.taxDueDate, source.tax_due_date, source.vehicleTaxDueDate, source.tax_expire_date, source.TAXDUE],
        '',
      ),
      taxPaymentDueDate: firstText(
        [
          source.taxPaymentDueDate,
          source.tax_payment_due_date,
          source.vehicleTaxPaymentDueDate,
          source.tax_pay_due_date,
          source.TAXPAYDUE,
        ],
        '',
      ),
    },
    customerInfo: {
      name: firstText(
        [source.customerName, source.cus_name, source.name, source.CUS_NAME],
        '—',
      ),
      phone: firstText(
        [source.customerPhone, source.phone, source.tel, source.mobile, source.cus_tel],
        '—',
      ),
      email: str(source.customerEmail ?? source.email ?? source.cus_email ?? ''),
      address: str(source.customerAddress ?? source.address ?? source.cus_addr ?? ''),
      taxId: str(source.taxId ?? source.tax_id ?? source.id_no ?? source.CIDNUM ?? ''),
    },
    financialInfo: {
      totalAmount: num(source.totalAmount ?? source.carAmount ?? source.total_amt ?? source.TOTAL_AMT),
      downPayment: num(source.downPayment ?? source.down_payment),
      loanAmount: num(source.loanAmount ?? source.financeAmount ?? source.loan_amt ?? source.finance_amt),
      monthlyPayment,
      interestRate: num(source.interestRate ?? source.interest_rate),
      remainingAmount: num(
        source.outstandingBalance ?? source.remainingAmount ?? source.remaining_amount ?? source.balance,
      ),
      term,
    },
    contractInfo: {
      startDate: str(source.startDate ?? source.applicationDate ?? source.start_date ?? source.CONT_START ?? new Date().toISOString()),
      endDate: str(source.endDate ?? source.lastDueDate ?? source.end_date ?? source.CONT_END ?? new Date().toISOString()),
      term,
      status,
    },
    progress: Math.min(100, Math.max(0, num(source.progress ?? source.paid_percent, 0))),
    nextPaymentDate: str(
      source.nextPaymentDate ?? source.next_due_date ?? source.nextDueDate ?? new Date().toISOString().slice(0, 10),
    ),
    createdAt: str(source.createdAt ?? source.created_at ?? new Date().toISOString()),
  }
}

export function mapLegacyInstallmentsToPayments(
  rows: Record<string, unknown>[],
  contractNo: string,
): PaymentData[] {
  return rows.map((row, index) => {
    const id = str(row.id ?? row.installmentRef ?? row.install_id ?? `inst-${index}`)
    const installmentNo = num(
      row.installmentNo ??
        row.install_no ??
        row.periodNo ??
        row.period ??
        row.PERIOD ??
        row.seq ??
        index + 1,
      index + 1,
    )
    const amount = num(row.amount ?? row.dueAmount ?? row.amt ?? row.PAY_AMT ?? row.install_amt)
    const dueRaw = row.dueDate ?? row.due_date ?? row.DUE_DT ?? row.pay_date
    const dueDate = str(dueRaw, new Date().toISOString().slice(0, 10))

    let status: PaymentData['status'] = 'pending'
    const explicitStatus = str(row.status ?? row.paidStatus ?? row.PAIDSTATUS).toLowerCase()
    if (explicitStatus === 'paid' || explicitStatus === 'overdue' || explicitStatus === 'pending') {
      status = explicitStatus
    } else {
      const paidRaw = row.paid ?? row.PAID ?? row.is_paid
      const paid =
        paidRaw === true ||
        paidRaw === 1 ||
        paidRaw === '1' ||
        paidRaw === 'Y' ||
        String(paidRaw).toLowerCase() === 'paid'
      if (paid) status = 'paid'
      else if (new Date(dueDate) < new Date(new Date().toDateString())) status = 'overdue'
    }

    return {
      id,
      contractNo,
      installmentNo,
      amount,
      balanceAmount: num(row.balanceAmount ?? row.balance_amount ?? row.OUTSBAL, amount),
      paidAmount: num(row.paidAmount ?? row.paid_amount ?? row.PAIDAMT),
      lateFee: num(row.lateFee ?? row.late_fee ?? row.FINEAMT),
      collectionFee: num(row.collectionFee ?? row.collection_fee ?? row.FOLLOWAMT),
      otherFees: num(row.otherFees ?? row.other_fees ?? row.OTHERAMT),
      dueDate,
      status,
    }
  })
}

export function deriveInstallmentProgressFromPayments(
  payments: PaymentData[],
  card: ContractCard | null,
): {
  totalAmount: number
  paidAmount: number
  nextDueDate: string
  installmentIndex: number
  totalInstallments: number
  nextAmount: number
} | null {
  if (!payments.length) {
    if (!card) return null
    return {
      totalAmount: card.remainingAmount,
      paidAmount: 0,
      nextDueDate: card.nextPaymentDate,
      installmentIndex: 0,
      totalInstallments: Math.max(1, Math.round((card.progress / 100) * 24) || 1),
    }
  }
  const paidPayments = payments.filter((p) => p.status === 'paid')
  const paidAmount = paidPayments.reduce((s, p) => s + p.amount, 0)
  const totalFromInst = payments.reduce((s, p) => s + p.amount, 0)
  const totalAmount =
    totalFromInst > 0 ? totalFromInst : paidAmount + (card?.remainingAmount ?? 0)
  const next = payments.find((p) => p.status === 'pending' || p.status === 'overdue')
  const nextDueDate = next?.dueDate ?? card?.nextPaymentDate ?? payments[0]!.dueDate
  return {
    totalAmount,
    paidAmount,
    nextDueDate,
    installmentIndex: paidPayments.length,
    totalInstallments: payments.length,
    nextAmount: next?.amount ?? 0,
  }
}
