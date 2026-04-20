/**
 * บันทึกการยอมรับข้อตกลงการใช้งานแอป — เก็บใน localStorage ต่อผู้ใช้ (JWT `sub`)
 * เมื่อปรับเนื้อหาข้อตกลงอย่างมีนัยสำคัญ ให้เพิ่ม APP_TERMS_VERSION เพื่อให้ผู้ใช้ยืนยันรอบใหม่
 */
import { getCustomerJwtSub } from '@/lib/customer-session'

export const APP_TERMS_VERSION = 1

function storageKeyForSub(sub: string): string {
  return `skm_app_terms_accepted_v${APP_TERMS_VERSION}_${sub}`
}

export function hasAcceptedAppTerms(): boolean {
  if (typeof localStorage === 'undefined') return true
  const sub = getCustomerJwtSub()
  if (!sub) return true
  return localStorage.getItem(storageKeyForSub(sub)) === '1'
}

export function markAppTermsAccepted(): void {
  if (typeof localStorage === 'undefined') return
  const sub = getCustomerJwtSub()
  if (!sub) return
  localStorage.setItem(storageKeyForSub(sub), '1')
}
