import { useState } from 'react'
import { 
  MobileLayout, 
  MobileHeader, 
  MobileContent, 
  BottomNavigation,
  MobileButton
} from '@/components/mobile'
import { QrCode, Camera, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import type { Store } from './types'

// TODO: โหลดข้อมูลร้านจาก API จริง
const stores: Store[] = []

export function CouponScan() {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedCode, setScannedCode] = useState('')
  const [scanResult, setScanResult] = useState<{
    type: 'success' | 'error' | 'info'
    message: string
    store?: {
      id: string
      name: string
      address: string
      phone?: string
    }
  } | null>(null)

  // Mock function สำหรับการสแกน QR Code
  const handleScan = () => {
    setIsScanning(true)
    
    // Simulate scanning process
    setTimeout(() => {
      // Mock scan result - ในแอพจริงจะใช้ library เช่น react-qr-reader
      const mockScannedCode = 'STORE-001-QR'
      setScannedCode(mockScannedCode)
      
      // หาร้านจาก QR Code
      const store = stores.find(s => s.qrCode === mockScannedCode)
      
      if (store) {
        setScanResult({
          type: 'success',
          message: `พบร้าน ${store.name} แล้ว!`,
          store
        })
      } else {
        setScanResult({
          type: 'error',
          message: 'ไม่พบร้านค้าที่สอดคล้องกับ QR Code นี้'
        })
      }
      
      setIsScanning(false)
    }, 2000)
  }

  const handleClaimCoupon = () => {
    if (scanResult?.store) {
      // ในแอพจริงจะเป็นการเรียก API เพื่อรับคูปอง
      
      // Mock success
      setScanResult({
        type: 'success',
        message: 'รับคูปองสำเร็จ! ตรวจสอบในหน้า "คูปองของฉัน"',
        store: scanResult.store
      })
    }
  }

  const resetScan = () => {
    setScannedCode('')
    setScanResult(null)
    setIsScanning(false)
  }

  return (
    <MobileLayout>
      <MobileHeader title="สแกนรับคูปอง" />
      
      <MobileContent className="pb-20">
        <div className="space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 rounded-2xl p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">วิธีใช้</h3>
                <p className="text-sm text-blue-700">
                  1. เปิดกล้องและสแกน QR Code ที่ร้าน<br/>
                  2. รอระบบตรวจสอบร้านค้า<br/>
                  3. กดรับคูปองที่ร้านนั้น
                </p>
              </div>
            </div>
          </div>

          {/* Scanner Area */}
          <div className="bg-white rounded-2xl p-6 text-center">
            {!isScanning && !scannedCode && (
              <div className="space-y-4">
                <div className="w-32 h-32 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">สแกน QR Code</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    ชี้กล้องไปที่ QR Code ที่ร้านเพื่อรับคูปอง
                  </p>
                  <MobileButton
                    onClick={handleScan}
                    className="w-full"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    เปิดกล้องสแกน
                  </MobileButton>
                </div>
              </div>
            )}

            {isScanning && (
              <div className="space-y-4">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#EC1B2E] to-[#C20010] rounded-2xl flex items-center justify-center animate-pulse">
                  <Camera className="w-16 h-16 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">กำลังสแกน...</h3>
                  <p className="text-gray-600 text-sm">
                    กรุณาชี้กล้องไปที่ QR Code
                  </p>
                </div>
              </div>
            )}

            {scannedCode && scanResult && (
              <div className="space-y-4">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                  scanResult.type === 'success' ? 'bg-green-100' : 
                  scanResult.type === 'error' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  {scanResult.type === 'success' && <CheckCircle className="w-8 h-8 text-green-600" />}
                  {scanResult.type === 'error' && <XCircle className="w-8 h-8 text-red-600" />}
                  {scanResult.type === 'info' && <AlertCircle className="w-8 h-8 text-blue-600" />}
                </div>
                
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    scanResult.type === 'success' ? 'text-green-900' : 
                    scanResult.type === 'error' ? 'text-red-900' : 'text-blue-900'
                  }`}>
                    {scanResult.message}
                  </h3>
                  
                  {scanResult.store && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">ข้อมูลร้าน</h4>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>ชื่อร้าน:</strong> {scanResult.store.name}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>ที่อยู่:</strong> {scanResult.store.address}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>โทรศัพท์:</strong> {scanResult.store.phone}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex space-x-3">
                    {scanResult.type === 'success' && scanResult.store && (
                      <MobileButton
                        onClick={handleClaimCoupon}
                        className="flex-1"
                      >
                        รับคูปอง
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

          {/* Available Stores */}
          <div className="bg-white rounded-2xl p-4">
            <h3 className="font-semibold text-gray-900 mb-4">ร้านที่เข้าร่วม</h3>
            <div className="space-y-3">
              {stores.map((store) => (
                <div key={store.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-medium text-gray-900">{store.name}</h4>
                    <p className="text-sm text-gray-600">{store.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">QR Code</p>
                    <p className="text-sm font-mono">{store.qrCode}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MobileContent>

      <BottomNavigation currentPath="/coupon" />
    </MobileLayout>
  )
}
