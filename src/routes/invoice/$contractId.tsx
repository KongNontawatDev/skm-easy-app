import { createFileRoute } from '@tanstack/react-router'
import { InvoiceList } from '@/features/invoice/invoice-list'

export const Route = createFileRoute('/invoice/$contractId')({
  component: () => <InvoiceList />,
})