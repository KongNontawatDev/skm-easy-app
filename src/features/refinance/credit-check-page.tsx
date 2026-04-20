import { useState } from 'react'
import {
  MobileLayout,
  MobileHeader,
  MobileContent,
  BottomNavigation,
  MobileCard,
  MobileButton,
} from '@/components/mobile'
import { LoadingSpinner, EmptyState } from '@/components/shared'
import { CreditCheckForm } from './components/credit-check-form'
import { useCreditCheckResults } from './hooks'
import { mockCreditCheckResults } from './data/mock-data'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  FileText,
  TrendingUp,
  Shield,
} from 'lucide-react'
import type { CreditCheckResponse } from './types'

export function CreditCheckPage() {
  const [showForm, setShowForm] = useState(false)
  const [checkResult, setCheckResult] = useState<CreditCheckResponse | null>(null)
  
  const { isLoading, error } = useCreditCheckResults()

  // Use mock data for now
  const displayResults = mockCreditCheckResults

  const handleFormSuccess = (response: CreditCheckResponse) => {
    setCheckResult(response)
    setShowForm(false)
  }

  const handleFormCancel = () => {
    setShowForm(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'อนุมัติ'
      case 'rejected': return 'ไม่อนุมัติ'
      case 'pending': return 'รอการตรวจสอบ'
      default: return 'ไม่ระบุ'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  if (showForm) {
    return (
      <MobileLayout>
        <MobileHeader title="ตรวจสอบเครดิต" />
        <MobileContent className="pb-20">
          <CreditCheckForm
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </MobileContent>
      </MobileLayout>
    )
  }

  if (checkResult) {
    return (
      <MobileLayout>
        <MobileHeader title="ผลการตรวจสอบเครดิต" />
        <MobileContent className="pb-20">
          <div className="space-y-4">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-4 text-white text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-2" />
              <h2 className="text-lg font-bold mb-1">ส่งข้อมูลสำเร็จ!</h2>
              <p className="text-green-100 text-sm">
                ข้อมูลของคุณได้รับการส่งเรียบร้อยแล้ว เราจะติดต่อกลับภายใน 24 ชั่วโมง
              </p>
            </div>

            {/* Result Info */}
            <MobileCard className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                ข้อมูลการตรวจสอบ
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">สถานะ:</span>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Clock className="w-3 h-3 mr-1" />
                    รอการตรวจสอบ
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">หมายเลขการตรวจสอบ:</span>
                  <span className="text-sm font-medium">#{Date.now().toString().slice(-8)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">วันที่ส่ง:</span>
                  <span className="text-sm font-medium">
                    {new Date().toLocaleDateString('th-TH')}
                  </span>
                </div>
              </div>
            </MobileCard>

            {/* Next Steps */}
            <MobileCard className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                ขั้นตอนต่อไป
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-xs">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      ตรวจสอบเอกสาร
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      ทีมงานจะตรวจสอบเอกสารและข้อมูลที่ส่งมา
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-xs">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      ติดต่อกลับ
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      เราจะติดต่อกลับเพื่อแจ้งผลการตรวจสอบ
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-xs">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      เตรียมเอกสาร
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      หากผ่านการตรวจสอบ ให้เตรียมเอกสารตามที่แจ้ง
                    </p>
                  </div>
                </div>
              </div>
            </MobileCard>

            <MobileButton
              onClick={() => {
                setCheckResult(null)
                setShowForm(false)
              }}
              className="w-full"
            >
              กลับไปหน้าหลัก
            </MobileButton>
          </div>
        </MobileContent>
      </MobileLayout>
    )
  }

  if (isLoading) {
    return (
      <MobileLayout>
        <MobileHeader title="ตรวจสอบเครดิต" />
        <MobileContent className="flex items-center justify-center">
          <LoadingSpinner />
        </MobileContent>
      </MobileLayout>
    )
  }

  if (error) {
    return (
      <MobileLayout>
        <MobileHeader title="ตรวจสอบเครดิต" />
        <MobileContent className="flex items-center justify-center">
          <EmptyState
            icon="⚠️"
            title="เกิดข้อผิดพลาด"
            description="ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง"
          />
        </MobileContent>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout>
      <MobileHeader title="ตรวจสอบเครดิต" />
      
      <MobileContent className="pb-20">
        <div className="space-y-4">
          {/* Header Info */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-4 text-white">
            <h2 className="text-lg font-bold mb-2">ตรวจสอบเครดิตออนไลน์</h2>
            <p className="text-purple-100 text-sm">
              กรอกข้อมูลเพื่อตรวจสอบความสามารถในการผ่อนรถมอเตอร์ไซค์
            </p>
          </div>

          {/* Benefits */}
          <MobileCard className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              ข้อดีของการตรวจสอบเครดิตออนไลน์
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    ปลอดภัย ข้อมูลเข้ารหัส
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    ข้อมูลของคุณได้รับการปกป้องด้วยระบบความปลอดภัยระดับสูง
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    รู้ผลเร็ว
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    ได้รับผลการตรวจสอบภายใน 24 ชั่วโมง
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <FileText className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    ไม่ต้องเดินทาง
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    ทำได้ที่บ้าน ไม่ต้องมาที่ร้าน
                  </p>
                </div>
              </div>
            </div>
          </MobileCard>

          {/* Start Button */}
          <MobileButton
            onClick={() => setShowForm(true)}
            className="w-full"
          >
            เริ่มตรวจสอบเครดิต
          </MobileButton>

          {/* Recent Results */}
          {displayResults.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                ผลการตรวจสอบล่าสุด
              </h3>
              
              {displayResults.slice(0, 3).map((result) => (
                <MobileCard key={result.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {result.customerName}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {result.phone}
                      </p>
                    </div>
                    <Badge className={getStatusColor(result.status)}>
                      {getStatusIcon(result.status)}
                      <span className="ml-1">{getStatusText(result.status)}</span>
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-gray-600 dark:text-gray-400">เครดิตสกอร์:</span>
                      <span className="font-medium">{result.creditScore}</span>
                    </div>
                    
                    {result.eligibility && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-600 dark:text-gray-400">อนุมัติ:</span>
                        <span className="font-medium">{result.approvedAmount.toLocaleString()} บาท</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">วันที่ส่ง:</span>
                      <span className="font-medium">
                        {new Date(result.submittedAt).toLocaleDateString('th-TH')}
                      </span>
                    </div>
                  </div>
                </MobileCard>
              ))}
            </div>
          )}
        </div>
      </MobileContent>

      <BottomNavigation currentPath="/credit-check" />
    </MobileLayout>
  )
}
