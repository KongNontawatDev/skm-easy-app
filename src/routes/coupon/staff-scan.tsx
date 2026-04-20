import { createFileRoute } from '@tanstack/react-router'
import { StaffScan } from '@/features/coupon'

export const Route = createFileRoute('/coupon/staff-scan')({
  component: () => <StaffScan />,
})