import { createFileRoute } from '@tanstack/react-router'
import { PaymentDetail } from '@/features/installment/payment/detail'

export const Route = createFileRoute('/installment/pay/$id')({
  component: () => <PaymentDetail />,
})