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
} from 'lucide-react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { getContractById } from '@/lib/mock-data'

export function ContractDetail() {
  const { id: contractId } = useParams({ from: '/contract/$id' })
  const navigate = useNavigate()

  // ใช้ข้อมูลจากข้อมูลกลาง
  const contract = getContractById(contractId)

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'ใช้งานอยู่'
      case 'overdue':
        return 'ค้างชำระ'
      case 'completed':
        return 'เสร็จสิ้น'
      default:
        return status
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

  return (
    <MobileLayout>
      <MobileHeader title={`สัญญา ${contract.contractNumber}`} />
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
              <span className="font-medium">{contract.vehicleInfo.brand} {contract.vehicleInfo.model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ปี:</span>
              <span className="font-medium">{contract.vehicleInfo.year}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">สี:</span>
              <span className="font-medium">{contract.vehicleInfo.color}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ทะเบียน:</span>
              <span className="font-medium">{contract.vehicleInfo.plateNumber}</span>
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
              <span className="font-medium">{contract.customerInfo.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">โทรศัพท์:</span>
              <span className="font-medium">{contract.customerInfo.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">อีเมล:</span>
              <span className="font-medium">{contract.customerInfo.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ที่อยู่:</span>
              <span className="font-medium text-right">{contract.customerInfo.address}</span>
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
              <span className="font-medium">{formatNumber(contract.financialInfo.totalAmount)} บาท</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">เงินดาวน์:</span>
              <span className="font-medium">{formatNumber(contract.financialInfo.downPayment)} บาท</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">เงินกู้:</span>
              <span className="font-medium">{formatNumber(contract.financialInfo.loanAmount)} บาท</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">งวดผ่อน:</span>
              <span className="font-medium">{formatNumber(contract.financialInfo.monthlyPayment)} บาท/เดือน</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ดอกเบี้ย:</span>
              <span className="font-medium">{contract.financialInfo.interestRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ยอดคงเหลือ:</span>
              <span className="font-medium text-red-600">{formatNumber(contract.financialInfo.remainingAmount)} บาท</span>
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
              <span className="font-medium">{contract.contractNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">วันที่เริ่มสัญญา:</span>
              <span className="font-medium">{formatDate(contract.contractInfo.startDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">วันที่สิ้นสุดสัญญา:</span>
              <span className="font-medium">{formatDate(contract.contractInfo.endDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ระยะเวลา:</span>
              <span className="font-medium">{contract.financialInfo.term} เดือน</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">สถานะ:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.contractInfo.status)}`}>
                {getStatusText(contract.contractInfo.status)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">งวดถัดไป:</span>
              <span className="font-medium">{formatDate(contract.nextPaymentDate)}</span>
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