import { useApiMutation } from '@/hooks/useApiMutation'
import { CouponApiService } from '../api/coupon-api'
import type { Coupon } from '../types'

// Claim coupon mutation
export function useClaimCoupon() {
  return useApiMutation<Coupon, string>(
    (id) => CouponApiService.claimCoupon(id),
    {},
  )
}

// Use coupon mutation
export function useUseCoupon() {
  return useApiMutation<Coupon, { id: string; storeId?: string }>(
    ({ id, storeId }) => CouponApiService.redeemCoupon(id, storeId),
    {}
  )
}
