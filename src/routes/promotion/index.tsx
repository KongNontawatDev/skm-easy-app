import { createFileRoute } from '@tanstack/react-router'
import { Promotion } from '@/features/promotion'

export const Route = createFileRoute('/promotion/')({
  component: () => <Promotion />,
})
