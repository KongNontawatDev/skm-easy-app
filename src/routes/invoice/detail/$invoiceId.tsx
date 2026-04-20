import { createFileRoute } from '@tanstack/react-router'
import { InvoiceDetail } from '@/features/invoice/invoice-detail'

export const Route = createFileRoute('/invoice/detail/$invoiceId')({
  component: () => <InvoiceDetail />,
})