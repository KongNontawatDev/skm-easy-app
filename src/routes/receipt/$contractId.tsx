import { createFileRoute } from '@tanstack/react-router'
import { ReceiptList } from '@/features/receipt/receipt-list'

export const Route = createFileRoute('/receipt/$contractId')({
  component: () => <ReceiptList />,
})