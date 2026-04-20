import { useApiQuery, useApiQueryById, useApiQueryList } from '@/hooks/useApiQuery'
import { CouponApiService } from '../api/coupon-api'
import { type QueryParams } from '@/lib/api-types'

// Get all coupons with pagination and filters
export function useCoupons(params?: QueryParams) {
  return useApiQueryList(
    'coupons',
    params,
    () => CouponApiService.getCoupons(params)
  )
}

// Get coupon by ID
export function useCoupon(id: string) {
  return useApiQueryById(
    'coupons',
    id,
    () => CouponApiService.getCoupon(id)
  )
}

// Get available coupons
export function useAvailableCoupons(params?: QueryParams) {
  return useApiQueryList(
    'coupons',
    { ...params, status: 'available' },
    () => CouponApiService.getAvailableCoupons(params)
  )
}

// Get claimed coupons
export function useClaimedCoupons(params?: QueryParams) {
  return useApiQueryList(
    'coupons',
    { ...params, status: 'claimed' },
    () => CouponApiService.getClaimedCoupons(params)
  )
}

// Get used coupons
export function useUsedCoupons(params?: QueryParams) {
  return useApiQueryList(
    'coupons',
    { ...params, status: 'used' },
    () => CouponApiService.getUsedCoupons(params)
  )
}

// Get featured coupons (for home page)
export function useFeaturedCoupons(limit: number = 6) {
  return useApiQuery(
    ['coupons', 'featured', limit],
    () => CouponApiService.getAvailableCoupons({ limit })
  )
}
