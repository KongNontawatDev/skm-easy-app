/**
 * มาตรฐานสตริง Bill Payment (เช่น กรุงศรี suffix 01) สำหรับสร้าง QR แอปธนาคาร
 * รูปแบบ: |{TAX_ID 13 หลัก}{SUFFIX 2 หลัก}\r{Ref1}\r{Ref2}\r{Amount}
 * Ref1 = เลขบัตรประชาชน, Ref2 = เลขที่สัญญา (CONTNO)
 * Amount = จำนวนเงินเป็นสตางค์ไม่มีจุดทศนิยม สูงสุด 10 หลัก หรือ "0" = ให้ลูกค้ากรอก/บางธนาคารรองรับยอดเปิด
 */

const CR = '\r'

function digitsOnly(s: string): string {
  return s.replace(/\D/g, '')
}

function sanitizeRef(value: string, maxLen: number): string {
  const t = String(value ?? '').trim()
  return t.slice(0, maxLen)
}

/**
 * สร้างสตริงที่ใช้ encode เป็น QR (ต้องตรงกับที่ธนาคารกำหนด)
 */
export function buildThaiBillPaymentBarcodeString(opts: {
  billerTaxId13: string
  bankSuffix2: string
  ref1NationalId13: string
  ref2ContractNo: string
  /** สตางค์เป็นตัวเลขเท่านั้น ไม่เกิน 10 หลัก หรือ "0" */
  amountSatang: string
}): string {
  const tax = digitsOnly(opts.billerTaxId13).slice(0, 13)
  if (tax.length !== 13) {
    throw new Error('เลขประจำตัวผู้เสียภาษีผู้รับ (biller) ต้องครบ 13 หลัก')
  }
  const sfx = digitsOnly(opts.bankSuffix2).padStart(2, '0').slice(-2)
  const nid = digitsOnly(opts.ref1NationalId13)
  if (nid.length !== 13) {
    throw new Error('Ref1 ต้องเป็นเลขบัตรประชาชน 13 หลัก')
  }
  const r1 = sanitizeRef(nid, 18)
  const r2 = sanitizeRef(opts.ref2ContractNo, 18)
  if (!r2) {
    throw new Error('Ref2 (เลขที่สัญญา) ต้องไม่ว่าง')
  }
  const amtRaw = String(opts.amountSatang ?? '0').trim()
  const amt = (amtRaw === '0' ? '0' : digitsOnly(amtRaw).slice(0, 10)) || '0'
  return `|${tax}${sfx}${CR}${r1}${CR}${r2}${CR}${amt}`
}

/** ดึงเลขบัตร 13 หลักจากแถวโปรไฟล์ legacy /me/profile */
export function nationalId13FromProfileRow(row: Record<string, unknown> | undefined): string | null {
  if (!row) return null
  const direct =
    row.IDNO ?? row.idno ?? row.CIDNUM ?? row.cidnum ?? row.nationalId ?? row.NATIONAL_ID ?? row.taxId ?? row.tax_id
  const fromDirect = digitsOnly(String(direct ?? ''))
  if (fromDirect.length === 13) return fromDirect
  const leg = String(row.legacyCustomerId ?? row.legacy_customer_id ?? '').split(':').pop()
  const fromLeg = digitsOnly(String(leg ?? ''))
  if (fromLeg.length === 13) return fromLeg
  return null
}

export function readBillPaymentEnv(): {
  billerTaxId13: string
  bankSuffix2: string
  useZeroAmount: boolean
} {
  let tax = digitsOnly(String(import.meta.env.VITE_BILL_PAYMENT_TAX_ID ?? '0355559000041')).slice(0, 13)
  if (tax.length !== 13) tax = '0355559000041'
  const bankSuffix2 = String(import.meta.env.VITE_BILL_PAYMENT_BANK_SUFFIX ?? '01')
    .replace(/\D/g, '')
    .padStart(2, '0')
    .slice(-2)
  const useZeroAmount = String(import.meta.env.VITE_BILL_PAYMENT_USE_ZERO_AMOUNT ?? 'true').toLowerCase() !== 'false'
  return { billerTaxId13: tax, bankSuffix2, useZeroAmount }
}

export function tryBuildThaiBillPaymentPayload(args: {
  billerTaxId13: string
  bankSuffix2: string
  ref1NationalId13: string
  ref2ContractNo: string
  amountSatang: string
}): { ok: true; payload: string } | { ok: false; message: string } {
  try {
    return { ok: true, payload: buildThaiBillPaymentBarcodeString(args) }
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : 'ไม่สามารถสร้างข้อมูล QR ชำระเงิน',
    }
  }
}

/** แปลงบาทเป็นสตางค์ (ปัดเป็นจำนวนเต็ม) สำหรับ mode ไม่ใช้ยอด 0 */
export function bahtToSatangString(baht: number): string {
  if (!Number.isFinite(baht) || baht < 0) return '0'
  const satang = Math.round(baht * 100)
  return String(Math.min(satang, 9_999_999_999)) // ไม่เกิน 10 หลัก
}
