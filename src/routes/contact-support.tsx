import { createFileRoute } from '@tanstack/react-router'
import { ContactSupport } from '@/features/auth/contact-support'
import { AuthLayout } from '@/components/auth/auth-layout'

export const Route = createFileRoute('/contact-support')({
  component: () => (
    <AuthLayout>
      <ContactSupport />
    </AuthLayout>
  ),
})
