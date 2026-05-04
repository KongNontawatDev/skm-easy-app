import { createFileRoute, redirect } from '@tanstack/react-router'
import { SignIn } from '@/features/auth/sign-in'
import { AuthLayout } from '@/components/auth/auth-layout'
import { isCustomerAccessTokenValid } from '@/lib/customer-session'
import { consumePendingLiffStateDeepLink } from '@/lib/liff-state-deeplink'

export const Route = createFileRoute('/sign-in')({
  beforeLoad: () => {
    if (typeof window !== 'undefined' && isCustomerAccessTokenValid()) {
      throw redirect({ to: consumePendingLiffStateDeepLink() ?? '/', replace: true } as never)
    }
  },
  component: SignInRoute,
})

function SignInRoute() {
  return (
    <AuthLayout>
      <SignIn />
    </AuthLayout>
  )
}
