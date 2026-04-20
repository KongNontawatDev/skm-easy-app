import { createFileRoute } from '@tanstack/react-router'
import { Notification } from '@/features/notification'

export const Route = createFileRoute('/notification/')({
  component: () => <Notification />,
})