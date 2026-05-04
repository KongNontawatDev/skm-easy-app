import {
  MobileLayout,
  MobileHeader,
  MobileContent,
  BottomNavigation,
  MobileCard,
  MobileButton,
} from '@/components/mobile'
import {
  Download,
  DollarSign,
  FileText,
  AlertCircle,
  Calendar,
  User,
  Car,
} from 'lucide-react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useCustomerToken } from '@/hooks/use-customer-contracts'
import { skmApi, unwrapData } from '@/lib/skm-api'
import { decodeInstallmentInvoiceId, mapInstallmentRowToInvoiceData } from '@/lib/legacy-billing-from-api'
import { mapLegacyContractDetailToContractData } from '@/lib/legacy-contract-detail-map'
import { generateInvoicePDF } from '@/lib/pdf-generator'

export function InvoiceDetail() {
  const { invoiceId } = useParams({ from: '/invoice/detail/$invoiceId' })
  const navigate = useNavigate()
  const hasToken = useCustomerToken()
  const decoded = decodeInstallmentInvoiceId(invoiceId)
  const decodedContractRef = decoded?.r
  const decodedPeriod = decoded?.p

  const { data: apiInvoice, isLoading } = useQuery({
    queryKey: ['invoice-detail-api', invoiceId, decodedContractRef, decodedPeriod],
    enabled: hasToken && !!decoded,
    queryFn: async () => {
      if (!decodedContractRef || !decodedPeriod) return null
      const [installmentsRes, detailRes] = await Promise.all([
        skmApi.get(`/me/contracts/${encodeURIComponent(decodedContractRef)}/installments`),
        skmApi.get(`/me/contracts/${encodeURIComponent(decodedContractRef)}`),
      ])
      const rows = unwrapData<Record<string, unknown>[]>(installmentsRes)
      const detailRow = unwrapData<Record<string, unknown>>(detailRes)
      const contract = mapLegacyContractDetailToContractData(detailRow, decodedContractRef)
      const row = rows.find((r) => {
        const p = Number(r.periodNo ?? r.PERIOD ?? r.installmentNo ?? r.period ?? r.seq)
        return Number.isFinite(p) && p === decodedPeriod
      })
      return row ? mapInstallmentRowToInvoiceData(row, decodedContractRef, contract) : null
    },
  })

  const invoice = apiInvoice ?? undefined

  if (hasToken && decoded && isLoading) {
    return (
      <MobileLayout>
        <MobileHeader title="ใบแจ้งหนี้" />
        <MobileContent className="pb-48">
          <MobileCard className="p-8">
            <p className="text-center text-gray-500">กำลังโหลด...</p>
          </MobileCard>
        </MobileContent>
        <BottomNavigation currentPath="/installment" />
      </MobileLayout>
    )
  }

  if (!invoice) {
    return (
      <MobileLayout>
        <MobileHeader title="ไม่พบใบแจ้งหนี้" />
        <MobileContent className="pb-48">
          <MobileCard className="p-8 text-center">
            <AlertCircle className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <p className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">ไม่พบใบแจ้งหนี้</p>
            <p className="text-sm text-gray-500">ไม่พบใบแจ้งหนี้ที่ระบุ</p>
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
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'sent':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'ชำระแล้ว'
      case 'sent':
        return 'ส่งแล้ว'
      case 'pending':
        return 'รอชำระ'
      default:
        return status
    }
  }

  return (
    <MobileLayout>
      <MobileHeader title={`ใบแจ้งหนี้ ${invoice.invoiceNumber}`} />

      <MobileContent className="pb-48">
        <div className="space-y-4">
          <MobileCard className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{invoice.invoiceNumber}</h3>
                  <p className="text-sm text-gray-500">สัญญา {invoice.contractNumber}</p>
                </div>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(invoice.status)}`}>
                {getStatusText(invoice.status)}
              </span>
            </div>

            <div className="text-center">
              <div className="mb-1 text-2xl font-bold text-[#EC1B2E]">{formatNumber(invoice.billingInfo.totalAmount)} ฿</div>
              <p className="text-sm text-gray-500">จำนวนเงินรวม</p>
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
                <span>{invoice.customerInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ที่อยู่:</span>
                <span className="text-right">{invoice.customerInfo.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">เลขประจำตัวผู้เสียภาษี:</span>
                <span>{invoice.customerInfo.taxId}</span>
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
                <span>{invoice.vehicleInfo.brand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">รุ่น:</span>
                <span>{invoice.vehicleInfo.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ทะเบียน:</span>
                <span>{invoice.vehicleInfo.plateNumber}</span>
              </div>
            </div>
          </MobileCard>

          <MobileCard className="p-4">
            <h4 className="mb-3 flex items-center font-semibold text-gray-900 dark:text-gray-100">
              <Calendar className="mr-2 h-5 w-5" />
              ข้อมูลการเรียกเก็บ
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">วันที่ออก:</span>
                <span>{formatDate(invoice.billingInfo.issueDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ครบกำหนด:</span>
                <span>{formatDate(invoice.billingInfo.dueDate)}</span>
              </div>
              {invoice.billingInfo.paymentDate ? (
                <div className="flex justify-between">
                  <span className="text-gray-500">วันที่ชำระ:</span>
                  <span>{formatDate(invoice.billingInfo.paymentDate)}</span>
                </div>
              ) : null}
            </div>
          </MobileCard>

          <MobileCard className="p-4">
            <h4 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">รายการ</h4>
            <div className="space-y-3">
              {invoice.items.map((item) => (
                <div key={item.id} className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.description}</p>
                    <p className="text-xs text-gray-500">
                      จำนวน {item.quantity} x {formatNumber(item.unitPrice)} ฿
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatNumber(item.amount)} ฿</p>
                  </div>
                </div>
              ))}

              <div className="space-y-2 border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">ค่างวด:</span>
                  <span>{formatNumber(invoice.billingInfo.amount)} ฿</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">ค่าปรับล่าช้า:</span>
                  <span
                    className={
                      invoice.billingInfo.lateFee && invoice.billingInfo.lateFee > 0 ? 'text-red-600' : 'text-gray-500'
                    }
                  >
                    {formatNumber(invoice.billingInfo.lateFee || 0)} ฿
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">ค่าติดตามหนี้:</span>
                  <span
                    className={
                      invoice.billingInfo.collectionFee && invoice.billingInfo.collectionFee > 0
                        ? 'text-red-600'
                        : 'text-gray-500'
                    }
                  >
                    {formatNumber(invoice.billingInfo.collectionFee || 0)} ฿
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">ค่าธรรมเนียมอื่นๆ:</span>
                  <span>{formatNumber(invoice.billingInfo.otherFees || 0)} ฿</span>
                </div>

                <div className="flex justify-between text-lg font-semibold">
                  <span>รวมทั้งสิ้น:</span>
                  <span className="text-[#EC1B2E]">{formatNumber(invoice.billingInfo.totalAmount)} ฿</span>
                </div>
              </div>
            </div>
          </MobileCard>

          {invoice.paymentInfo ? (
            <MobileCard className="p-4">
              <h4 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">ข้อมูลการชำระเงิน</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">วิธีการชำระ:</span>
                  <span>{invoice.paymentInfo.method}</span>
                </div>
                {invoice.paymentInfo.reference ? (
                  <div className="flex justify-between">
                    <span className="text-gray-500">หมายเลขอ้างอิง:</span>
                    <span className="text-right">{invoice.paymentInfo.reference}</span>
                  </div>
                ) : null}
                <div className="flex justify-between">
                  <span className="text-gray-500">สถานะ:</span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(invoice.paymentInfo.status)}`}
                  >
                    {getStatusText(invoice.paymentInfo.status)}
                  </span>
                </div>
              </div>
            </MobileCard>
          ) : null}

          <div className="space-y-3">
            {invoice.status === 'sent' ? (
              <MobileButton
                variant="primary"
                className="w-full"
                onClick={() => {
                  void navigate({ to: '/installment/pay/$id', params: { id: invoice.contractId } })
                }}
              >
                <DollarSign className="mr-2 h-5 w-5" />
                ชำระเงิน
              </MobileButton>
            ) : null}

            <MobileButton
              variant="outline"
              className="w-full"
              onClick={() => {
                if (invoice) generateInvoicePDF(invoice)
              }}
            >
              <Download className="mr-2 h-5 w-5" />
              ดาวน์โหลดใบแจ้งหนี้
            </MobileButton>
          </div>
        </div>
      </MobileContent>

      <BottomNavigation currentPath="/installment" />
    </MobileLayout>
  )
}
