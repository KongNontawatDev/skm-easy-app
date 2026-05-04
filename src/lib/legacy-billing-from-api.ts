import type { ContractData, InvoiceData, ReceiptData } from '@/types/billing'

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

function installmentStatus(row: Record<string, unknown>): 'pending' | 'paid' | 'overdue' {
  const raw = str(row.status ?? row.paidStatus ?? row.PAIDSTATUS ?? row.tranrcdsts).toLowerCase()
  if (raw === 'paid' || raw === 'pending' || raw === 'overdue') return raw

  const paidRaw = row.paid ?? row.PAID ?? row.is_paid
  const paid =
    paidRaw === true ||
    paidRaw === 1 ||
    paidRaw === '1' ||
    paidRaw === 'Y' ||
    String(paidRaw).toLowerCase() === 'paid'
  return paid ? 'paid' : 'pending'
}

export function encodeInstallmentInvoiceId(contractRef: string, periodNo: number): string {
  const payload = JSON.stringify({ r: contractRef, p: periodNo })
  return btoa(unescape(encodeURIComponent(payload)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export function decodeInstallmentInvoiceId(id: string): { r: string; p: number } | null {
  try {
    const pad = id.length % 4 === 0 ? '' : '='.repeat(4 - (id.length % 4))
    const normalized = id.replace(/-/g, '+').replace(/_/g, '/') + pad
    const json = decodeURIComponent(escape(atob(normalized)))
    const o = JSON.parse(json) as { r?: unknown; p?: unknown }
    if (typeof o.r === 'string' && typeof o.p === 'number' && Number.isFinite(o.p)) return { r: o.r, p: o.p }
  } catch {
    /* ignore */
  }
  return null
}

export function encodeReceiptApiId(receiptApiId: string): string {
  return btoa(unescape(encodeURIComponent(receiptApiId)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export function decodeReceiptApiId(id: string): string | null {
  try {
    const pad = id.length % 4 === 0 ? '' : '='.repeat(4 - (id.length % 4))
    const normalized = id.replace(/-/g, '+').replace(/_/g, '/') + pad
    return decodeURIComponent(escape(atob(normalized)))
  } catch {
    return null
  }
}

export function contractNumberFromRef(contractRef: string): string {
  const i = contractRef.indexOf(':')
  return i >= 0 ? contractRef.slice(i + 1) : contractRef
}

function customerFromContract(contract?: ContractData): InvoiceData['customerInfo'] {
  return {
    name: contract?.customerInfo.name || '-',
    address: contract?.customerInfo.address || '-',
    taxId: contract?.customerInfo.taxId || '-',
  }
}

function vehicleFromContract(contract?: ContractData): InvoiceData['vehicleInfo'] {
  return {
    brand: contract?.vehicleInfo.brand || '-',
    model: contract?.vehicleInfo.model || '-',
    plateNumber: contract?.vehicleInfo.plateNumber || '-',
    engineNumber: contract?.vehicleInfo.engineNumber || '',
    chassisNumber: contract?.vehicleInfo.chassisNumber || '',
    taxDueDate: contract?.vehicleInfo.taxDueDate || '',
    taxPaymentDueDate: contract?.vehicleInfo.taxPaymentDueDate || '',
  }
}

export function mapInstallmentRowToInvoiceData(
  row: Record<string, unknown>,
  contractRef: string,
  contract?: ContractData | null,
): InvoiceData {
  const contractNumber = contract?.contractNumber || contractNumberFromRef(contractRef)
  const periodNo = num(
    row.periodNo ?? row.PERIOD ?? row.installmentNo ?? row.install_no ?? row.period ?? row.seq,
    0,
  )
  const dueDate = str(row.dueDate ?? row.due_date ?? row.DUE_DT ?? row.pay_date, new Date().toISOString().slice(0, 10))
  const amount = num(row.amount ?? row.dueAmount ?? row.amt ?? row.PAY_AMT ?? row.install_amt)
  const vat = num(row.vatAmount ?? row.vat_amount ?? row.VAT_PAID)
  const status = installmentStatus(row)
  const paid = status === 'paid'
  const id = encodeInstallmentInvoiceId(contractRef, periodNo)

  return {
    id,
    invoiceNumber: `INV-${contractNumber}-${String(periodNo).padStart(2, '0')}`,
    contractId: contractRef,
    contractNumber,
    customerInfo: customerFromContract(contract ?? undefined),
    vehicleInfo: vehicleFromContract(contract ?? undefined),
    billingInfo: {
      issueDate: dueDate,
      dueDate,
      paymentDate: paid ? str(row.paidDate ?? row.paid_date ?? dueDate) : undefined,
      amount,
      vat,
      totalAmount: amount,
      lateFee: num(row.lateFee ?? row.late_fee),
      collectionFee: num(row.collectionFee ?? row.collection_fee),
      otherFees: num(row.otherFees ?? row.other_fees),
    },
    paymentInfo: {
      method: paid ? 'ชำระแล้ว' : 'รอชำระ',
      reference: str(row.receiptNo ?? row.receipt_no ?? '-', '-'),
      status: paid ? 'paid' : status === 'pending' ? 'pending' : 'sent',
    },
    items: [
      {
        id: '1',
        description: `ค่างวดที่ ${periodNo}`,
        quantity: 1,
        unitPrice: amount,
        amount,
      },
    ],
    status: paid ? 'paid' : status === 'pending' ? 'pending' : 'sent',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export function mapReceiptApiRowToReceiptData(
  row: Record<string, unknown>,
  contractRefFallback: string,
  contract?: ContractData | null,
): ReceiptData {
  const apiId = str(row.id)
  const contNo = str(row.contractNumber ?? row.contractRef ?? row.contno ?? row.CONTNO ?? contractNumberFromRef(contractRefFallback))
  const amount = num(row.amount ?? row.totalAmount ?? row.rcpamt)
  const receiptDate = str(row.receiptDate ?? row.rcp_date ?? row.RCPDTE, new Date().toISOString().slice(0, 10))
  const receiptNo = str(row.receiptNo ?? row.RCPNO ?? row.rcpno ?? apiId)

  return {
    id: apiId,
    receiptNumber: receiptNo,
    invoiceId: '-',
    contractId: contractRefFallback || contNo,
    contractNumber: contract?.contractNumber || contNo,
    customerInfo: customerFromContract(contract ?? undefined),
    vehicleInfo: vehicleFromContract(contract ?? undefined),
    paymentInfo: {
      paymentDate: receiptDate,
      amount,
      method: str(row.receiptType ?? row.paymentMethod ?? 'ชำระเงิน'),
      reference: str(row.referenceDocument ?? row.reference ?? apiId),
      bankAccount: '-',
      status: 'completed',
      baseAmount: amount,
      lateFee: 0,
      collectionFee: 0,
      otherFees: 0,
    },
    items: [
      {
        id: '1',
        description: 'ชำระเงินตามใบเสร็จ',
        amount,
        period: str(row.receiptDate ?? row.rcp_date ?? row.RCPDTE, '-'),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export function filterReceiptRowsForContract(
  rows: Record<string, unknown>[],
  contractRef: string,
): Record<string, unknown>[] {
  const want = contractNumberFromRef(contractRef)
  return rows.filter((row) => str(row.contractNumber ?? row.contractRef ?? row.contno ?? row.CONTNO) === want)
}
