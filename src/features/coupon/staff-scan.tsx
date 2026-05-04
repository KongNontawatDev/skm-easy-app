import { useState } from 'react'
import { 
  MobileLayout, 
  MobileHeader, 
  MobileContent, 
  BottomNavigation,
  MobileButton,
  MobileInput
} from '@/components/mobile'
import { QrCode, Search, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { type Coupon } from './types'

export function StaffScan() {
  const [scanMode, setScanMode] = useState<'qr' | 'manual'>('qr')
  const [couponCode, setCouponCode] = useState('')
  const [scanResult, setScanResult] = useState<{
    type: 'success' | 'error' | 'warning'
    message: string
    coupon?: Coupon
  } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Mock function สำหรับการสแกน QR Code ของลูกค้า
  const handleQRScan = () => {
    setIsProcessing(true)
    
    // Simulate scanning process
    setTimeout(() => {
      // Mock scan result - ในแอพจริงจะใช้ library เช่น react-qr-reader
      const mockCouponCode = 'COUPON-001-2024'
      setCouponCode(mockCouponCode)
      processCouponCode(mockCouponCode)
    }, 1500)
  }

  // Mock function สำหรับการกรอกโค้ดคูปองด้วยตนเอง
  const handleManualInput = () => {
    if (couponCode.trim()) {
      processCouponCode(couponCode.trim())
    }
  }

  // ตรวจสอบและประมวลผลโค้ดคูปอง
  const processCouponCode = (_code: string) => {
    setIsProcessing(true)
    
    // TODO: เรียก API จริงเพื่อหาคูปอง
    const coupon = null as Coupon | null
    
    setTimeout(() => {
      if (coupon) {
        if (coupon.status === 'claimed') {
          setScanResult({
            type: 'success',
            message: 'คูปองถูกต้อง! สามารถใช้งานได้',
            coupon
          })
        } else if (coupon.status === 'used') {
          setScanResult({
            type: 'warning',
            message: 'คูปองนี้ถูกใช้ไปแล้ว',
            coupon
          })
        } else if (coupon.status === 'expired') {
          setScanResult({
            type: 'error',
            message: 'คูปองหมดอายุแล้ว',
            coupon
          })
        } else {
          setScanResult({
            type: 'warning',
            message: 'คูปองยังไม่ได้ถูกรับ',
            coupon
          })
        }
      } else {
        setScanResult({
          type: 'error',
          message: 'ไม่พบคูปองที่สอดคล้องกับโค้ดนี้'
        })
      }
      
      setIsProcessing(false)
    }, 1000)
  }

  // ใช้คูปอง
  const handleUseCoupon = () => {
    if (scanResult?.coupon) {
      setIsProcessing(true)
      
      // ในแอพจริงจะเป็นการเรียก API เพื่อใช้คูปอง
      
      setTimeout(() => {
        setScanResult({
          type: 'success',
          message: 'ใช้คูปองสำเร็จ!',
          coupon: scanResult.coupon
        })
        setIsProcessing(false)
      }, 1000)
    }
  }

  const resetScan = () => {
    setCouponCode('')
    setScanResult(null)
    setIsProcessing(false)
  }

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-600" />
      case 'error':
        return <XCircle className="w-8 h-8 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-8 h-8 text-yellow-600" />
      default:
        return <QrCode className="w-8 h-8 text-gray-600" />
    }
  }

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-900'
      case 'error':
        return 'text-red-900'
      case 'warning':
        return 'text-yellow-900'
      default:
        return 'text-gray-900'
    }
  }

  return (
    <MobileLayout>
      <MobileHeader title="สแกนคูปองลูกค้า" />
      
      <MobileContent className="pb-20">
        <div className="space-y-6">
          {/* Mode Selection */}
          <div className="bg-white rounded-2xl p-4">
            <h3 className="font-semibold text-gray-900 mb-4">เลือกวิธีการสแกน</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setScanMode('qr')}
                className={`p-3 rounded-xl text-center transition-colors ${
                  scanMode === 'qr' 
                    ? 'bg-[#EC1B2E] text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <QrCode className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm font-medium">สแกน QR</p>
              </button>
              <button
                onClick={() => setScanMode('manual')}
                className={`p-3 rounded-xl text-center transition-colors ${
                  scanMode === 'manual' 
                    ? 'bg-[#EC1B2E] text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <Search className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm font-medium">กรอกโค้ด</p>
              </button>
            </div>
          </div>

          {/* Scanner Area */}
          <div className="bg-white rounded-2xl p-6 text-center">
            {scanMode === 'qr' && !isProcessing && !scanResult && (
              <div className="space-y-4">
                <div className="w-32 h-32 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">สแกน QR Code</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    ชี้กล้องไปที่ QR Code ของคูปองลูกค้า
                  </p>
                  <MobileButton
                    onClick={handleQRScan}
                    className="w-full"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    เปิดกล้องสแกน
                  </MobileButton>
                </div>
              </div>
            )}

            {scanMode === 'manual' && !isProcessing && !scanResult && (
              <div className="space-y-4">
                <div className="w-32 h-32 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center">
                  <Search className="w-16 h-16 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">กรอกโค้ดคูปอง</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    กรอกโค้ดคูปองที่ลูกค้าแสดงให้ดู
                  </p>
                  <MobileInput
                    type="text"
                    placeholder="กรอกโค้ดคูปอง"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="mb-4"
                  />
                  <MobileButton
                    onClick={handleManualInput}
                    className="w-full"
                    disabled={!couponCode.trim()}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    ตรวจสอบคูปอง
                  </MobileButton>
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="space-y-4">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#EC1B2E] to-[#C20010] rounded-2xl flex items-center justify-center animate-pulse">
                  <QrCode className="w-16 h-16 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">กำลังตรวจสอบ...</h3>
                  <p className="text-gray-600 text-sm">
                    กรุณารอสักครู่
                  </p>
                </div>
              </div>
            )}

            {scanResult && (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center">
                  {getStatusIcon(scanResult.type)}
                </div>
                
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${getStatusColor(scanResult.type)}`}>
                    {scanResult.message}
                  </h3>
                  
                  {scanResult.coupon && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-4 text-left">
                      <h4 className="font-medium text-gray-900 mb-2">ข้อมูลคูปอง</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">ชื่อคูปอง:</span>
                          <span className="font-medium">{scanResult.coupon.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">ส่วนลด:</span>
                          <span className="font-medium">
                            {scanResult.coupon.discountType === 'percentage' 
                              ? `${scanResult.coupon.discountValue}%`
                              : `${scanResult.coupon.discountValue} บาท`
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">สถานะ:</span>
                          <span className={`font-medium ${
                            scanResult.coupon.status === 'claimed' ? 'text-green-600' :
                            scanResult.coupon.status === 'used' ? 'text-gray-600' :
                            'text-red-600'
                          }`}>
                            {scanResult.coupon.status === 'claimed' ? 'พร้อมใช้' :
                             scanResult.coupon.status === 'used' ? 'ใช้แล้ว' :
                             'หมดอายุ'}
                          </span>
                        </div>
                        {scanResult.coupon.storeName && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">ร้าน:</span>
                            <span className="font-medium">{scanResult.coupon.storeName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-3">
                    {scanResult.type === 'success' && scanResult.coupon && (
                      <MobileButton
                        onClick={handleUseCoupon}
                        className="flex-1"
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'กำลังใช้...' : 'ใช้คูปอง'}
                      </MobileButton>
                    )}
                    <MobileButton
                      variant="outline"
                      onClick={resetScan}
                      className="flex-1"
                    >
                      สแกนใหม่
                    </MobileButton>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-2xl p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">คำแนะนำ</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• ตรวจสอบให้แน่ใจว่าคูปองยังไม่หมดอายุ</li>
                  <li>• คูปองใช้ได้เพียงครั้งเดียว</li>
                  <li>• หากมีปัญหาให้ติดต่อฝ่ายสนับสนุน</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </MobileContent>

      <BottomNavigation currentPath="/coupon" />
    </MobileLayout>
  )
}
