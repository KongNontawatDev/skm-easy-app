import { createFileRoute } from '@tanstack/react-router'
import { CreditCheckPage } from '@/features/refinance'

export const Route = createFileRoute('/credit-check')({
  component: CreditCheckPage,
})