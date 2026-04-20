/**
 * แปลงแถวจาก legacy SQL (GET /me/contracts/:ref และงวด) เป็นรูปแบบที่ UI เดิมใช้
 * ชื่อคอลัมน์ยืดหยุ่นตาม SQL ที่ตั้งใน env ของ API
 */
import type { ContractCard } from '@/features/home/types'
import type { ContractData, PaymentData } from '@/lib/mock-data'

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

function isRowEmpty(row: Record<string, unknown>): boolean {
  return Object.keys(row).length === 0
}

/** ดึงเลขอ้างอิงสัญญาจากแถวรายละเอียด */
export function contractRefFromDetailRow(row: Record<string, unknown>, fallback: string): string {
  return str(
    row.contractRef ??
      row.contract_ref ??
      row.contractNumber ??
      row.contract_no ??
      row.CONT_NO ??
      row.cont_no ??
      fallback,
  )
}

/**
 * แปลงแถวเดียวจาก `/me/contracts/{ref}` → ContractData (ถ้าไม่มีข้อมูลพอ return null)
 */
export function mapLegacyContractDetailToContractData(
  row: Record<string, unknown>,
  contractRefFromUrl: string,
): ContractData | null {
  if (isRowEmpty(row)) return null
  const contractRefResolved = str(
    row.contractRef ?? row.contract_ref ?? row.contractref ?? contractRefFromUrl,
    contractRefFromUrl,
  )
  const contractNumber = str(
    row.contractNumber ?? row.contract_no ?? row.contno ?? contractRefFromDetailRow(row, contractRefFromUrl),
  )
  if (!String(contractRefResolved).trim()) return null

  const statusRaw = str(row.status ?? row.contract_status, 'active').toLowerCase()
  const status: ContractData['contractInfo']['status'] =
    statusRaw === 'overdue' || statusRaw === 'ค้าง'
      ? 'overdue'
      : statusRaw === 'completed' || statusRaw === 'ปิด'
        ? 'completed'
        : 'active'

  const vehicleImage = str(
    row.imageUrl ?? row.vehicle_image ?? row.image_url ?? row.vehicleImage ?? '',
  )

  return {
    id: contractRefResolved,
    contractNumber: contractNumber || contractRefFromUrl.replace(/^[^:]+:/, ''),
    vehicleInfo: {
      brand: str(row.brand ?? row.vehicle_brand ?? '—'),
      model: str(row.model ?? row.vehicle_model ?? '—'),
      year: num(row.year ?? row.vehicle_year, new Date().getFullYear()),
      color: str(row.color ?? row.vehicle_color ?? '—'),
      plateNumber: str(row.plateNumber ?? row.plate_no ?? row.plate ?? row.license_plate ?? '—'),
      imageUrl: vehicleImage ? vehicleImage : '',
    },
    customerInfo: {
      name: str(row.customerName ?? row.cus_name ?? row.name ?? row.CUS_NAME ?? '—'),
      phone: str(row.phone ?? row.tel ?? row.mobile ?? row.cus_tel ?? '—'),
      email: str(row.email ?? row.cus_email ?? ''),
      address: str(row.address ?? row.cus_addr ?? ''),
      taxId: str(row.taxId ?? row.tax_id ?? row.id_no ?? ''),
    },
    financialInfo: {
      totalAmount: num(row.totalAmount ?? row.total_amt ?? row.TOTAL_AMT),
      downPayment: num(row.downPayment ?? row.down_payment),
      loanAmount: num(row.loanAmount ?? row.loan_amt ?? row.finance_amt),
      monthlyPayment: num(row.monthlyPayment ?? row.monthly_payment ?? row.install_amt),
      interestRate: num(row.interestRate ?? row.interest_rate),
      remainingAmount: num(row.remainingAmount ?? row.remaining_amount ?? row.balance),
      term: num(row.term ?? row.term_months ?? row.install_count, 0),
    },
    contractInfo: {
      startDate: str(row.startDate ?? row.start_date ?? row.CONT_START ?? new Date().toISOString()),
      endDate: str(row.endDate ?? row.end_date ?? row.CONT_END ?? new Date().toISOString()),
      term: num(row.term ?? row.term_months ?? row.install_count, 0),
      status,
    },
    progress: Math.min(100, Math.max(0, num(row.progress ?? row.paid_percent, 0))),
    nextPaymentDate: str(
      row.nextPaymentDate ?? row.next_due_date ?? row.nextDueDate ?? new Date().toISOString().slice(0, 10),
    ),
    createdAt: str(row.createdAt ?? row.created_at ?? new Date().toISOString()),
  }
}

/** แปลงรายการงวดจาก `/me/contracts/:ref/installments` */
export function mapLegacyInstallmentsToPayments(
  rows: Record<string, unknown>[],
  contractNo: string,
): PaymentData[] {
  return rows.map((row, index) => {
    const id = str(row.id ?? row.install_id ?? `inst-${index}`)
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
    const amount = num(row.amount ?? row.amt ?? row.PAY_AMT ?? row.install_amt)
    const dueRaw = row.dueDate ?? row.due_date ?? row.DUE_DT ?? row.pay_date
    const dueDate = str(dueRaw, new Date().toISOString().slice(0, 10))

    let status: PaymentData['status'] = 'pending'
    const paidRaw =
      row.paid ?? row.PAID ?? row.is_paid ?? row.paidStatus ?? row.PAIDSTATUS ?? row.status
    const paid =
      paidRaw === true ||
      paidRaw === 1 ||
      paidRaw === '1' ||
      paidRaw === 'Y' ||
      String(paidRaw).toLowerCase() === 'paid'
    if (paid) status = 'paid'
    else if (new Date(dueDate) < new Date(new Date().toDateString()) && status === 'pending') {
      status = 'overdue'
    }

    return {
      id,
      contractNo,
      installmentNo,
      amount,
      dueDate,
      status,
    }
  })
}

/** ข้อมูลความคืบหน้างวดสำหรับ `InstallmentProgress` — สอดคล้องกับ mockContractProgressData */
export function deriveInstallmentProgressFromPayments(
  payments: PaymentData[],
  card: ContractCard | null,
): {
  totalAmount: number
  paidAmount: number
  nextDueDate: string
  installmentIndex: number
  totalInstallments: number
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
  }
}
