export interface Coupon {
  id: string
  title: string
  description: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minAmount?: number
  maxDiscount?: number
  validFrom: string
  validUntil: string
  isActive: boolean
  usageLimit?: number
  usedCount: number
  imageUrl?: string
  qrCode?: string
  terms: string[]
  // ข้อมูลใหม่สำหรับระบบคูปอง
  status: 'available' | 'claimed' | 'used' | 'expired' // สถานะคูปอง
  claimedAt?: string // วันที่รับคูปอง
  usedAt?: string // วันที่ใช้คูปอง
  storeId?: string // รหัสร้านที่ให้คูปอง
  storeName?: string // ชื่อร้าน
  remainingTime?: number // เวลาที่เหลือ (วินาที)
  isLimited: boolean // มีจำนวนจำกัดหรือไม่
  remainingCount?: number // จำนวนที่เหลือ
  /** ใช้กรอง mock API เมื่อส่ง category ใน QueryParams */
  category?: string
}

export interface CouponCategory {
  id: string
  name: string
  icon: string
  color: string
}

export interface CouponUsage {
  id: string
  couponId: string
  usedAt: string
  amount: number
  discount: number
  status: 'used' | 'expired' | 'cancelled'
}

// ข้อมูลสำหรับการสแกนคูปอง
export interface CouponScan {
  id: string
  couponId: string
  scannedAt: string
  storeId: string
  staffId: string
  status: 'pending' | 'verified' | 'used' | 'invalid'
}

// ข้อมูลร้านค้า
export interface Store {
  id: string
  name: string
  address: string
  phone: string
  qrCode: string
  isActive: boolean
}
