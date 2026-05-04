const ACCESS = 'skm_access_token'
const REFRESH = 'skm_refresh_token'

export const CUSTOMER_SESSION_CHANGED = 'skm:customer-session-changed'

type CustomerJwtPayload = { exp?: number; sub?: string }

function decodeJwtPayload(token: string): CustomerJwtPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length < 3) return null
    return JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))) as CustomerJwtPayload
  } catch {
    return null
  }
}

function decodeJwtExp(token: string): number | null {
  const payload = decodeJwtPayload(token)
  return typeof payload?.exp === 'number' ? payload.exp : null
}

export function getCustomerAccessToken(): string | null {
  if (typeof localStorage === 'undefined') return null
  return localStorage.getItem(ACCESS)
}

/** `sub` ใน JWT ลูกค้า (รหัสลูกค้า legacy เช่น COMPID:IDNO) — ใช้แยกผู้ใช้ใน localStorage */
export function getCustomerJwtSub(): string | null {
  if (typeof localStorage === 'undefined') return null
  const t = localStorage.getItem(ACCESS)
  if (!t) return null
  const sub = decodeJwtPayload(t)?.sub
  return typeof sub === 'string' && sub.trim().length > 0 ? sub.trim() : null
}

function dispatchSessionChanged(): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(CUSTOMER_SESSION_CHANGED))
}

/** access ยังใช้ได้อย่างน้อย skewSec วินาที — โทเคนที่ decode ไม่ได้หรือไม่มี exp ถือว่าใช้ไม่ได้ (กันลูป /sign-in ↔ /) */
export function isCustomerAccessTokenValid(skewSec = 90): boolean {
  if (typeof localStorage === 'undefined') return false
  const t = localStorage.getItem(ACCESS)
  if (!t) return false
  const exp = decodeJwtExp(t)
  if (!exp) return false
  return exp * 1000 > Date.now() + skewSec * 1000
}

/** ใช้ตั้ง interval refresh ล่วงหน้า */
export function getCustomerAccessTokenExpiresAtMs(): number | null {
  const t = getCustomerAccessToken()
  if (!t) return null
  const exp = decodeJwtExp(t)
  return exp ? exp * 1000 : null
}

export function getCustomerRefreshToken(): string | null {
  if (typeof localStorage === 'undefined') return null
  return localStorage.getItem(REFRESH)
}

export function hasCustomerSession(): boolean {
  return isCustomerAccessTokenValid(0) || !!getCustomerRefreshToken()
}

export function setCustomerTokens(access: string, refresh: string): void {
  localStorage.setItem(ACCESS, access)
  localStorage.setItem(REFRESH, refresh)
  dispatchSessionChanged()
}

export function setCustomerAccessToken(access: string): void {
  localStorage.setItem(ACCESS, access)
  dispatchSessionChanged()
}

export function clearCustomerSession(): void {
  localStorage.removeItem(ACCESS)
  localStorage.removeItem(REFRESH)
  dispatchSessionChanged()
}
