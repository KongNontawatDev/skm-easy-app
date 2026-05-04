import { 
  MobileLayout, 
  MobileHeader, 
  MobileContent, 
  BottomNavigation,
  MobileCard,
  MobileButton
} from '@/components/mobile'
import {
  DollarSign,
  FileText,
  Car,
  User,
  Calendar,
  Download,
  QrCode,
  Receipt,
  CreditCard,
  Copy,
  Check,
} from 'lucide-react'
import { useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { skmApi, unwrapData } from '@/lib/skm-api'
import { useCustomerToken } from '@/hooks/use-customer-contracts'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/shared/error-state'
import { mapLegacyContractDetailToContractData } from '@/lib/legacy-contract-detail-map'

export function ContractDetail() {
  const { id: contractId } = useParams({ from: '/contract/$id' })
  const navigate = useNavigate()
  const hasToken = useCustomerToken()

  const contractQuery = useQuery({
    queryKey: ['contract-detail', contractId],
    enabled: hasToken && !!contractId,
    queryFn: async () => {
      const res = await skmApi.get(`/me/contracts/${encodeURIComponent(contractId)}`)
      return unwrapData<Record<string, unknown>>(res)
    },
  })

  const [copiedField, setCopiedField] = useState<string | null>(null)
  const rawContract = contractQuery.data as Record<string, unknown> | undefined
  const contract = rawContract
    ? mapLegacyContractDetailToContractData(rawContract, contractId)
    : undefined

  if (contractQuery.isLoading) {
    return (
      <MobileLayout>
        <MobileHeader title="Loading..." />
        <MobileContent>
          <Skeleton />
        </MobileContent>
      </MobileLayout>
    )
  }

  if (contractQuery.isError) {
    return (
      <MobileLayout>
        <MobileHeader title="Error" />
        <MobileContent>
          <ErrorState />
        </MobileContent>
      </MobileLayout>
    )
  }

  if (!contract) {
    return (
      <MobileLayout>
        <MobileHeader title="ไม่พบข้อมูลสัญญา" />
        <MobileContent>
          <MobileCard>
            <p className="text-center text-gray-500">ไม่พบข้อมูลสัญญาที่ระบุ</p>
          </MobileCard>
        </MobileContent>
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

  const formatNumber = (num: number) => {
    return num.toLocaleString('th-TH')
  }

  const formatOptionalDate = (value?: string) => {
    if (!value) return '-'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleDateString('th-TH', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const copyToClipboard = async (field: string, value?: string) => {
    if (!value || value === '-') return
    try {
      await navigator.clipboard.writeText(value)
      setCopiedField(field)
      window.setTimeout(() => setCopiedField(null), 1200)
    } catch {
      alert('ไม่สามารถคัดลอกได้')
    }
  }

  const CopyableValue = ({ field, value }: { field: string; value?: string }) => {
    const displayValue = value?.trim() || '-'
    const canCopy = displayValue !== '-'

    return (
      <span className="flex min-w-0 items-center justify-end gap-2 text-right font-medium">
        <span className="truncate">{displayValue}</span>
        {canCopy ? (
          <button
            type="button"
            aria-label={`คัดลอก${field}`}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
            onClick={() => void copyToClipboard(field, displayValue)}
          >
            {copiedField === field ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
          </button>
        ) : null}
      </span>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'a':
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'o':
      case 'overdue':
        return 'bg-red-100 text-red-800'
      case 'c':
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handlePayment = () => {
    navigate({ to: '/installment/pay', search: { contractId } })
  }

  const handleDownloadContract = () => {
    // Mock download functionality
    // In a real app, this would trigger a file download
    alert('ดาวน์โหลดสัญญา')
  }

  const handleDownloadInvoice = () => {
    // Mock download functionality
    // In a real app, this would trigger a file download
    alert('ดาวน์โหลดใบแจ้งหนี้')
  }

  const handleDownloadReceipt = () => {
    // Mock download functionality
    // In a real app, this would trigger a file download
    alert('ดาวน์โหลดใบเสร็จ')
  }

  const handleDownloadPaymentSchedule = () => {
    // Mock download functionality
    // In a real app, this would trigger a file download
    alert('ดาวน์โหลดตารางงวดผ่อนชำระ')
  }

  const vehicle = contract.vehicleInfo ?? contract
  const customer = contract.customerInfo ?? {}
  const financial = contract.financialInfo ?? contract
  const contractInfo = contract.contractInfo ?? {}
  const remainingAmount = Number(financial.remainingAmount ?? contract.remainingAmount) || 0

  return (
    <MobileLayout>
      <MobileHeader title={`สัญญา ${contract.contractNumber || contract.contract_number || contractId}`} />
      <MobileContent className='pb-20'>
        {/* ข้อมูลรถ */}
        <MobileCard>
          <div className="flex items-center space-x-3 mb-4">
            <Car className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">ข้อมูลรถ</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">ยี่ห้อ/รุ่น:</span>
              <span className="font-medium">{vehicle.brand || ''} {vehicle.model || ''}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ปี:</span>
              <span className="font-medium">{vehicle.year || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">สี:</span>
              <span className="font-medium">{vehicle.color || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ทะเบียน:</span>
              <span className="font-medium">{vehicle.plateNumber || '-'}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="shrink-0 text-gray-600">เลขเครื่อง:</span>
              <CopyableValue field="เลขเครื่อง" value={vehicle.engineNumber} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="shrink-0 text-gray-600">เลขตัวถัง:</span>
              <CopyableValue field="เลขตัวถัง" value={vehicle.chassisNumber} />
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">วันครบกำหนดภาษี:</span>
              <span className="text-right font-medium">{formatOptionalDate(vehicle.taxDueDate)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">วันครบกำหนดชำระภาษี:</span>
              <span className="text-right font-medium">{formatOptionalDate(vehicle.taxPaymentDueDate)}</span>
            </div>
          </div>
        </MobileCard>

        {/* ข้อมูลลูกค้า */}
        <MobileCard>
          <div className="flex items-center space-x-3 mb-4">
            <User className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold">ข้อมูลลูกค้า</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">ชื่อ-นามสกุล:</span>
              <span className="font-medium">{customer.name || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">โทรศัพท์:</span>
              <span className="font-medium">{customer.phone || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">อีเมล:</span>
              <span className="font-medium">{customer.email || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ที่อยู่:</span>
              <span className="font-medium text-right">{customer.address || '-'}</span>
            </div>
          </div>
        </MobileCard>

        {/* ข้อมูลทางการเงิน */}
        <MobileCard>
          <div className="flex items-center space-x-3 mb-4">
            <DollarSign className="h-5 w-5 text-yellow-600" />
            <h3 className="text-lg font-semibold">ข้อมูลทางการเงิน</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">ยอดเงินรวม:</span>
              <span className="font-medium">{formatNumber(Number(financial.totalAmount) || 0)} บาท</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">เงินดาวน์:</span>
              <span className="font-medium">{formatNumber(Number(financial.downPayment) || 0)} บาท</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">เงินกู้:</span>
              <span className="font-medium">{formatNumber(Number(financial.loanAmount) || remainingAmount)} บาท</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">งวดผ่อน:</span>
              <span className="font-medium">{Number(financial.monthlyPayment) ? `${formatNumber(Number(financial.monthlyPayment))} บาท` : '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ยอดคงเหลือ:</span>
              <span className="font-medium text-red-600">{formatNumber(remainingAmount)} บาท</span>
            </div>
          </div>
        </MobileCard>

        {/* ข้อมูลสัญญา */}
        <MobileCard>
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold">ข้อมูลสัญญา</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">เลขที่สัญญา:</span>
              <span className="font-medium">{contract.contractNumber || contract.contract_number || contractId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">วันที่เริ่มสัญญา:</span>
              <span className="font-medium">{formatOptionalDate(contractInfo.startDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">วันที่สิ้นสุดสัญญา:</span>
              <span className="font-medium">{formatOptionalDate(contractInfo.endDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ระยะเวลา:</span>
              <span className="font-medium">{contractInfo.term || financial.term || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">สถานะ:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contractInfo.status || contract.status || 'active')}`}>
                {contractInfo.status || contract.status || 'Active'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">งวดถัดไป:</span>
              <span className="font-medium">{contract.nextPaymentDate ? formatDate(contract.nextPaymentDate) : '-'}</span>
            </div>
          </div>
        </MobileCard>

        {/* ตารางงวดผ่อนชำระ */}
        {/* <MobileCard>
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">ตารางงวดผ่อนชำระ</h3>
          </div>
          
          <div className="space-y-3">
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">งวดที่ {payment.installmentNo}</p>
                    <p className="text-sm text-gray-600">{formatDate(payment.dueDate)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{formatNumber(payment.amount)} บาท</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.status)}`}>
                    {getPaymentStatusText(payment.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </MobileCard> */}

        {/* ประวัติการชำระเงิน */}
        {/* <MobileCard>
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold">ประวัติการชำระเงิน</h3>
          </div>
          
          <div className="space-y-3">
            {payments.filter(p => p.status === 'paid').map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">งวดที่ {payment.installmentNo}</p>
                    <p className="text-sm text-gray-600">{formatDate(payment.dueDate)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{formatNumber(payment.amount)} บาท</p>
                  <p className="text-xs text-green-600">ชำระแล้ว</p>
                </div>
              </div>
            ))}
            
            {payments.filter(p => p.status === 'paid').length === 0 && (
              <div className="text-center text-gray-500 py-4">
                ยังไม่มีการชำระเงิน
              </div>
            )}
          </div>
        </MobileCard> */}

        {/* ปุ่มชำระเงิน */}
        <MobileCard>
          <MobileButton
            onClick={handlePayment}
            variant="primary"
            size="lg"
            fullWidth
            className="mb-3"
          >
            <QrCode className="h-5 w-5 mr-2" />
            ชำระเงิน
          </MobileButton>
        </MobileCard>

        {/* ปุ่มดาวน์โหลดเอกสาร */}
        <MobileCard>
          <div className="flex items-center space-x-3 mb-4">
            <Download className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold">ดาวน์โหลดเอกสาร</h3>
          </div>
          
          <div className="space-y-3">
            <MobileButton
              onClick={handleDownloadContract}
              variant="outline"
              size="md"
              fullWidth
              className="justify-start"
            >
              <FileText className="h-4 w-4 mr-2" />
              ดาวน์โหลดสัญญา
            </MobileButton>
            
            <MobileButton
              onClick={handleDownloadInvoice}
              variant="outline"
              size="md"
              fullWidth
              className="justify-start"
            >
              <Receipt className="h-4 w-4 mr-2" />
              ดาวน์โหลดใบแจ้งหนี้
            </MobileButton>
            
            <MobileButton
              onClick={handleDownloadReceipt}
              variant="outline"
              size="md"
              fullWidth
              className="justify-start"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              ดาวน์โหลดใบเสร็จ
            </MobileButton>
            
            <MobileButton
              onClick={handleDownloadPaymentSchedule}
              variant="outline"
              size="md"
              fullWidth
              className="justify-start"
            >
              <Calendar className="h-4 w-4 mr-2" />
              ดาวน์โหลดตารางงวดผ่อนชำระ
            </MobileButton>
          </div>
        </MobileCard>
      </MobileContent>
      <BottomNavigation currentPath="/contract" />
    </MobileLayout>
  )
}
