import { MockApiService } from '@/lib/mock-api'
import { mockCoupons } from '../data/mock-data'
import type { Coupon } from '../types'
import type { QueryParams } from '@/lib/api-types'

export class CouponApiService {
  // Get all coupons with pagination and filters
  static async getCoupons(params?: QueryParams) {
    // Simulate filtering and pagination
    let filteredCoupons = [...mockCoupons]
    
    if (params?.search) {
      const searchTerm = params.search.toLowerCase()
      filteredCoupons = filteredCoupons.filter(coupon =>
        coupon.title.toLowerCase().includes(searchTerm) ||
        coupon.description.toLowerCase().includes(searchTerm)
      )
    }

    // Filter by category if provided (if coupon has category property)
    if (params?.category) {
      const cat = params.category
      filteredCoupons = filteredCoupons.filter(
        (coupon) => 'category' in coupon && coupon.category === cat,
      )
    }

    // Filter by status if provided
    if (params?.status) {
      filteredCoupons = filteredCoupons.filter(coupon => 
        coupon.status === params.status
      )
    }

    // Simulate pagination
    const page = params?.page || 1
    const limit = params?.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedCoupons = filteredCoupons.slice(startIndex, endIndex)

    return MockApiService.get<Coupon[]>('/coupons', params)
      .then(response => ({
        ...response,
        data: paginatedCoupons,
        pagination: {
          page,
          pageSize: limit,
          total: filteredCoupons.length,
          pageCount: Math.ceil(filteredCoupons.length / limit)
        }
      }))
  }

  // Get coupon by ID
  static async getCoupon(id: string) {
    const coupon = mockCoupons.find(c => c.id === id)
    if (!coupon) {
      throw new Error('Coupon not found')
    }
    return MockApiService.get<Coupon>(`/coupons/${id}`)
      .then(response => ({
        ...response,
        data: coupon
      }))
  }

  // Claim coupon
  static async claimCoupon(id: string) {
    const coupon = mockCoupons.find(c => c.id === id)
    if (!coupon) {
      throw new Error('Coupon not found')
    }
    
    if (coupon.status !== 'available') {
      throw new Error('Coupon is not available')
    }

    // Simulate claiming
    const claimedCoupon = {
      ...coupon,
      status: 'claimed' as const,
      claimedAt: new Date().toISOString()
    }

    return MockApiService.post<Coupon>(`/coupons/${id}/claim`, claimedCoupon)
      .then(response => ({
        ...response,
        data: claimedCoupon
      }))
  }

  /** บันทึกการใช้คูปองที่ร้าน (ไม่ใช่ React hook — ชื่อเดิม useCoupon ชนกับ eslint react-hooks/rules-of-hooks) */
  static async redeemCoupon(id: string, storeId?: string) {
    const coupon = mockCoupons.find(c => c.id === id)
    if (!coupon) {
      throw new Error('Coupon not found')
    }
    
    if (coupon.status !== 'claimed') {
      throw new Error('Coupon is not claimed')
    }

    // Simulate using
    const usedCoupon = {
      ...coupon,
      status: 'used' as const,
      usedAt: new Date().toISOString(),
      storeId
    }

    return MockApiService.post<Coupon>(`/coupons/${id}/use`, usedCoupon)
      .then(response => ({
        ...response,
        data: usedCoupon
      }))
  }

  // Get available coupons
  static async getAvailableCoupons(params?: QueryParams) {
    return this.getCoupons({ ...params, status: 'available' })
  }

  // Get user's claimed coupons
  static async getClaimedCoupons(params?: QueryParams) {
    return this.getCoupons({ ...params, status: 'claimed' })
  }

  // Get user's used coupons
  static async getUsedCoupons(params?: QueryParams) {
    return this.getCoupons({ ...params, status: 'used' })
  }
}
