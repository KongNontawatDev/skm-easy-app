import { MobileButton } from '@/components/mobile'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { MessageSquare, Shield } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Link, useRouter } from '@tanstack/react-router'
import { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react'
import { showToast } from '@/lib/toast'
import { clearOtpPending, getOtpPending, patchOtpPending } from '@/lib/auth-pending-otp'
import { setCustomerTokens } from '@/lib/customer-session'
import { getLiffIdTokenAndProfileForOtp } from '@/lib/liff-client'
import { skmApi, unwrapData } from '@/lib/skm-api'
import { handleServerError } from '@/lib/handle-server-error'
import { maskLocalThaiMobile, toLocalThaiMobileDigits, validateLocalThaiMobile } from '@/lib/thai-mobile'

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function initialSecondsFromExpiry(iso?: string): number {
  if (!iso) return 300
  const sec = Math.floor((new Date(iso).getTime() - Date.now()) / 1000)
  return Math.max(0, Math.min(sec, 600))
}

export function OTP() {
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(() =>
    initialSecondsFromExpiry(getOtpPending()?.otpExpiresAt),
  )
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const router = useRouter()
  const queryClient = useQueryClient()

  const isExpired = secondsLeft <= 0
  const canResend = isExpired

  const pendingSnapshot = getOtpPending()
  const otpDestinationLocal = pendingSnapshot
    ? toLocalThaiMobileDigits(pendingSnapshot.phoneDigits)
    : ''
  const otpDestinationMasked =
    otpDestinationLocal && validateLocalThaiMobile(otpDestinationLocal) === ''
      ? maskLocalThaiMobile(otpDestinationLocal)
      : null

  const startTimer = useCallback((fromSeconds: number) => {
    if (timerRef.current) clearInterval(timerRef.current)
    setSecondsLeft(fromSeconds)
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  useEffect(() => {
    const pending = getOtpPending()
    const sec = initialSecondsFromExpiry(pending?.otpExpiresAt)
    startTimer(sec)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [startTimer])

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      const input = document.querySelector<HTMLInputElement>(
        '[data-slot="input-otp"] input',
      )
      input?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  const focusInput = () => {
    requestAnimationFrame(() => {
      const input = document.querySelector<HTMLInputElement>(
        '[data-slot="input-otp"] input',
      )
      input?.focus({ preventScroll: true })
    })
  }

  const handleOtpChange = (value: string) => {
    setOtp(value)
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isExpired) {
      setError('รหัส OTP หมดอายุแล้ว กรุณากดส่งรหัสใหม่')
      return
    }

    if (otp.length !== 4) {
      setError('กรุณากรอกรหัส OTP ให้ครบ 4 หลัก')
      return
    }

    const pending = getOtpPending()
    if (!pending) {
      setError('เซสชันหมดอายุ กรุณาเริ่มเข้าสู่ระบบใหม่')
      return
    }

    const phone = toLocalThaiMobileDigits(pending.phoneDigits)
    if (validateLocalThaiMobile(phone)) {
      setError('เบอร์โทรในเซสชันไม่ถูกต้อง กรุณาเริ่มเข้าสู่ระบบใหม่')
      return
    }

    setIsSubmitting(true)
    try {
      const liffPayload = await getLiffIdTokenAndProfileForOtp()
      const idToken = liffPayload.idToken
      if (!idToken?.trim()) {
        setError(
          'ต้องล็อกอิน LINE ก่อนยืนยัน OTP — เปิดจาก LINE หรือลงชื่อเข้าใช้ LINE ในเบราว์เซอร์ และตั้งค่า VITE_LIFF_ID',
        )
        return
      }

      const res = await skmApi.post('/auth/customer/otp/verify', {
        phone,
        refCode: pending.refCode,
        otpCode: otp,
        nationalId: pending.nationalIdDigits,
        idToken,
        lineUserName: liffPayload.displayName,
        lineUserProfile: liffPayload.pictureUrl,
      })
      const data = unwrapData<{
        accessToken: string
        refreshToken: string
        customer: { legacyCustomerId: string; phone: string }
      }>(res)
      setCustomerTokens(data.accessToken, data.refreshToken)
      void queryClient.invalidateQueries({ queryKey: ['me-profile'] })
      void queryClient.invalidateQueries({ queryKey: ['me-contracts'] })

      clearOtpPending()
      showToast.success('ยืนยัน OTP สำเร็จ', 'ยินดีต้อนรับสู่ระบบจัดการค่างวดรถ')
      router.navigate({ to: '/', replace: true })
    } catch (err) {
      handleServerError(err)
      setError('รหัส OTP ไม่ถูกต้องหรือหมดอายุ กรุณาลองใหม่')
      setOtp('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendOtp = async () => {
    const pending = getOtpPending()
    if (!pending) {
      showToast.error('เซสชันหมดอายุ', 'กรุณาเริ่มเข้าสู่ระบบใหม่')
      return
    }
    const phone = toLocalThaiMobileDigits(pending.phoneDigits)
    if (validateLocalThaiMobile(phone)) {
      showToast.error('เซสชันไม่ถูกต้อง', 'กรุณาเริ่มเข้าสู่ระบบใหม่')
      return
    }
    try {
      const res = await skmApi.post('/auth/customer/otp/request', {
        phone,
        nationalId: pending.nationalIdDigits,
      })
      const data = unwrapData<{ refCode: string; expiresAt: string }>(res)
      patchOtpPending({ refCode: data.refCode, otpExpiresAt: data.expiresAt })
      setOtp('')
      setError('')
      startTimer(initialSecondsFromExpiry(data.expiresAt))
      showToast.info('ส่งรหัส OTP ใหม่แล้ว', 'ตรวจสอบ SMS')
      focusInput()
    } catch (e) {
      handleServerError(e)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">ยืนยันรหัส OTP</h1>
        <p className="text-gray-600 dark:text-gray-400">
          ระบบได้ส่งรหัส OTP ไปยังเบอร์โทรศัพท์ของคุณแล้ว
          {otpDestinationMasked ? (
            <>
              <br />
              <span className="font-medium text-gray-800 dark:text-gray-200">
                เบอร์ปลายทาง: {otpDestinationMasked}
              </span>
            </>
          ) : null}
          <br />
          กรุณากรอกรหัส 4 หลักที่ได้รับทาง SMS
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 justify-center">
            <Shield className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">รหัส OTP</label>
          </div>
          <div className="flex justify-center">
            <InputOTP
              autoFocus
              maxLength={4}
              value={otp}
              onChange={handleOtpChange}
              disabled={isSubmitting || isExpired}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {isExpired && (
            <p className="text-center text-xs font-medium text-red-500 dark:text-red-400">
              รหัส OTP หมดอายุแล้ว
            </p>
          )}

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
          )}
        </div>

        <MobileButton
          type="submit"
          className="w-full bg-[#EC1B2E] text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={otp.length !== 4 || isSubmitting || isExpired}
        >
          {isSubmitting ? 'กำลังยืนยัน...' : 'ยืนยันรหัส OTP'}
        </MobileButton>

        <div className="text-center">
          <button
            type="button"
            onClick={() => void handleResendOtp()}
            className="text-sm text-[#EC1B2E] hover:text-[#C20010] transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
            disabled={!canResend || isSubmitting}
          >
            <MessageSquare className="inline h-4 w-4 mr-1" />
            {canResend ? 'ส่งรหัส OTP ใหม่' : `ส่งรหัสใหม่ได้ใน ${formatTime(secondsLeft)}`}
          </button>
        </div>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          ไม่ได้รับรหัส OTP?{' '}
          <Link
            to="/contact-support"
            className="font-medium text-[#EC1B2E] hover:text-[#C20010] transition-colors"
          >
            ติดต่อเจ้าหน้าที่
          </Link>
        </p>
      </div>
    </div>
  )
}
