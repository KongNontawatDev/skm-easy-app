import { createFileRoute } from '@tanstack/react-router'
import { TicketDetail } from '@/features/ticket'

export const Route = createFileRoute('/ticket/$id')({
  component: () => <TicketDetail />,
})
