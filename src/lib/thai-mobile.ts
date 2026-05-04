/**
 * เบอร์มือถือไทย — ต้องสอดคล้องกับ `skm-easy-api-v3` (`parseCustomerThaiMobile`)
 * เพื่อให้ body `phone` ที่ส่งไป `/auth/customer/otp/*` เป็นเบอร์จริงของผู้ใช้เสมอ
 */

export const THAI_LOCAL_MOBILE_REGEX = /^0[689]\d{8}$/

export function digitsOnly(input: string): string {
  return input.replace(/\D/g, '')
}

export function toLocalThaiMobileDigits(input: string): string {
  const d = digitsOnly(input)
  if (d.length === 10 && d.startsWith('0')) return d
  if (d.length === 11 && d.startsWith('66')) return `0${d.slice(2)}`
  if (d.length === 12 && d.startsWith('668')) return `0${d.slice(3)}`
  return d
}

/** คืน string ข้อความ error หรือ '' ถ้าถูกต้อง */
export function validateLocalThaiMobile(local: string): string {
  if (local.length !== 10) {
    return 'เบอร์โทรศัพท์ต้องมี 10 หลัก'
  }
  if (!local.startsWith('0')) {
    return 'เบอร์โทรศัพท์ต้องขึ้นต้นด้วย 0'
  }
  if (!THAI_LOCAL_MOBILE_REGEX.test(local)) {
    return 'เบอร์มือถือไทยไม่ถูกต้อง — ต้องขึ้นต้นด้วย 06 / 08 / 09'
  }
  return ''
}

/** แสดงเบอร์ปลายทาง SMS แบบปิดบังตรงกลาง */
export function maskLocalThaiMobile(local: string): string {
  if (local.length !== 10) return '—'
  return `${local.slice(0, 3)}-xxx-${local.slice(7, 10)}`
}
