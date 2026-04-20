import { createFileRoute } from '@tanstack/react-router'
import { CouponDetail } from '@/features/coupon'

export const Route = createFileRoute('/coupon/$id')({
  component: CouponDetail,
})