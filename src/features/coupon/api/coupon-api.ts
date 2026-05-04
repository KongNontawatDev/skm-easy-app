/**
 * Coupon API Service — placeholder for production
 * คูปองยังไม่มี API จริง — แสดง "เร็วๆ นี้" ใน UI
 */
import type { Coupon } from '../types'
import type { ApiResponse, QueryParams } from '@/lib/api-types'

const emptyResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  message: 'No data',
  data,
  statusCode: 200,
})

export class CouponApiService {
  static async getCoupons(_params?: QueryParams): Promise<ApiResponse<Coupon[]>> {
    return emptyResponse<Coupon[]>([])
  }

  static async getCoupon(_id: string): Promise<ApiResponse<Coupon | null>> {
    return emptyResponse<Coupon | null>(null)
  }

  static async claimCoupon(_id: string): Promise<ApiResponse<Coupon | null>> {
    throw new Error('ฟีเจอร์คูปองยังไม่เปิดให้บริการ')
  }

  static async redeemCoupon(_id: string, _storeId?: string): Promise<ApiResponse<Coupon | null>> {
    throw new Error('ฟีเจอร์คูปองยังไม่เปิดให้บริการ')
  }

  static async getAvailableCoupons(params?: QueryParams) {
    return this.getCoupons({ ...params, status: 'available' })
  }

  static async getClaimedCoupons(params?: QueryParams) {
    return this.getCoupons({ ...params, status: 'claimed' })
  }

  static async getUsedCoupons(params?: QueryParams) {
    return this.getCoupons({ ...params, status: 'used' })
  }
}
