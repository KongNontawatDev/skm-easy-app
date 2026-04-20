import { useMemo } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { MobileLayout } from '@/components/mobile/mobile-layout'
import { MobileHeader } from '@/components/mobile/mobile-header'
import { MobileContent } from '@/components/mobile/mobile-content'
import { MobileCard } from '@/components/mobile/mobile-card'
import { MobileButton } from '@/components/mobile/mobile-button'
import { BottomNavigation } from '@/components/mobile/bottom-navigation'
import { FileText } from 'lucide-react'
import { getInvoicesByContract, getContractById } from '@/lib/mock-data'
import { useCustomerToken } from '@/hooks/use-customer-contracts'
import { skmApi, unwrapData } from '@/lib/skm-api'
import { mapInstallmentRowToInvoiceData } from '@/lib/legacy-billing-from-api'
import { mapLegacyContractDetailToContractData } from '@/lib/legacy-contract-detail-map'

export function InvoiceList() {
  const { contractId } = useParams({ from: '/invoice/$contractId' })
  const hasToken = useCustomerToken()

  const { data: detailRow, isLoading: detailLoading } = useQuery({
    queryKey: ['me-contract-detail-invoice-list', contractId],
    enabled: hasToken && !!contractId,
    queryFn: async () => {
      const res = await skmApi.get(`/me/contracts/${encodeURIComponent(contractId)}`)
      const row = unwrapData<Record<string, unknown>>(res)
      return row
    },
  })

  const { data: apiRows, isLoading: rowsLoading } = useQuery({
    queryKey: ['me-installments-invoice-list', contractId],
    enabled: hasToken && !!contractId,
    queryFn: async () => {
      const res = await skmApi.get(`/me/contracts/${encodeURIComponent(contractId)}/installments`)
      return unwrapData<Record<string, unknown>[]>(res)
    },
  })

  const apiInvoices = useMemo(() => {
    if (!apiRows?.length) return []
    return apiRows.map((row) => mapInstallmentRowToInvoiceData(row, contractId))
  }, [apiRows, contractId])

  const contractFromApi = useMemo(() => {
    if (!hasToken || !detailRow || Object.keys(detailRow).length === 0) return null
    return mapLegacyContractDetailToContractData(detailRow, contractId)
  }, [hasToken, detailRow, contractId])

  const mockContract = !hasToken ? getContractById(contractId) : undefined
  const mockInvoices = !hasToken ? getInvoicesByContract(contractId) : []

  const contract = hasToken ? contractFromApi ?? undefined : mockContract
  const allInvoices = hasToken ? apiInvoices : mockInvoices
  const loading = hasToken && (detailLoading || rowsLoading)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', {
      day: '2-digit',
      month: 'short',
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
      <MobileHeader title="ใบแจ้งหนี้" />
      <MobileContent>
        {loading ? (
          <MobileCard>
            <p className="py-6 text-center text-gray-500">กำลังโหลด...</p>
          </MobileCard>
        ) : null}

        {contract && !loading ? (
          <MobileCard>
            <div className="mb-3 flex items-center space-x-3">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">สัญญา {contract.contractNumber}</h3>
            </div>
            <div className="text-sm text-gray-600">
              <p>
                {contract.vehicleInfo.brand} {contract.vehicleInfo.model} ({contract.vehicleInfo.year})
              </p>
              <p>ทะเบียน: {contract.vehicleInfo.plateNumber}</p>
            </div>
          </MobileCard>
        ) : null}

        <div className="space-y-3">
          {allInvoices.map((invoice) => (
            <MobileCard key={invoice.id}>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{invoice.invoiceNumber}</h4>
                    <p className="text-sm text-gray-600">{formatDate(invoice.billingInfo.issueDate)}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(invoice.status)}`}>
                  {getStatusText(invoice.status)}
                </span>
              </div>

              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">ครบกำหนด:</span>
                  <span className="text-sm font-medium">{formatDate(invoice.billingInfo.dueDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">ยอดเงิน:</span>
                  <span className="text-lg font-semibold text-green-600">
                    {formatNumber(invoice.billingInfo.totalAmount)} บาท
                  </span>
                </div>
                {invoice.billingInfo.paymentDate ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">ชำระเมื่อ:</span>
                    <span className="text-sm font-medium">{formatDate(invoice.billingInfo.paymentDate)}</span>
                  </div>
                ) : null}
              </div>

              <Link to="/invoice/detail/$invoiceId" params={{ invoiceId: invoice.id }} className="w-full">
                <MobileButton className="w-full bg-blue-600 text-white hover:bg-blue-700">
                  <FileText className="mr-2 h-4 w-4" />
                  ดูรายละเอียด
                </MobileButton>
              </Link>
            </MobileCard>
          ))}
        </div>

        {!loading && allInvoices.length === 0 ? (
          <MobileCard>
            <div className="py-8 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-500">ไม่พบข้อมูลใบแจ้งหนี้</p>
            </div>
          </MobileCard>
        ) : null}
      </MobileContent>
      <BottomNavigation currentPath="/installment" />
    </MobileLayout>
  )
}
