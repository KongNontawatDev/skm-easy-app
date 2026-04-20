import { useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Banknote,
  Percent,
  Hash,
  Car,
  Palette,
  CreditCard,
  Clock,
  FileText,
  BadgeCheck,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react'
import { getContractById, type ContractData } from '@/lib/mock-data'
import {
  MobileLayout,
  MobileHeader,
  MobileContent,
  BottomNavigation,
  MobileCard,
} from '@/components/mobile'
import { skmApi, unwrapData } from '@/lib/skm-api'
import { mapLegacyContractDetailToContractData } from '@/lib/legacy-contract-detail-map'
import { resolveMediaUrl } from '@/lib/media-url'
import { useCustomerToken } from '@/hooks/use-customer-contracts'

export function ContractDetail() {
  const { id } = useParams({ from: '/installment/contract/$id' })
  const hasToken = useCustomerToken()

  const { data: contract, isLoading } = useQuery({
    queryKey: ['me-contract-detail', id, hasToken],
    enabled: !!id && hasToken,
    queryFn: async (): Promise<ContractData | null> => {
      const res = await skmApi.get(`/me/contracts/${encodeURIComponent(id)}`)
      const row = unwrapData<Record<string, unknown>>(res)
      return mapLegacyContractDetailToContractData(row, id)
    },
  })

  const mockContract = !hasToken ? getContractById(id) : undefined
  const display = hasToken ? contract : mockContract

  if (!hasToken && !mockContract) {
    return (
      <MobileLayout>
        <MobileHeader title='ไม่พบข้อมูลสัญญา' />
        <MobileContent>
          <MobileCard>
            <p className='py-8 text-center text-gray-500'>เข้าสู่ระบบเพื่อดูรายละเอียดสัญญาจากระบบ</p>
          </MobileCard>
        </MobileContent>
      </MobileLayout>
    )
  }

  if (hasToken && isLoading) {
    return (
      <MobileLayout>
        <MobileHeader title='รายละเอียดสัญญา' />
        <MobileContent className='pb-20'>
          <MobileCard className='p-8'>
            <p className='text-center text-gray-500'>กำลังโหลด...</p>
          </MobileCard>
        </MobileContent>
        <BottomNavigation currentPath='/installment' />
      </MobileLayout>
    )
  }

  if (!display) {
    return (
      <MobileLayout>
        <MobileHeader title='ไม่พบข้อมูลสัญญา' />
        <MobileContent>
          <MobileCard>
            <p className='py-8 text-center text-gray-500'>ไม่พบข้อมูลสัญญาที่ระบุ</p>
          </MobileCard>
        </MobileContent>
        <BottomNavigation currentPath='/installment' />
      </MobileLayout>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatNumber = (num: number) => num.toLocaleString('th-TH')

  const statusConfig = {
    active: { label: 'ปกติ', icon: CheckCircle, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
    overdue: { label: 'ค้างชำระ', icon: AlertTriangle, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
    completed: { label: 'ปิดสัญญาแล้ว', icon: BadgeCheck, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  }

  const status = statusConfig[display.contractInfo.status]
  const StatusIcon = status.icon
  const vehicleImg = display.vehicleInfo.imageUrl ? resolveMediaUrl(display.vehicleInfo.imageUrl) : ''

  return (
    <MobileLayout>
      <MobileHeader title='รายละเอียดสัญญา' />

      <MobileContent className='pb-20'>
        <div className='space-y-4'>
          <MobileCard className='p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30'>
                  <FileText className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                </div>
                <div>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>เลขที่สัญญา</p>
                  <p className='text-lg font-bold text-gray-900 dark:text-gray-100'>{display.contractNumber}</p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}>
                <StatusIcon className='h-3.5 w-3.5' />
                {status.label}
              </span>
            </div>
          </MobileCard>

          <MobileCard className='p-4'>
            <h3 className='mb-3 text-base font-semibold text-gray-900 dark:text-gray-100'>ข้อมูลรถ</h3>
            {vehicleImg ? (
              <div className='mb-4 overflow-hidden rounded-xl'>
                <img
                  src={vehicleImg}
                  alt={`${display.vehicleInfo.brand} ${display.vehicleInfo.model}`}
                  className='h-40 w-full object-cover'
                />
              </div>
            ) : null}
            <div className='space-y-3'>
              <InfoRow icon={Car} label='ยี่ห้อ / รุ่น' value={`${display.vehicleInfo.brand} ${display.vehicleInfo.model}`} />
              <InfoRow icon={Calendar} label='ปี' value={String(display.vehicleInfo.year)} />
              <InfoRow icon={Palette} label='สี' value={display.vehicleInfo.color} />
              <InfoRow icon={Hash} label='ทะเบียน' value={display.vehicleInfo.plateNumber} />
            </div>
          </MobileCard>

          <MobileCard className='p-4'>
            <h3 className='mb-3 text-base font-semibold text-gray-900 dark:text-gray-100'>ข้อมูลผู้ซื้อ</h3>
            <div className='space-y-3'>
              <InfoRow icon={User} label='ชื่อ-นามสกุล' value={display.customerInfo.name} />
              <InfoRow icon={Phone} label='เบอร์โทรศัพท์' value={display.customerInfo.phone} />
              <InfoRow icon={Mail} label='อีเมล' value={display.customerInfo.email || '—'} />
              <InfoRow icon={MapPin} label='ที่อยู่' value={display.customerInfo.address || '—'} />
              <InfoRow icon={CreditCard} label='เลขประจำตัวผู้เสียภาษี' value={display.customerInfo.taxId || '—'} />
            </div>
          </MobileCard>

          <MobileCard className='p-4'>
            <h3 className='mb-3 text-base font-semibold text-gray-900 dark:text-gray-100'>ข้อมูลการเงิน</h3>
            <div className='space-y-3'>
              <InfoRow icon={Banknote} label='ราคารถ' value={`${formatNumber(display.financialInfo.totalAmount)} บาท`} />
              <InfoRow icon={Banknote} label='เงินดาวน์' value={`${formatNumber(display.financialInfo.downPayment)} บาท`} />
              <InfoRow icon={Banknote} label='ยอดจัดไฟแนนซ์' value={`${formatNumber(display.financialInfo.loanAmount)} บาท`} />
              <InfoRow icon={Banknote} label='ค่างวด/เดือน' value={`${formatNumber(display.financialInfo.monthlyPayment)} บาท`} highlight />
              <InfoRow icon={Percent} label='อัตราดอกเบี้ย' value={`${display.financialInfo.interestRate}% ต่อปี`} />
              <InfoRow icon={Hash} label='จำนวนงวด' value={`${display.financialInfo.term} งวด`} />
              <InfoRow icon={Banknote} label='ยอดคงเหลือ' value={`${formatNumber(display.financialInfo.remainingAmount)} บาท`} highlight />
            </div>
          </MobileCard>

          <MobileCard className='p-4'>
            <h3 className='mb-3 text-base font-semibold text-gray-900 dark:text-gray-100'>ระยะเวลาสัญญา</h3>
            <div className='space-y-3'>
              <InfoRow icon={Calendar} label='วันที่เริ่มสัญญา' value={formatDate(display.contractInfo.startDate)} />
              <InfoRow icon={Calendar} label='วันที่สิ้นสุดสัญญา' value={formatDate(display.contractInfo.endDate)} />
              <InfoRow icon={Clock} label='ระยะเวลา' value={`${display.contractInfo.term} เดือน`} />
              <InfoRow icon={Calendar} label='กำหนดชำระงวดถัดไป' value={formatDate(display.nextPaymentDate)} />
            </div>
          </MobileCard>
        </div>
      </MobileContent>

      <BottomNavigation currentPath='/installment' />
    </MobileLayout>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className='flex items-start gap-3'>
      <Icon className='mt-0.5 h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500' />
      <div className='flex flex-1 items-start justify-between gap-2'>
        <span className='text-sm text-gray-500 dark:text-gray-400'>{label}</span>
        <span className={`text-right text-sm font-medium ${highlight ? 'text-[#EC1B2E]' : 'text-gray-900 dark:text-gray-100'}`}>
          {value}
        </span>
      </div>
    </div>
  )
}
