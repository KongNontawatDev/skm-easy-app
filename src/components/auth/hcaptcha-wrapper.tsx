import { useRef, forwardRef, useImperativeHandle } from 'react'
import HCaptcha from '@hcaptcha/react-hcaptcha'

interface HCaptchaWrapperProps {
  onVerify: (token: string) => void
  onExpire?: () => void
  onError?: (error: string) => void
  siteKey: string
  theme?: 'light' | 'dark'
  size?: 'normal' | 'compact'
  className?: string
}

export interface HCaptchaWrapperRef {
  resetCaptcha: () => void
}

export const HCaptchaWrapper = forwardRef<HCaptchaWrapperRef, HCaptchaWrapperProps>(({
  onVerify,
  onExpire,
  onError,
  siteKey,
  theme = 'light',
  size = 'normal',
  className = ''
}, ref) => {
  const captchaRef = useRef<HCaptcha>(null)

  const handleVerify = (token: string) => {
    onVerify(token)
  }

  const handleExpire = () => {
    onExpire?.()
  }

  const handleError = (error: string) => {
    onError?.(error)
  }

  const resetCaptcha = () => {
    captchaRef.current?.resetCaptcha()
  }

  useImperativeHandle(ref, () => ({
    resetCaptcha
  }))

  return (
    <div className={`flex justify-center ${className}`}>
      <HCaptcha
        ref={captchaRef as React.RefObject<HCaptcha>}
        sitekey={siteKey}
        onVerify={handleVerify}
        onExpire={handleExpire}
        onError={handleError}
        theme={theme}
        size={size}
      />
    </div>
  )
})
