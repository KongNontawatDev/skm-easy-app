import { createFileRoute } from '@tanstack/react-router'
import { CouponQRCode } from '@/features/coupon'

export const Route = createFileRoute('/coupon/qrcode')({
  component: CouponQRCode,
})