import { 
  MobileButton,
  MobileInput
} from '@/components/mobile'
import { HCaptchaWrapper, type HCaptchaWrapperRef } from '@/components/auth/hcaptcha-wrapper'
import { 
  CreditCard, 
  Phone,
  Shield
} from 'lucide-react'
import { useState, useRef } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { showToast } from '@/lib/toast'
import { setOtpPending } from '@/lib/auth-pending-otp'
import { skmApi, unwrapData } from '@/lib/skm-api'
import { handleServerError } from '@/lib/handle-server-error'
import { toLocalThaiMobileDigits, validateLocalThaiMobile } from '@/lib/thai-mobile'

const REMEMBER_KEY = 'skm_remember_signin'

function loadRemembered(): { nationalId: string; phoneNumber: string } | null {
  try {
    const raw = localStorage.getItem(REMEMBER_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (typeof data?.nationalId === 'string' && typeof data?.phoneNumber === 'string') {
      return data
    }
    return null
  } catch {
    return null
  }
}

function saveRemembered(nationalId: string, phoneNumber: string) {
  localStorage.setItem(REMEMBER_KEY, JSON.stringify({ nationalId, phoneNumber }))
}

function clearRemembered() {
  localStorage.removeItem(REMEMBER_KEY)
}

export function SignIn() {
  const remembered = loadRemembered()
  const [formData, setFormData] = useState({
    nationalId: remembered?.nationalId ?? '',
    phoneNumber: remembered?.phoneNumber ?? '',
  })
  const [errors, setErrors] = useState({
    nationalId: '',
    phoneNumber: '',
    captcha: ''
  })
  const [_captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false)
  const [rememberMe, setRememberMe] = useState(!!remembered)
  const captchaRef = useRef<HCaptchaWrapperRef>(null)
  const router = useRouter()

  // hCaptcha site key (ใช้ test key สำหรับ development)
  const HCAPTCHA_SITE_KEY = '14aee74e-f122-4974-b2f2-0d8cfbc08a86'

  const validateNationalId = (id: string) => {
    // Remove all non-digits
    const cleanId = id.replace(/\D/g, '')
    
    if (cleanId.length !== 13) {
      return 'เลขบัตรประชาชนต้องมี 13 หลัก'
    }
    
    // Thai National ID validation algorithm
    let sum = 0
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleanId[i]) * (13 - i)
    }
    const checkDigit = (11 - (sum % 11)) % 10
    
    if (parseInt(cleanId[12]) !== checkDigit) {
      return 'เลขบัตรประชาชนไม่ถูกต้อง'
    }
    
    return ''
  }

  const validatePhoneNumber = (phone: string) => {
    const local = toLocalThaiMobileDigits(phone)
    return validateLocalThaiMobile(local)
  }

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token)
    setIsCaptchaVerified(true)
    setErrors(prev => ({ ...prev, captcha: '' }))
  }

  const handleCaptchaExpire = () => {
    setCaptchaToken(null)
    setIsCaptchaVerified(false)
  }

  const handleCaptchaError = () => {
    setCaptchaToken(null)
    setIsCaptchaVerified(false)
    setErrors(prev => ({ ...prev, captcha: 'เกิดข้อผิดพลาดในการยืนยันตัวตน' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const nationalIdError = validateNationalId(formData.nationalId)
    const phoneError = validatePhoneNumber(formData.phoneNumber)
    const captchaError = !isCaptchaVerified ? 'กรุณายืนยันตัวตน' : ''

    setErrors({
      nationalId: nationalIdError,
      phoneNumber: phoneError,
      captcha: captchaError,
    })

    if (nationalIdError || phoneError || captchaError) {
      return
    }

    const nationalIdDigits = formData.nationalId.replace(/\D/g, '')
    const phone = toLocalThaiMobileDigits(formData.phoneNumber)

    if (rememberMe) {
      saveRemembered(formData.nationalId, formData.phoneNumber)
    } else {
      clearRemembered()
    }

    const loadingToast = showToast.loading('กำลังส่งรหัส OTP...')
    try {
      const res = await skmApi.post('/auth/customer/otp/request', {
        phone,
        nationalId: nationalIdDigits,
      })
      const data = unwrapData<{ sent: boolean; refCode: string; expiresAt: string }>(res)
      setOtpPending({
        nationalIdDigits,
        phoneDigits: phone,
        refCode: data.refCode,
        otpExpiresAt: data.expiresAt,
      })
      showToast.dismiss(loadingToast)
      showToast.success('ส่งรหัส OTP สำเร็จ', 'กรุณาตรวจสอบข้อความ SMS')
      router.navigate({ to: '/otp' })
    } catch (err) {
      showToast.dismiss(loadingToast)
      handleServerError(err)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const formatNationalId = (value: string) => {
    // Remove all non-digits
    const cleanValue = value.replace(/\D/g, '')
    
    // Format as X-XXXX-XXXXX-XX-X
    if (cleanValue.length <= 1) return cleanValue
    if (cleanValue.length <= 5) return `${cleanValue.slice(0, 1)}-${cleanValue.slice(1)}`
    if (cleanValue.length <= 10) return `${cleanValue.slice(0, 1)}-${cleanValue.slice(1, 5)}-${cleanValue.slice(5)}`
    if (cleanValue.length <= 12) return `${cleanValue.slice(0, 1)}-${cleanValue.slice(1, 5)}-${cleanValue.slice(5, 10)}-${cleanValue.slice(10)}`
    return `${cleanValue.slice(0, 1)}-${cleanValue.slice(1, 5)}-${cleanValue.slice(5, 10)}-${cleanValue.slice(10, 12)}-${cleanValue.slice(12, 13)}`
  }

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const cleanValue = value.replace(/\D/g, '')
    
    // Format as XXX-XXX-XXXX
    if (cleanValue.length <= 3) return cleanValue
    if (cleanValue.length <= 6) return `${cleanValue.slice(0, 3)}-${cleanValue.slice(3)}`
    return `${cleanValue.slice(0, 3)}-${cleanValue.slice(3, 6)}-${cleanValue.slice(6, 10)}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">ยืนยันตัวตนกับร้าน</h1>
        <p className="text-gray-600 text-sm leading-relaxed px-1">
          คุณเข้าสู่ระบบด้วย LINE แล้ว — กรุณากรอกเลขบัตรประชาชนและเบอร์โทรให้ตรงกับข้อมูลที่ร้านมี
          เพื่อแมปบัญชี LINE ของคุณ (ครั้งแรกเท่านั้น)
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">เลขบัตรประชาชน</label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <MobileInput
              type="text"
              placeholder="กรอกเลขบัตรประชาชน 13 หลัก"
              value={formData.nationalId}
              onChange={(e) => {
                const formatted = formatNationalId(e.target.value)
                handleInputChange('nationalId', formatted)
              }}
              className="pl-10"
              maxLength={17} // X-XXXX-XXXXX-XX-X format
              required
            />
          </div>
          {errors.nationalId && (
            <p className="text-sm text-red-600">{errors.nationalId}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">เบอร์โทรศัพท์</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <MobileInput
              type="tel"
              placeholder="กรอกเบอร์โทรศัพท์ 10 หลัก"
              value={formData.phoneNumber}
              onChange={(e) => {
                const formatted = formatPhoneNumber(e.target.value)
                handleInputChange('phoneNumber', formatted)
              }}
              className="pl-10"
              maxLength={12} // XXX-XXX-XXXX format
              required
            />
          </div>
          {errors.phoneNumber && (
            <p className="text-sm text-red-600">{errors.phoneNumber}</p>
          )}
        </div>

        {/* hCaptcha */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-gray-500" />
            <label className="text-sm font-medium text-gray-700">ยืนยันตัวตน</label>
          </div>
          <HCaptchaWrapper
            ref={captchaRef}
            siteKey={HCAPTCHA_SITE_KEY}
            onVerify={handleCaptchaVerify}
            onExpire={handleCaptchaExpire}
            onError={handleCaptchaError}
            theme="light"
            size="normal"
            className="py-2"
          />
          {errors.captcha && (
            <p className="text-sm text-red-600">{errors.captcha}</p>
          )}
        </div>

        <div className="flex items-center">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-gray-300 text-[#EC1B2E] focus:ring-[#EC1B2E]"
            />
            <span className="ml-2 text-sm text-gray-600">จดจำฉัน</span>
          </label>
        </div>

        <MobileButton 
          type="submit" 
          className="w-full bg-[#EC1B2E] text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={!isCaptchaVerified}
        >
          {isCaptchaVerified ? 'ยืนยัน' : 'กรุณายืนยันตัวตนก่อน'}
        </MobileButton>
      </form>

     
      {/* Help Text */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          หากมีปัญหาในการเข้าสู่ระบบ{' '}
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
