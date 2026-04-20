/** ขั้นตอนหลังกรอกบัตร/เบอร์ + hCaptcha ก่อนไปหน้า OTP */

const KEY = 'skm_otp_pending'

export type OtpPendingPayload = {
  nationalIdDigits: string
  phoneDigits: string
  /** ref_code จาก POST /auth/customer/otp/request */
  refCode: string
  /** ISO — ใช้จำกัดเวลา OTP ฝั่ง UI */
  otpExpiresAt?: string
  startedAt: string
}

export function setOtpPending(payload: Omit<OtpPendingPayload, 'startedAt'>): void {
  const full: OtpPendingPayload = {
    ...payload,
    startedAt: new Date().toISOString(),
  }
  sessionStorage.setItem(KEY, JSON.stringify(full))
}

export function getOtpPending(): OtpPendingPayload | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as OtpPendingPayload
    if (
      typeof data?.nationalIdDigits === 'string' &&
      typeof data?.phoneDigits === 'string' &&
      typeof data?.refCode === 'string'
    ) {
      return data
    }
    return null
  } catch {
    return null
  }
}

export function clearOtpPending() {
  sessionStorage.removeItem(KEY)
}

/** อัปเดต ref/เวลาหมดอายุหลังส่ง OTP ซ้ำ — เก็บ nationalId/phone เดิม */
export function patchOtpPending(
  patch: Partial<Pick<OtpPendingPayload, 'refCode' | 'otpExpiresAt'>>,
): void {
  const cur = getOtpPending()
  if (!cur) return
  sessionStorage.setItem(KEY, JSON.stringify({ ...cur, ...patch }))
}
