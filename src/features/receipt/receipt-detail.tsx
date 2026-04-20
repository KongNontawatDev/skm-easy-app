import {
  MobileLayout,
  MobileHeader,
  MobileContent,
  BottomNavigation,
  MobileCard,
  MobileButton,
} from '@/components/mobile'
import { Download, Receipt as ReceiptIcon, AlertCircle, User, Car, CreditCard } from 'lucide-react'
import { useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getReceiptById } from '@/lib/mock-data'
import { useCustomerToken } from '@/hooks/use-customer-contracts'
import { skmApi, unwrapData } from '@/lib/skm-api'
import { decodeReceiptApiId, mapReceiptApiRowToReceiptData } from '@/lib/legacy-billing-from-api'

export function ReceiptDetail() {
  const { receiptId } = useParams({ from: '/receipt/detail/$receiptId' })
  const hasToken = useCustomerToken()
  const apiReceiptRawId = decodeReceiptApiId(receiptId)

  const { data: apiReceipt, isLoading } = useQuery({
    queryKey: ['receipt-detail-api', receiptId],
    enabled: hasToken && !!apiReceiptRawId,
    queryFn: async () => {
      const res = await skmApi.get('/me/receipts')
      const rows = unwrapData<Record<string, unknown>[]>(res)
      const row = rows.find((r) => String(r.id) === apiReceiptRawId)
      if (!row) return null
      const contNo = String(row.contractNumber ?? row.contno ?? row.CONTNO ?? '')
      const br = apiReceiptRawId.split(':')[0] ?? ''
      const fallbackRef = br && contNo ? `${br}:${contNo}` : ''
      return mapReceiptApiRowToReceiptData(row, fallbackRef)
    },
  })

  const receipt =
    hasToken && apiReceiptRawId ? apiReceipt ?? undefined : getReceiptById(receiptId)

  if (hasToken && apiReceiptRawId && isLoading) {
    return (
      <MobileLayout>
        <MobileHeader title="ใบเสร็จ" />
        <MobileContent className="pb-48">
          <MobileCard className="p-8">
            <p className="text-center text-gray-500">กำลังโหลด...</p>
          </MobileCard>
        </MobileContent>
        <BottomNavigation currentPath="/installment" />
      </MobileLayout>
    )
  }

  if (!receipt) {
    return (
      <MobileLayout>
        <MobileHeader title="ไม่พบใบเสร็จ" />
        <MobileContent className="pb-48">
          <MobileCard className="p-8 text-center">
            <AlertCircle className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <p className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">ไม่พบใบเสร็จ</p>
            <p className="text-sm text-gray-500">ไม่พบใบเสร็จที่ระบุ</p>
          </MobileCard>
        </MobileContent>
        <BottomNavigation currentPath="/installment" />
      </MobileLayout>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString('th-TH')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'สำเร็จ'
      case 'pending':
        return 'รอดำเนินการ'
      case 'failed':
        return 'ล้มเหลว'
      default:
        return status
    }
  }

  return (
    <MobileLayout>
      <MobileHeader title={`ใบเสร็จ ${receipt.receiptNumber}`} />

      <MobileContent className="pb-48">
        <div className="space-y-4">
          <MobileCard className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <ReceiptIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{receipt.receiptNumber}</h3>
                  <p className="text-sm text-gray-500">สัญญา {receipt.contractNumber}</p>
                </div>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(receipt.paymentInfo.status)}`}>
                {getStatusText(receipt.paymentInfo.status)}
              </span>
            </div>

            <div className="text-center">
              <div className="mb-1 text-2xl font-bold text-[#EC1B2E]">{formatNumber(receipt.paymentInfo.amount)} ฿</div>
              <p className="text-sm text-gray-500">จำนวนเงินที่ชำระ</p>
            </div>
          </MobileCard>

          <MobileCard className="p-4">
            <h4 className="mb-3 flex items-center font-semibold text-gray-900 dark:text-gray-100">
              <User className="mr-2 h-5 w-5" />
              ข้อมูลลูกค้า
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">ชื่อ:</span>
                <span>{receipt.customerInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ที่อยู่:</span>
                <span className="text-right">{receipt.customerInfo.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">เลขประจำตัวผู้เสียภาษี:</span>
                <span>{receipt.customerInfo.taxId}</span>
              </div>
            </div>
          </MobileCard>

          <MobileCard className="p-4">
            <h4 className="mb-3 flex items-center font-semibold text-gray-900 dark:text-gray-100">
              <Car className="mr-2 h-5 w-5" />
              ข้อมูลรถ
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">ยี่ห้อ:</span>
                <span>{receipt.vehicleInfo.brand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">รุ่น:</span>
                <span>{receipt.vehicleInfo.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ทะเบียน:</span>
                <span>{receipt.vehicleInfo.plateNumber}</span>
              </div>
            </div>
          </MobileCard>

          <MobileCard className="p-4">
            <h4 className="mb-3 flex items-center font-semibold text-gray-900 dark:text-gray-100">
              <CreditCard className="mr-2 h-5 w-5" />
              ข้อมูลการชำระเงิน
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">วันที่ชำระ:</span>
                <span>{formatDate(receipt.paymentInfo.paymentDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">วิธีการชำระ:</span>
                <span>{receipt.paymentInfo.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">หมายเลขอ้างอิง:</span>
                <span className="text-right">{receipt.paymentInfo.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">บัญชีธนาคาร:</span>
                <span>{receipt.paymentInfo.bankAccount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">สถานะ:</span>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(receipt.paymentInfo.status)}`}>
                  {getStatusText(receipt.paymentInfo.status)}
                </span>
              </div>
            </div>
          </MobileCard>

          <MobileCard className="p-4">
            <h4 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">รายการที่ชำระ</h4>
            <div className="space-y-3">
              {receipt.items.map((item) => (
                <div key={item.id} className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.description}</p>
                    <p className="text-xs text-gray-500">งวด {item.period}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatNumber(item.amount)} ฿</p>
                  </div>
                </div>
              ))}

              <div className="space-y-2 border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">ค่างวด:</span>
                  <span>{formatNumber(receipt.paymentInfo.baseAmount ?? receipt.paymentInfo.amount)} ฿</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">ค่าปรับล่าช้า:</span>
                  <span
                    className={
                      receipt.paymentInfo.lateFee && receipt.paymentInfo.lateFee > 0 ? 'text-red-600' : 'text-gray-500'
                    }
                  >
                    {formatNumber(receipt.paymentInfo.lateFee || 0)} ฿
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">ค่าติดตามหนี้:</span>
                  <span
                    className={
                      receipt.paymentInfo.collectionFee && receipt.paymentInfo.collectionFee > 0
                        ? 'text-red-600'
                        : 'text-gray-500'
                    }
                  >
                    {formatNumber(receipt.paymentInfo.collectionFee || 0)} ฿
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">ค่าธรรมเนียมอื่นๆ:</span>
                  <span>{formatNumber(receipt.paymentInfo.otherFees || 0)} ฿</span>
                </div>

                <div className="flex justify-between border-t border-gray-200 pt-2 text-lg font-semibold dark:border-gray-700">
                  <span>รวมทั้งสิ้น:</span>
                  <span className="text-[#EC1B2E]">{formatNumber(receipt.paymentInfo.amount)} ฿</span>
                </div>
              </div>
            </div>
          </MobileCard>

          <div className="space-y-3">
            <MobileButton
              variant="outline"
              className="w-full"
              onClick={() => {
                /* ดาวน์โหลด — ต่อในอนาคต */
              }}
            >
              <Download className="mr-2 h-5 w-5" />
              ดาวน์โหลดใบเสร็จ
            </MobileButton>
          </div>
        </div>
      </MobileContent>

      <BottomNavigation currentPath="/installment" />
    </MobileLayout>
  )
}
