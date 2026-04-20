import { createFileRoute } from '@tanstack/react-router'
import { ReceiptDetail } from '@/features/receipt/receipt-detail'

export const Route = createFileRoute('/receipt/detail/$receiptId')({
  component: () => <ReceiptDetail />,
})