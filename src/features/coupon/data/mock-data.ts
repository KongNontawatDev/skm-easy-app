import type { Coupon, CouponCategory, CouponUsage, Store } from '../types'

export const mockCouponCategories: CouponCategory[] = [
  {
    id: '1',
    name: 'ทั้งหมด',
    icon: '🎫',
    color: 'bg-gray-50 text-gray-600'
  },
  {
    id: '2',
    name: 'คูปองของฉัน',
    icon: '📱',
    color: 'bg-blue-50 text-blue-600'
  },
  {
    id: '3',
    name: 'ใช้แล้ว',
    icon: '✅',
    color: 'bg-green-50 text-green-600'
  },
  {
    id: '4',
    name: 'หมดอายุ',
    icon: '⏰',
    color: 'bg-red-50 text-red-600'
  }
]

export const mockCoupons: Coupon[] = [
  {
    id: '1',
    title: 'ลดดอกเบี้ย 0.5%',
    description: 'สำหรับลูกค้า Honda ใหม่ที่สมัครในเดือนนี้',
    discountType: 'percentage',
    discountValue: 0.5,
    minAmount: 50000,
    maxDiscount: 2500,
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    isActive: true,
    usageLimit: 1000,
    usedCount: 234,
    imageUrl: 'https://s359.kapook.com/rq/600/auto/10/pagebuilder/d00209a5-b85a-4592-8cd5-3955b2d799c2.jpg',
    qrCode: 'COUPON-001-2026',
    terms: [
      'ใช้ได้เฉพาะลูกค้า Honda ใหม่',
      'ขั้นต่ำ 50,000 บาท',
      'ส่วนลดสูงสุด 2,500 บาท',
      'ไม่สามารถใช้ร่วมกับโปรโมชั่นอื่นได้'
    ],
    status: 'claimed',
    claimedAt: '2026-01-15T10:30:00Z',
    storeId: 'store-001',
    storeName: 'Honda ราชเทวี',
    remainingTime: 3600, // 1 ชั่วโมง
    isLimited: true,
    remainingCount: 50
  },
  {
    id: '2',
    title: 'ฟรีค่าธรรมเนียม',
    description: 'ยกเว้นค่าธรรมเนียมการโอนเงินสำหรับรถ Honda',
    discountType: 'fixed',
    discountValue: 50,
    minAmount: 5000,
    validFrom: '2026-01-01',
    validUntil: '2026-06-30',
    isActive: true,
    usageLimit: 500,
    usedCount: 89,
    imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=200&fit=crop',
    qrCode: 'COUPON-002-2026',
    terms: [
      'ใช้ได้ทุกวัน',
      'ขั้นต่ำ 5,000 บาท',
      'จำกัด 1 ครั้งต่อวัน',
      'ไม่สามารถโอนย้ายได้'
    ],
    status: 'used',
    claimedAt: '2026-01-10T14:20:00Z',
    usedAt: '2026-01-20T16:45:00Z',
    storeId: 'store-002',
    storeName: 'Honda สีลม',
    isLimited: false
  },
  {
    id: '3',
    title: 'ลด 500 บาท',
    description: 'สำหรับการชำระค่างวดรถ Honda',
    discountType: 'fixed',
    discountValue: 500,
    minAmount: 25000,
    validFrom: '2026-02-01',
    validUntil: '2026-02-28',
    isActive: true,
    usageLimit: 200,
    usedCount: 45,
    imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=200&fit=crop',
    qrCode: 'COUPON-003-2026',
    terms: [
      'ใช้ได้เฉพาะการชำระค่างวดรถ Honda',
      'ขั้นต่ำ 25,000 บาท',
      'ใช้ได้ 1 ครั้งต่อสัญญา',
      'หมดอายุ 28 ก.พ. 2569'
    ],
    status: 'expired',
    claimedAt: '2026-02-01T09:00:00Z',
    storeId: 'store-003',
    storeName: 'Honda ลาดพร้าว',
    isLimited: true,
    remainingCount: 0
  },
  {
    id: '4',
    title: 'ส่วนลด 10%',
    description: 'สำหรับการซื้ออะไหล่ Honda',
    discountType: 'percentage',
    discountValue: 10,
    minAmount: 1000,
    maxDiscount: 1000,
    validFrom: '2026-03-01',
    validUntil: '2026-03-31',
    isActive: true,
    usageLimit: 100,
    usedCount: 25,
    imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=200&fit=crop',
    qrCode: 'COUPON-004-2026',
    terms: [
      'ใช้ได้เฉพาะอะไหล่ Honda',
      'ขั้นต่ำ 1,000 บาท',
      'ส่วนลดสูงสุด 1,000 บาท',
      'ใช้ได้ 1 ครั้งต่อเดือน'
    ],
    status: 'available',
    storeId: 'store-004',
    storeName: 'Honda เอกมัย',
    remainingTime: 7200, // 2 ชั่วโมง
    isLimited: true,
    remainingCount: 75
  },
  {
    id: '5',
    title: 'ลดค่าธรรมเนียม 50%',
    description: 'สำหรับการชำระค่างวดล่วงหน้า 7 วันขึ้นไป',
    discountType: 'percentage',
    discountValue: 50,
    minAmount: 1000,
    validFrom: '2026-10-01',
    validUntil: '2026-12-31',
    isActive: true,
    usageLimit: 500,
    usedCount: 123,
    imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=200&fit=crop',
    qrCode: 'COUPON-005-2026',
    terms: [
      'ใช้ได้กับลูกค้า Honda ทุกคน',
      'ชำระล่วงหน้าอย่างน้อย 7 วัน',
      'ไม่สามารถใช้ร่วมกับโปรโมชั่นอื่นได้'
    ],
    status: 'available',
    storeId: 'store-001',
    storeName: 'Honda ราชเทวี',
    remainingTime: 86400, // 24 ชั่วโมง
    isLimited: true,
    remainingCount: 377
  },
  {
    id: '6',
    title: 'ฟรีค่าธรรมเนียม 1 ครั้ง',
    description: 'สำหรับลูกค้า Honda ใหม่ที่สมัครสมาชิก',
    discountType: 'fixed',
    discountValue: 0,
    minAmount: 0,
    validFrom: '2026-10-15',
    validUntil: '2026-11-15',
    isActive: true,
    usageLimit: 200,
    usedCount: 45,
    imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=200&fit=crop',
    qrCode: 'COUPON-006-2026',
    terms: [
      'สำหรับลูกค้า Honda ใหม่เท่านั้น',
      'ใช้ได้ 1 ครั้งต่อบัญชี',
      'ต้องสมัครสมาชิกก่อน 15 พ.ย. 2569'
    ],
    status: 'claimed',
    claimedAt: '2026-10-16T09:30:00Z',
    storeId: 'store-002',
    storeName: 'Honda สีลม',
    remainingTime: 259200, // 3 วัน
    isLimited: true,
    remainingCount: 155
  }
]

