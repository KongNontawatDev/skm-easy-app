/**
 * แปลงข้อมูลจาก API ลูกค้า (/me/contracts/.../installments, /me/receipts)
 * ให้รูปแบบ InvoiceData / ReceiptData ที่หน้าใบแจ้งหนี้-ใบเสร็จใช้อยู่
 */
import type { InvoiceData, ReceiptData } from '@/lib/mock-data'

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

function installmentPaid(row: Record<string, unknown>): boolean {
  const paidRaw =
    row.paid ?? row.PAID ?? row.is_paid ?? row.paidStatus ?? row.PAIDSTATUS ?? row.status ?? row.tranrcdsts
  return (
    paidRaw === true ||
    paidRaw === 1 ||
    paidRaw === '1' ||
    paidRaw === 'Y' ||
    String(paidRaw).toLowerCase() === 'paid'
  )
}

/** id สำหรับ path — ไม่มี `:` เพื่อไม่พัง URL */
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

export function mapInstallmentRowToInvoiceData(
  row: Record<string, unknown>,
  contractRef: string,
): InvoiceData {
  const contractNumber = contractNumberFromRef(contractRef)
  const periodNo = num(
    row.periodNo ?? row.PERIOD ?? row.installmentNo ?? row.install_no ?? row.period ?? row.seq,
    0,
  )
  const dueDate = str(row.dueDate ?? row.due_date ?? row.DUE_DT ?? row.pay_date, new Date().toISOString().slice(0, 10))
  const amount = num(row.amount ?? row.amt ?? row.PAY_AMT ?? row.install_amt)
  const paid = installmentPaid(row)
  const id = encodeInstallmentInvoiceId(contractRef, periodNo)

  return {
    id,
    invoiceNumber: `INV-${contractNumber}-${String(periodNo).padStart(2, '0')}`,
    contractId: contractRef,
    contractNumber,
    customerInfo: { name: '—', address: '—', taxId: '—' },
    vehicleInfo: { brand: '—', model: '—', plateNumber: '—' },
    billingInfo: {
      issueDate: dueDate,
      dueDate,
      paymentDate: paid ? dueDate : undefined,
      amount,
      vat: 0,
      totalAmount: amount,
      lateFee: 0,
      collectionFee: 0,
      otherFees: 0,
    },
    paymentInfo: { method: 'โอนเงิน', reference: '-', status: paid ? 'paid' : 'sent' },
    items: [
      {
        id: '1',
        description: `ค่างวดที่ ${periodNo}`,
        quantity: 1,
        unitPrice: amount,
        amount,
      },
    ],
    status: paid ? 'paid' : 'sent',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

function inferContractRefFromReceiptRow(row: Record<string, unknown>): string | null {
  const apiId = str(row.id)
  const contNo = str(row.contractNumber ?? row.contno ?? row.CONTNO)
  if (!apiId.includes(':') || !contNo) return null
  const br = apiId.split(':')[0]
  return `${br}:${contNo}`
}

export function mapReceiptApiRowToReceiptData(
  row: Record<string, unknown>,
  contractRefFallback: string,
): ReceiptData {
  const apiId = str(row.id)
  const contNo = str(row.contractNumber ?? row.contno ?? row.CONTNO)
  const contractRef = inferContractRefFromReceiptRow(row) ?? contractRefFallback
  const amount = num(row.amount ?? row.rcpamt)
  const receiptDate = str(row.receiptDate ?? row.rcp_date ?? row.RCPDTE, new Date().toISOString().slice(0, 10))

  return {
    id: apiId,
    receiptNumber: `RCP-${contNo}`,
    invoiceId: '-',
    contractId: contractRef,
    contractNumber: contNo,
    customerInfo: { name: '—', address: '—', taxId: '—' },
    vehicleInfo: { brand: '—', model: '—', plateNumber: '—' },
    paymentInfo: {
      paymentDate: receiptDate,
      amount,
      method: 'โอนเงิน',
      reference: apiId,
      bankAccount: '—',
      status: 'completed',
      baseAmount: amount,
      lateFee: 0,
      collectionFee: 0,
      otherFees: 0,
    },
    items: [
      {
        id: '1',
        description: `ชำระค่างวด (ใบเสร็จ)`,
        amount,
        period: '—',
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
  return rows.filter((row) => str(row.contractNumber ?? row.contno ?? row.CONTNO) === want)
}
