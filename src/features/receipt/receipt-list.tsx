import { useMemo } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { MobileLayout } from '@/components/mobile/mobile-layout'
import { MobileHeader } from '@/components/mobile/mobile-header'
import { MobileContent } from '@/components/mobile/mobile-content'
import { MobileCard } from '@/components/mobile/mobile-card'
import { MobileButton } from '@/components/mobile/mobile-button'
import { BottomNavigation } from '@/components/mobile/bottom-navigation'
import { Receipt } from 'lucide-react'
import { getReceiptsByContract, getContractById } from '@/lib/mock-data'
import { useCustomerToken } from '@/hooks/use-customer-contracts'
import { skmApi, unwrapData } from '@/lib/skm-api'
import {
  encodeReceiptApiId,
  filterReceiptRowsForContract,
  mapReceiptApiRowToReceiptData,
} from '@/lib/legacy-billing-from-api'
import { mapLegacyContractDetailToContractData } from '@/lib/legacy-contract-detail-map'

export function ReceiptList() {
  const { contractId } = useParams({ from: '/receipt/$contractId' })
  const hasToken = useCustomerToken()

  const { data: detailRow, isLoading: detailLoading } = useQuery({
    queryKey: ['me-contract-detail-receipt-list', contractId],
    enabled: hasToken && !!contractId,
    queryFn: async () => {
      const res = await skmApi.get(`/me/contracts/${encodeURIComponent(contractId)}`)
      return unwrapData<Record<string, unknown>>(res)
    },
  })

  const { data: apiRows, isLoading: rowsLoading } = useQuery({
    queryKey: ['me-receipts-list', contractId],
    enabled: hasToken && !!contractId,
    queryFn: async () => {
      const res = await skmApi.get('/me/receipts')
      return unwrapData<Record<string, unknown>[]>(res)
    },
  })

  const apiReceipts = useMemo(() => {
    const filtered = filterReceiptRowsForContract(apiRows ?? [], contractId)
    return filtered.map((row) => mapReceiptApiRowToReceiptData(row, contractId))
  }, [apiRows, contractId])

  const contractFromApi = useMemo(() => {
    if (!hasToken || !detailRow || Object.keys(detailRow).length === 0) return null
    return mapLegacyContractDetailToContractData(detailRow, contractId)
  }, [hasToken, detailRow, contractId])

  const mockContract = !hasToken ? getContractById(contractId) : undefined
  const mockReceipts = !hasToken ? getReceiptsByContract(contractId) : []

  const contract = hasToken ? contractFromApi ?? undefined : mockContract
  const allReceipts = hasToken ? apiReceipts : mockReceipts
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
        return 'เสร็จสิ้น'
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
      <MobileHeader title="ใบเสร็จ" />
      <MobileContent>
        {loading ? (
          <MobileCard>
            <p className="py-6 text-center text-gray-500">กำลังโหลด...</p>
          </MobileCard>
        ) : null}

        {contract && !loading ? (
          <MobileCard>
            <div className="mb-3 flex items-center space-x-3">
              <Receipt className="h-5 w-5 text-green-600" />
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
          {allReceipts.map((receipt) => (
            <MobileCard key={receipt.id}>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg bg-green-100 p-2">
                    <Receipt className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{receipt.receiptNumber}</h4>
                    <p className="text-sm text-gray-600">{formatDate(receipt.paymentInfo.paymentDate)}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(receipt.paymentInfo.status)}`}>
                  {getStatusText(receipt.paymentInfo.status)}
                </span>
              </div>

              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">วิธีการชำระ:</span>
                  <span className="text-sm font-medium">{receipt.paymentInfo.method}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">ยอดเงิน:</span>
                  <span className="text-lg font-semibold text-green-600">
                    {formatNumber(receipt.paymentInfo.amount)} บาท
                  </span>
                </div>
                {receipt.paymentInfo.reference ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">เลขอ้างอิง:</span>
                    <span className="text-sm font-medium">{receipt.paymentInfo.reference}</span>
                  </div>
                ) : null}
              </div>

              <Link
                to="/receipt/detail/$receiptId"
                params={{ receiptId: hasToken ? encodeReceiptApiId(receipt.id) : receipt.id }}
                className="w-full"
              >
                <MobileButton className="w-full bg-green-600 text-white hover:bg-green-700">
                  <Receipt className="mr-2 h-4 w-4" />
                  ดูรายละเอียด
                </MobileButton>
              </Link>
            </MobileCard>
          ))}
        </div>

        {!loading && allReceipts.length === 0 ? (
          <MobileCard>
            <div className="py-8 text-center">
              <Receipt className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-500">ไม่พบข้อมูลใบเสร็จ</p>
            </div>
          </MobileCard>
        ) : null}
      </MobileContent>
      <BottomNavigation currentPath="/installment" />
    </MobileLayout>
  )
}
