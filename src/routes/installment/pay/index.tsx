import { createFileRoute } from '@tanstack/react-router'
import { PaymentList } from '@/features/installment/payment'

export const Route = createFileRoute('/installment/pay/')({
  component: () => <PaymentList />,
})