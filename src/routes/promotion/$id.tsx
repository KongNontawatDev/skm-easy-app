import { createFileRoute } from '@tanstack/react-router'
import { PromotionDetail } from '@/features/promotion'

export const Route = createFileRoute('/promotion/$id')({
  component: () => <PromotionDetail />,
})
