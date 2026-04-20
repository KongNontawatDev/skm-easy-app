import { useParams, useRouter } from '@tanstack/react-router'
import { 
  MobileLayout, 
  MobileHeader, 
  MobileContent, 
  BottomNavigation,
  MobileButton
} from '@/components/mobile'
import { QrCode, Calendar, Users, CheckCircle, XCircle, Clock, MapPin, AlertTriangle } from 'lucide-react'
import { mockCoupons } from './data/mock-data'

export function CouponDetail() {
  const { id } = useParams({ from: '/coupon/$id' })
  const router = useRouter()
  
  const coupon = mockCoupons.find(c => c.id === id)

  if (!coupon) {
    return (
      <MobileLayout>
        <MobileHeader title="ไม่พบคูปอง" />
        <MobileContent className="pb-20">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">ไม่พบคูปอง</p>
            <p className="text-gray-500">คูปองที่คุณค้นหาไม่มีอยู่</p>
          </div>
        </MobileContent>
        <BottomNavigation currentPath="/coupon" />
      </MobileLayout>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const getDiscountText = () => {
    if (coupon.discountType === 'percentage') {
      return `ลด ${coupon.discountValue}%`
    } else {
      return `ลด ${coupon.discountValue.toLocaleString()} บาท`
    }
  }

  const getStatusInfo = () => {
    switch (coupon.status) {
      case 'available':
        return {
          text: 'รับได้',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: <CheckCircle className="w-4 h-4" />
        }
      case 'claimed':
        return {
          text: 'รับแล้ว',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          icon: <Clock className="w-4 h-4" />
        }
      case 'used':
        return {
          text: 'ใช้แล้ว',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          icon: <CheckCircle className="w-4 h-4" />
        }
      case 'expired':
        return {
          text: 'หมดอายุ',
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          icon: <XCircle className="w-4 h-4" />
        }
      default:
        return {
          text: 'ไม่ทราบ',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          icon: <AlertTriangle className="w-4 h-4" />
        }
    }
  }

  const statusInfo = getStatusInfo()

  const isExpired = new Date(coupon.validUntil) < new Date()
  const isUsedUp = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit

  return (
    <MobileLayout>
      <MobileHeader title="รายละเอียดคูปอง" />
      
      <MobileContent className="pb-20">
        <div className="space-y-6">
          {/* Coupon Image */}
          {coupon.imageUrl && (
            <div className="relative h-48 rounded-2xl overflow-hidden">
              <img
                src={coupon.imageUrl}
                alt={coupon.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                {isExpired ? (
                  <span className="px-3 py-1 bg-red-500 text-white text-sm rounded-full">หมดอายุ</span>
                ) : isUsedUp ? (
                  <span className="px-3 py-1 bg-gray-500 text-white text-sm rounded-full">ใช้หมดแล้ว</span>
                ) : (
                  <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full">ใช้งานได้</span>
                )}
              </div>
            </div>
          )}

          {/* Coupon Info */}
          <div className="bg-white rounded-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{coupon.title}</h1>
                <p className="text-gray-600">{coupon.description}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${statusInfo.bgColor} ${statusInfo.color}`}>
                {statusInfo.icon}
                <span>{statusInfo.text}</span>
              </div>
            </div>

            {/* Discount Value */}
            <div className="bg-gradient-to-r from-[#EC1B2E] to-[#C20010] rounded-xl p-4 text-white text-center">
              <p className="text-sm text-white/80 mb-1">ส่วนลด</p>
              <p className="text-3xl font-bold">{getDiscountText()}</p>
              {coupon.minAmount && (
                <p className="text-sm text-white/80 mt-1">
                  ขั้นต่ำ {coupon.minAmount.toLocaleString()} บาท
                </p>
              )}
            </div>

            {/* Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-3" />
                  <span>วันที่เริ่มต้น</span>
                </div>
                <span className="font-medium">{formatDate(coupon.validFrom)}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-3" />
                  <span>วันที่หมดอายุ</span>
                </div>
                <span className="font-medium">{formatDate(coupon.validUntil)}</span>
              </div>

              {coupon.storeName && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-3" />
                    <span>ร้าน</span>
                  </div>
                  <span className="font-medium">{coupon.storeName}</span>
                </div>
              )}

              {coupon.claimedAt && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-3" />
                    <span>วันที่รับ</span>
                  </div>
                  <span className="font-medium">{formatDate(coupon.claimedAt)}</span>
                </div>
              )}

              {coupon.usedAt && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 mr-3" />
                    <span>วันที่ใช้</span>
                  </div>
                  <span className="font-medium">{formatDate(coupon.usedAt)}</span>
                </div>
              )}

              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center text-gray-600">
                  <Users className="w-5 h-5 mr-3" />
                  <span>จำนวนการใช้งาน</span>
                </div>
                <span className="font-medium">
                  {coupon.usedCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ''}
                </span>
              </div>

              {coupon.remainingCount && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center text-gray-600">
                    <AlertTriangle className="w-5 h-5 mr-3" />
                    <span>จำนวนที่เหลือ</span>
                  </div>
                  <span className="font-medium">{coupon.remainingCount} คูปอง</span>
                </div>
              )}

              {coupon.maxDiscount && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 mr-3" />
                    <span>ส่วนลดสูงสุด</span>
                  </div>
                  <span className="font-medium">{coupon.maxDiscount.toLocaleString()} บาท</span>
                </div>
              )}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-white rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">เงื่อนไขการใช้งาน</h3>
            <ul className="space-y-2">
              {coupon.terms.map((term, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-[#EC1B2E] rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">{term}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {coupon.status === 'available' && (
              <MobileButton
                onClick={() => {
                  // ในแอพจริงจะเป็นการเรียก API เพื่อรับคูปอง
                  // TODO: Implement actual coupon claiming API
                  alert('รับคูปองสำเร็จ!')
                }}
                className="w-full"
              >
                <QrCode className="w-5 h-5 mr-2" />
                รับคูปอง
              </MobileButton>
            )}

            {coupon.status === 'claimed' && (
              <MobileButton
                onClick={() => router.navigate({ to: '/coupon/qrcode', search: { couponId: coupon.id } })}
                className="w-full"
              >
                <QrCode className="w-5 h-5 mr-2" />
                ใช้คูปอง
              </MobileButton>
            )}

            {(coupon.status === 'used' || coupon.status === 'expired') && (
              <div className="w-full bg-gray-100 text-gray-500 py-4 rounded-xl font-semibold text-lg text-center">
                {coupon.status === 'used' ? 'ใช้แล้ว' : 'หมดอายุแล้ว'}
              </div>
            )}

          </div>
        </div>
      </MobileContent>

      <BottomNavigation currentPath="/profile" />
    </MobileLayout>
  )
}
