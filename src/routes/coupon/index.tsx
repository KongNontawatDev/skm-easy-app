import { createFileRoute } from '@tanstack/react-router'
import { Coupon } from '@/features/coupon'

export const Route = createFileRoute('/coupon/')({
  component: Coupon,
})