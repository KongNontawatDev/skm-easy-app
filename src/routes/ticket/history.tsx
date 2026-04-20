import { createFileRoute } from '@tanstack/react-router'
import { TicketHistory } from '@/features/ticket'

export const Route = createFileRoute('/ticket/history')({
  component: () => <TicketHistory />,
})