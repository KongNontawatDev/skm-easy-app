import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { 
  MobileLayout, 
  MobileHeader, 
  MobileContent, 
  BottomNavigation,
  MobileButton
} from '@/components/mobile'
import { CategoryFilter } from './components/category-filter'
import type { CouponCategory } from './types'

const couponCategories: CouponCategory[] = [
  { id: '1', name: 'ทั้งหมด', icon: '🎫', color: 'bg-gray-50 text-gray-600' },
  { id: '2', name: 'คูปองของฉัน', icon: '📱', color: 'bg-blue-50 text-blue-600' },
  { id: '3', name: 'ใช้แล้ว', icon: '✅', color: 'bg-green-50 text-green-600' },
  { id: '4', name: 'หมดอายุ', icon: '⏰', color: 'bg-red-50 text-red-600' },
]
import { useAvailableCoupons, useClaimedCoupons, useUsedCoupons } from './hooks'
import { QrCode, Clock, CheckCircle, XCircle } from 'lucide-react'

export function Coupon() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('2') // เริ่มต้นที่ "คูปองของฉัน"

  // Use API hooks based on selected category
  const { data: availableCouponsResponse } = useAvailableCoupons()
  const { data: claimedCouponsResponse } = useClaimedCoupons()
  const { data: usedCouponsResponse } = useUsedCoupons()

  const getFilteredCoupons = () => {
    switch (selectedCategory) {
      case '1': // ทั้งหมด
        return [
          ...(availableCouponsResponse?.data || []),
          ...(claimedCouponsResponse?.data || []),
          ...(usedCouponsResponse?.data || [])
        ]
      case '2': // คูปองของฉัน
        return [
          ...(claimedCouponsResponse?.data || []),
          ...(usedCouponsResponse?.data || [])
        ]
      case '3': // ใช้แล้ว
        return usedCouponsResponse?.data || []
      case '4': // หมดอายุ
        return usedCouponsResponse?.data || []
      default:
        return []
    }
  }

  const filteredCoupons = getFilteredCoupons()
  // const isLoading = isLoadingAvailable || isLoadingClaimed || isLoadingUsed

  const handleViewDetail = (couponId: string) => {
    router.navigate({ to: `/coupon/${couponId}` })
  }

  const handleUseQR = (couponId: string) => {
    router.navigate({ to: '/coupon/qrcode', search: { couponId } })
  }

  const handleClaimCoupon = (_couponId: string) => {
    // ในแอพจริงจะเป็นการเรียก API เพื่อรับคูปอง
    // TODO: Implement actual coupon claiming API
    // อัปเดตสถานะคูปองเป็น 'claimed'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <QrCode className="w-4 h-4" />
      case 'claimed':
        return <Clock className="w-4 h-4" />
      case 'used':
        return <CheckCircle className="w-4 h-4" />
      case 'expired':
        return <XCircle className="w-4 h-4" />
      default:
        return <QrCode className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'รับได้'
      case 'claimed':
        return 'รับแล้ว'
      case 'used':
        return 'ใช้แล้ว'
      case 'expired':
        return 'หมดอายุ'
      default:
        return 'ไม่ทราบ'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700'
      case 'claimed':
        return 'bg-blue-100 text-blue-700'
      case 'used':
        return 'bg-gray-100 text-gray-700'
      case 'expired':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <MobileLayout>
      <MobileHeader title="คูปองของฉัน" showMoreMenu={true} />
      
      <MobileContent className="pb-20">
        <div className="space-y-6">
          {/* Category Filter */}
          <CategoryFilter
            categories={couponCategories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">คูปองที่รับได้</p>
                  <p className="text-2xl font-bold text-green-600">
                    {availableCouponsResponse?.data?.length || 0}
                  </p>
                </div>
                <QrCode className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">คูปองของฉัน</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {claimedCouponsResponse?.data?.length || 0}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Coupons List */}
          <div className="space-y-4">
            {filteredCoupons.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎫</span>
                </div>
                <p className="text-lg font-medium text-gray-900 mb-2">ไม่มีคูปอง</p>
                <p className="text-gray-500">ไม่มีคูปองในหมวดหมู่นี้</p>
              </div>
            ) : (
              filteredCoupons.map((coupon) => (
                <div key={coupon.id} className="bg-white rounded-2xl p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#EC1B2E] to-[#C20010] rounded-xl flex items-center justify-center">
                      <span className="text-white text-2xl">🎫</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{coupon.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(coupon.status)}`}>
                          {getStatusIcon(coupon.status)}
                          <span>{getStatusText(coupon.status)}</span>
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{coupon.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          {coupon.storeName && <p>ร้าน: {coupon.storeName}</p>}
                          {coupon.remainingTime && (
                            <p>เหลือเวลา: {Math.floor(coupon.remainingTime / 3600)} ชม. {Math.floor((coupon.remainingTime % 3600) / 60)} นาที</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {coupon.status === 'available' && (
                            <MobileButton
                              size="sm"
                              onClick={() => handleClaimCoupon(coupon.id)}
                            >
                              เก็บ
                            </MobileButton>
                          )}
                          {coupon.status === 'claimed' && (
                            <MobileButton
                              size="sm"
                              onClick={() => handleUseQR(coupon.id)}
                            >
                              ใช้
                            </MobileButton>
                          )}
                          <MobileButton
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetail(coupon.id)}
                          >
                              ดู
                          </MobileButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Scan Button */}
          <div className="bg-gradient-to-r from-[#EC1B2E] to-[#C20010] rounded-2xl p-4 text-white text-center">
            <h3 className="text-lg font-semibold mb-2">สแกนรับคูปอง</h3>
            <p className="text-white/90 text-sm mb-4">สแกน QR Code ที่ร้านเพื่อรับคูปอง</p>
            <MobileButton
              variant="outline"
              className="bg-white text-[#EC1B2E] hover:bg-gray-100"
              onClick={() => router.navigate({ to: '/coupon/scan' })}
            >
              <QrCode className="w-4 h-4 mr-2" />
              เปิดกล้องสแกน
            </MobileButton>
          </div>
        </div>
      </MobileContent>

      <BottomNavigation currentPath="/coupon" />
    </MobileLayout>
  )
}
