import { createFileRoute } from '@tanstack/react-router'
import { NotificationDetail } from '@/features/notification'

export const Route = createFileRoute('/notification/$id')({
  component: () => <NotificationDetail />,
})