export const mockCouponUsage: CouponUsage[] = [
  {
    id: '1',
    couponId: '1',
    usedAt: '2026-01-15T10:30:00Z',
    amount: 150000,
    discount: 750,
    status: 'used'
  },
  {
    id: '2',
    couponId: '2',
    usedAt: '2026-01-20T14:15:00Z',
    amount: 25000,
    discount: 50,
    status: 'used'
  }
]

export const mockStores: Store[] = [
  {
    id: 'store-001',
    name: 'Honda ราชเทวี',
    address: '123 ถนนราชเทวี แขวงลพบุรี เขตราชเทวี กรุงเทพฯ 10400',
    phone: '02-123-4567',
    qrCode: 'STORE-001-QR',
    isActive: true
  },
  {
    id: 'store-002',
    name: 'Honda สีลม',
    address: '456 ถนนสีลม แขวงสีลม เขตบางรัก กรุงเทพฯ 10500',
    phone: '02-234-5678',
    qrCode: 'STORE-002-QR',
    isActive: true
  },
  {
    id: 'store-003',
    name: 'Honda ลาดพร้าว',
    address: '789 ถนนลาดพร้าว แขวงจอมพล เขตจตุจักร กรุงเทพฯ 10900',
    phone: '02-345-6789',
    qrCode: 'STORE-003-QR',
    isActive: true
  },
  {
    id: 'store-004',
    name: 'Honda เอกมัย',
    address: '321 ถนนเอกมัย แขวงคลองตัน เขตวัฒนา กรุงเทพฯ 10110',
    phone: '02-456-7890',
    qrCode: 'STORE-004-QR',
    isActive: true
  }
]
