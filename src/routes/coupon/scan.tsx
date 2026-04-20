import { createFileRoute } from '@tanstack/react-router'
import { CouponScan } from '@/features/coupon'

export const Route = createFileRoute('/coupon/scan')({
  component: () => <CouponScan />,
})