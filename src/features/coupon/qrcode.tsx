import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearch } from '@tanstack/react-router'
import { 
  MobileLayout, 
  MobileHeader, 
  MobileContent, 
  BottomNavigation,
  MobileButton
} from '@/components/mobile'
import { QrCode, Camera, X, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { mockCoupons } from './data/mock-data'

export function CouponQRCode() {
  const router = useRouter()
  const search = useSearch({ from: '/coupon/qrcode' })
  const [isScanning, setIsScanning] = useState(false)
  const [scannedCode, setScannedCode] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [isExpired, setIsExpired] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const coupon = (search as { couponId?: string }).couponId ? mockCoupons.find(c => c.id === (search as { couponId: string }).couponId) : null

  // Countdown timer
  useEffect(() => {
    if (coupon && coupon.remainingTime) {
      setTimeLeft(coupon.remainingTime)
    }
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsExpired(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [coupon])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsScanning(true)
      }
    } catch (_error) {
      // TODO: Implement proper error handling
      alert('ไม่สามารถเข้าถึงกล้องได้ กรุณาอนุญาตการเข้าถึงกล้อง')
    }
  }

  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
    }
    setIsScanning(false)
  }

  const simulateQRScan = () => {
    // Simulate QR code scanning
    const mockQRCode = coupon?.qrCode || 'COUPON-001-2024'
    setScannedCode(mockQRCode)
    
    // Simulate validation
    setTimeout(() => {
      const foundCoupon = mockCoupons.find(c => c.qrCode === mockQRCode)
      setIsValid(!!foundCoupon)
    }, 1000)
  }

  const handleUseCoupon = () => {
    if (isValid) {
      alert('ใช้คูปองสำเร็จ!')
      router.navigate({ to: '/coupon' })
    }
  }

  if (coupon) {
    // Show specific coupon QR code
    return (
      <MobileLayout>
        <MobileHeader title="ใช้คูปอง" />
        
        <MobileContent className="pb-20">
          <div className="space-y-6">
            {/* Countdown Timer */}
            {!isExpired && (
              <div className={`rounded-2xl p-4 text-center ${
                timeLeft <= 60 ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Clock className={`w-5 h-5 ${timeLeft <= 60 ? 'text-red-600' : 'text-blue-600'}`} />
                  <span className={`font-semibold ${timeLeft <= 60 ? 'text-red-900' : 'text-blue-900'}`}>
                    เหลือเวลา
                  </span>
                </div>
                <div className={`text-3xl font-bold ${timeLeft <= 60 ? 'text-red-600' : 'text-blue-600'}`}>
                  {formatTime(timeLeft)}
                </div>
                {timeLeft <= 60 && (
                  <p className="text-sm text-red-600 mt-1">คูปองจะหมดอายุเร็วๆ นี้!</p>
                )}
              </div>
            )}

            {isExpired && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
                <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <h3 className="font-semibold text-red-900 mb-1">คูปองหมดอายุแล้ว</h3>
                <p className="text-sm text-red-700">ไม่สามารถใช้คูปองนี้ได้แล้ว</p>
              </div>
            )}

            {/* Coupon Info */}
            <div className="bg-white rounded-2xl p-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{coupon.title}</h2>
                <p className="text-gray-600 mb-4">{coupon.description}</p>
                
                {/* Discount Info */}
                <div className="bg-gradient-to-r from-[#EC1B2E] to-[#C20010] rounded-xl p-4 text-white mb-4">
                  <p className="text-sm opacity-90">ส่วนลด</p>
                  <p className="text-2xl font-bold">
                    {coupon.discountType === 'percentage' 
                      ? `${coupon.discountValue}%`
                      : `${coupon.discountValue.toLocaleString()} บาท`
                    }
                  </p>
                  {coupon.minAmount && (
                    <p className="text-sm opacity-90">
                      ขั้นต่ำ {coupon.minAmount.toLocaleString()} บาท
                    </p>
                  )}
                </div>
              </div>
              
              {/* QR Code Display */}
              <div className="text-center">
                <div className="bg-white p-4 rounded-xl inline-block">
                  <div className={`w-48 h-48 rounded-lg flex items-center justify-center ${
                    isExpired ? 'bg-gray-100' : 'bg-gradient-to-br from-gray-50 to-gray-100'
                  }`}>
                    {isExpired ? (
                      <X className="w-32 h-32 text-gray-400" />
                    ) : (
                      <QrCode className="w-32 h-32 text-gray-600" />
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 mt-4 font-mono">{coupon.qrCode}</p>
              </div>
            </div>

            {/* Store Info */}
            {coupon.storeName && (
              <div className="bg-white rounded-2xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">ข้อมูลร้าน</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ร้าน:</span>
                    <span className="font-medium">{coupon.storeName}</span>
                  </div>
                  {coupon.remainingCount && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">จำนวนที่เหลือ:</span>
                      <span className="font-medium">{coupon.remainingCount} คูปอง</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 rounded-2xl p-4">
              <h3 className="font-semibold text-blue-900 mb-2">วิธีใช้คูปอง</h3>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. แสดง QR Code ให้พนักงาน</li>
                <li>2. พนักงานจะสแกน QR Code</li>
                <li>3. รับส่วนลดตามที่ระบุ</li>
              </ol>
            </div>

            {!isExpired && (
              <MobileButton
                onClick={() => router.navigate({ to: '/coupon/staff-scan' })}
                className="w-full"
              >
                หน้าพนักงาน
              </MobileButton>
            )}
          </div>
        </MobileContent>

        <BottomNavigation currentPath="/coupon" />
      </MobileLayout>
    )
  }

  return (
    <MobileLayout>
      <MobileHeader title="สแกน QR Code" />
      
      <MobileContent className="pb-20">
        <div className="space-y-6">
          {!isScanning && !scannedCode && (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-[#EC1B2E] rounded-full flex items-center justify-center">
                <Camera className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">สแกน QR Code</h2>
              <p className="text-gray-600 mb-6">สแกน QR Code บนคูปองเพื่อใช้ส่วนลด</p>
              
              <button
                onClick={startScanning}
                className="bg-[#EC1B2E] hover:bg-[#C20010] text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                เปิดกล้องสแกน
              </button>
            </div>
          )}

          {isScanning && (
            <div className="space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 bg-gray-900 rounded-2xl"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-white rounded-lg opacity-50" />
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={simulateQRScan}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-colors"
                >
                  สแกน QR Code (จำลอง)
                </button>
                <button
                  onClick={stopScanning}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-medium transition-colors"
                >
                  ปิดกล้อง
                </button>
              </div>
            </div>
          )}

          {scannedCode && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  {isValid === null ? (
                    <div className="w-8 h-8 border-4 border-[#EC1B2E] border-t-transparent rounded-full animate-spin" />
                  ) : isValid ? (
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  ) : (
                    <X className="w-8 h-8 text-red-500" />
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {isValid === null ? 'กำลังตรวจสอบ...' : isValid ? 'QR Code ถูกต้อง' : 'QR Code ไม่ถูกต้อง'}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {isValid === null 
                    ? 'กำลังตรวจสอบ QR Code...' 
                    : isValid 
                    ? 'คูปองนี้สามารถใช้งานได้' 
                    : 'QR Code นี้ไม่ถูกต้องหรือหมดอายุแล้ว'
                  }
                </p>
                
                <p className="text-sm text-gray-500">QR Code: {scannedCode}</p>
              </div>

              {isValid && (
                <button
                  onClick={handleUseCoupon}
                  className="w-full bg-[#EC1B2E] hover:bg-[#C20010] text-white py-4 rounded-xl font-semibold text-lg transition-colors"
                >
                  ใช้คูปอง
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setScannedCode(null)
                  setIsValid(null)
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors"
              >
                สแกนใหม่
              </button>
            </div>
          )}
        </div>
      </MobileContent>

      <BottomNavigation currentPath="/profile" />
    </MobileLayout>
  )
}
