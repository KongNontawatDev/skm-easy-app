import { 
  MobileLayout, 
  MobileHeader, 
  MobileContent, 
  BottomNavigation,
  MobileCard,
  MobileButton
} from '@/components/mobile'
import { 
  CreditCard,
  QrCode,
  Calendar,
  DollarSign
} from 'lucide-react'
import { useRouter, useSearch, useNavigate } from '@tanstack/react-router'
import { getPaymentsByContract, getContractById } from '@/lib/mock-data'
import { calculatePaymentBreakdown, calculateTotalOverdueAmount, getOverdueCount } from '@/lib/payment-utils'

interface PaymentSearchParams {
  contractId?: string
}

export function PaymentList() {
  const router = useRouter()
  const navigate = useNavigate()
  const search = useSearch({ from: '/installment/pay/' }) as PaymentSearchParams

  // Get contractId from URL parameters
  const contractId = search.contractId

  // ใช้ข้อมูลจากข้อมูลกลาง
  const contract = contractId ? getContractById(contractId) : null
  const allPayments = contractId ? getPaymentsByContract(contractId) : []

  // Redirect to installment page if no contractId
  if (!contractId) {
    router.navigate({ to: '/installment' })
    return null
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString('th-TH')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'รอชำระ'
      case 'paid':
        return 'ชำระแล้ว'
      case 'overdue':
        return 'ค้างชำระ'
      default:
        return status
    }
  }

  const handlePayNow = (payment: { id: string }) => {
    navigate({ to: '/installment/pay/$id', params: { id: payment.id } })
  }

  // คำนวณยอดรวมของงวดที่ค้างชำระ
  const totalOverdueAmount = calculateTotalOverdueAmount(allPayments)
  const overdueCount = getOverdueCount(allPayments)

  return (
    <MobileLayout>
      <MobileHeader title="รายการชำระเงิน" />
      <MobileContent>
        {/* Contract Info */}
        {contract && (
          <MobileCard>
            <div className="flex items-center space-x-3 mb-3">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">สัญญา {contract.contractNumber}</h3>
            </div>
            <div className="text-sm text-gray-600 mb-3">
              <p>{contract.vehicleInfo.brand} {contract.vehicleInfo.model} ({contract.vehicleInfo.year})</p>
              <p>ทะเบียน: {contract.vehicleInfo.plateNumber}</p>
            </div>
            
            {/* ยอดรวมที่ต้องชำระ */}
            {overdueCount > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                      ยอดรวมที่ต้องชำระ
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-400">
                      ค้างชำระ {overdueCount} งวด
                    </p>
                  </div>
                  <span className="text-xl font-bold text-red-600">
                    {formatNumber(totalOverdueAmount)} ฿
                  </span>
                </div>
              </div>
            )}
          </MobileCard>
        )}

        {/* Payments List */}
        <div className="space-y-3">
          {allPayments.map((payment) => (
            <MobileCard key={payment.id}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">งวดที่ {payment.installmentNo}</h4>
                    <p className="text-sm text-gray-600">{formatDate(payment.dueDate)}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                  {getStatusText(payment.status)}
                </span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-lg font-semibold text-green-600">
                    {payment.status === 'pending' || payment.status === 'overdue' 
                      ? formatNumber(calculatePaymentBreakdown(payment).totalAmount)
                      : formatNumber(payment.amount)
                    } บาท
                  </span>
                </div>
              </div>

              {payment.status === 'pending' || payment.status === 'overdue' ? (
                <MobileButton
                  onClick={() => handlePayNow(payment)}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  ชำระเงิน
                </MobileButton>
              ) : (
                <div className="text-center text-sm text-gray-500 py-2">
                  ชำระแล้ว
                </div>
              )}
            </MobileCard>
          ))}
        </div>

        {allPayments.length === 0 && (
          <MobileCard>
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">ไม่พบข้อมูลการชำระเงิน</p>
            </div>
          </MobileCard>
        )}
      </MobileContent>
      <BottomNavigation currentPath="/installment" />
    </MobileLayout>
  )
}