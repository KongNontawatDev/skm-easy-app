import { createFileRoute, redirect } from '@tanstack/react-router'
import { OTP } from '@/features/auth/otp'
import { AuthLayout } from '@/components/auth/auth-layout'
import { getOtpPending } from '@/lib/auth-pending-otp'

export const Route = createFileRoute('/otp')({
  beforeLoad: () => {
    if (!getOtpPending()) {
      throw redirect({ to: '/sign-in', replace: true })
    }
  },
  component: () => (
    <AuthLayout>
      <OTP />
    </AuthLayout>
  ),
})
