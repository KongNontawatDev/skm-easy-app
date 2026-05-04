import { createFileRoute } from '@tanstack/react-router'
import { PrivacyPolicy } from '@/features/settings/privacy-policy'

export const Route = createFileRoute('/settings/privacy-policy')({
  component: PrivacyPolicy,
})
