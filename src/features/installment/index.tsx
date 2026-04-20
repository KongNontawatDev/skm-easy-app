import { useState, useEffect, useMemo } from 'react'
import {
  Receipt,
  CreditCard,
  History,
  ArrowRight,
  QrCode,
  FileText,
} from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  MobileLayout,
  MobileHeader,
  MobileContent,
  BottomNavigation,
  MobileButton,
} from '@/components/mobile'
import { ContractCardsCarousel } from '../home/components/contract-cards-carousel'
import { InstallmentProgress } from '../home/components/installment-progress'
import { calculateTotalOverdueAmount, getOverdueCount } from '@/lib/payment-utils'
import { useCustomerContracts, useCustomerToken } from '@/hooks/use-customer-contracts'
import { skmApi, unwrapData } from '@/lib/skm-api'
import {
  deriveInstallmentProgressFromPayments,
  mapLegacyInstallmentsToPayments,
} from '@/lib/legacy-contract-detail-map'

/** ค่าใน URL อาจเป็น `001%3AHP-...` ส่วนในรายการสัญญาเป็น `001:HP-...` */
function findContractIndexByUrlParam(
  rows: { id: string }[],
  param: string | undefined,
): number {
  if (!param?.trim() || !rows.length) return -1
  const trimmed = param.trim()
  let decoded = trimmed
  try {
    decoded = decodeURIComponent(trimmed)
  } catch {
    /* keep trimmed */
  }
  return rows.findIndex((c) => c.id === trimmed || c.id === decoded)
}

interface InstallmentProps {
  /** จาก query ?contractId= เพื่อเลือกสัญญาทันที (เช่น จากหน้า home) */
  contractIdFromSearch?: string
}

export function Installment({ contractIdFromSearch }: InstallmentProps) {
  const navigate = useNavigate()
  const hasToken = useCustomerToken()
  const { data: contracts = [], isLoading: contractsLoading } = useCustomerContracts()

  const [selectedContractIndex, setSelectedContractIndex] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    /** มี ?contractId= ให้ URL เป็นตัวกำหนดสัญญา ไม่ดึง index จาก localStorage (จะได้ไม่ชนกับสัญญาที่เลือกจากหน้าแรก) */
    if (contractIdFromSearch) {
      setIsInitialized(true)
      return
    }
    const savedIndex = localStorage.getItem('selectedContractIndex')
    if (savedIndex !== null) {
      const index = parseInt(savedIndex, 10)
      if (!Number.isNaN(index) && index >= 0) {
        setSelectedContractIndex(index)
      }
    }
    setIsInitialized(true)
  }, [contractIdFromSearch])

  useEffect(() => {
    if (!contracts.length) return
    if (selectedContractIndex >= contracts.length) {
      setSelectedContractIndex(0)
      localStorage.setItem('selectedContractIndex', '0')
    }
  }, [contracts.length, selectedContractIndex])

  /** คำนวณ index แบบ synchronous: ถ้ามี ?contractId= ให้ใช้ก่อน state (กันเฟรมแรกยังเป็นสัญญาแรก + query งวดผิดคัน) */
  const resolvedContractIndex = useMemo(() => {
    if (!contracts.length) return 0
    if (contractIdFromSearch) {
      const fromUrl = findContractIndexByUrlParam(contracts, contractIdFromSearch)
      if (fromUrl >= 0) return fromUrl
    }
    return Math.min(Math.max(0, selectedContractIndex), contracts.length - 1)
  }, [contracts, contractIdFromSearch, selectedContractIndex])

  /** เลือกสัญญาตาม URL — sync state + localStorage ให้ตรง (สำหรับรอบถัดไปที่ไม่มี query) */
  useEffect(() => {
    if (!isInitialized || !contracts.length || !contractIdFromSearch) return
    const idx = findContractIndexByUrlParam(contracts, contractIdFromSearch)
    if (idx >= 0 && idx !== selectedContractIndex) {
      setSelectedContractIndex(idx)
      localStorage.setItem('selectedContractIndex', String(idx))
    }
  }, [isInitialized, contracts, contractIdFromSearch, selectedContractIndex])

  const selectedContract = contracts[resolvedContractIndex] ?? null
  const contractRef = selectedContract?.id ?? ''

  const { data: payments = [] } = useQuery({
    queryKey: ['me-installments', contractRef, selectedContract?.contractNumber ?? ''],
    enabled: hasToken && !!contractRef,
    queryFn: async () => {
      const res = await skmApi.get(`/me/contracts/${encodeURIComponent(contractRef)}/installments`)
      const rows = unwrapData<Record<string, unknown>[]>(res)
      return mapLegacyInstallmentsToPayments(rows, selectedContract?.contractNumber ?? contractRef)
    },
  })

  const selectedProgress = useMemo(() => {
    if (!selectedContract) return null
    return deriveInstallmentProgressFromPayments(payments, selectedContract)
  }, [payments, selectedContract])

  const getMenuItems = () => {
    if (!selectedContract) return []
    return [
      {
        id: 'contract-detail' as const,
        title: 'รายละเอียดสัญญา',
        description: 'ดูข้อมูลสัญญาเช่าซื้อ',
        icon: FileText,
        color: 'bg-blue-50 text-blue-600',
      },
      {
        id: 'invoice' as const,
        title: 'ใบแจ้งหนี้',
        description: 'ดูใบแจ้งหนี้ค่างวดรถ',
        icon: Receipt,
        color: 'bg-green-50 text-green-600',
      },
      {
        id: 'receipt' as const,
        title: 'ประวัติการชำระ/ใบเสร็จ',
        description: 'ดูประวัติการชำระและใบเสร็จ',
        icon: History,
        color: 'bg-purple-50 text-purple-600',
      },
      {
        id: 'payment' as const,
        title: 'ชำระค่างวด',
        description: 'ชำระค่างวดรถออนไลน์',
        icon: CreditCard,
        color: 'bg-orange-50 text-orange-600',
      },
    ]
  }

  const goMenu = (menuId: 'contract-detail' | 'invoice' | 'receipt' | 'payment') => {
    if (!selectedContract) return
    const id = selectedContract.id
    switch (menuId) {
      case 'contract-detail':
        void navigate({ to: '/installment/contract/$id', params: { id } })
        break
      case 'invoice':
        void navigate({ to: '/invoice/$contractId', params: { contractId: id } })
        break
      case 'receipt':
        void navigate({ to: '/receipt/$contractId', params: { contractId: id } })
        break
      case 'payment':
        void navigate({ to: '/installment/pay/$id', params: { id } })
        break
      default:
        break
    }
  }

  const handlePayNow = () => {
    if (selectedContract) {
      void navigate({
        to: '/installment/pay/$id',
        params: { id: selectedContract.id },
      })
    }
  }

  if (!isInitialized) {
    return (
      <MobileLayout>
        <MobileHeader title='ค่างวดรถ' showMoreMenu={true} />
        <MobileContent className='pb-48'>
          <div className='flex h-64 items-center justify-center'>
            <div className='text-center'>
              <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600'></div>
              <p className='text-gray-500'>กำลังโหลด...</p>
            </div>
          </div>
        </MobileContent>
        <BottomNavigation currentPath='/installment' />
      </MobileLayout>
    )
  }

  return (
    <MobileLayout>
      <MobileHeader title='ค่างวดรถ' showMoreMenu={true} />

      <MobileContent className='pb-48'>
        <div className='space-y-6'>
          {!hasToken ? (
            <div className='rounded-xl border border-amber-200 bg-amber-50/90 px-3 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200'>
              <p className='font-medium'>เข้าสู่ระบบเพื่อดูสัญญาและงวดจากระบบ</p>
              <Link to='/sign-in' className='mt-2 inline-block font-semibold text-[#EC1B2E] underline'>
                ไปหน้าเข้าสู่ระบบ
              </Link>
            </div>
          ) : null}

          <ContractCardsCarousel
            contracts={contracts}
            mode='installment'
            scrollToIndex={resolvedContractIndex}
            activeContractId={contractIdFromSearch}
          />

          {contractsLoading && hasToken ? (
            <p className='text-center text-sm text-gray-500'>กำลังโหลดสัญญา...</p>
          ) : null}

          {selectedProgress ? (
            <InstallmentProgress
              totalAmount={selectedProgress.totalAmount}
              paidAmount={selectedProgress.paidAmount}
              nextDueDate={selectedProgress.nextDueDate}
              installmentIndex={selectedProgress.installmentIndex}
              totalInstallments={selectedProgress.totalInstallments}
            />
          ) : null}

          <div className='space-y-3'>
            <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>เมนูหลัก</h2>
            {getMenuItems().map((item) => (
              <MobileButton
                key={item.id}
                variant='ghost'
                className='h-auto w-full justify-start p-4'
                onClick={() => goMenu(item.id)}
              >
                <div className='flex w-full items-center space-x-4'>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${item.color}`}>
                    <item.icon className='h-6 w-6' />
                  </div>
                  <div className='flex-1 text-left'>
                    <h3 className='font-semibold text-gray-900 dark:text-gray-100'>{item.title}</h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>{item.description}</p>
                  </div>
                  <ArrowRight className='h-5 w-5 text-gray-400 dark:text-gray-500' />
                </div>
              </MobileButton>
            ))}
          </div>
        </div>

        {selectedContract && selectedProgress && hasToken ? (
          <div
            className='fixed bottom-16 left-1/2 z-40 w-full max-w-lg -translate-x-1/2 border-t border-gray-200 bg-white p-4 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] dark:border-gray-700 dark:bg-gray-800 dark:shadow-[0_-4px_24px_rgba(0,0,0,0.35)]'
          >
            <div className='flex items-center justify-between gap-3 px-1 min-[375px]:px-3'>
              <div className='min-w-0'>
                <p className='text-sm text-gray-500 dark:text-gray-400'>ยอดที่ต้องชำระ</p>
                <p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                  {calculateTotalOverdueAmount(payments).toLocaleString()} ฿
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  {getOverdueCount(payments) > 0
                    ? `ค้างชำระ ${getOverdueCount(payments)} งวด`
                    : 'ไม่มีงวดที่ค้างชำระ'}
                </p>
              </div>
              <MobileButton
                onClick={handlePayNow}
                className='shrink-0 bg-[#EC1B2E] px-6 py-3 text-white hover:bg-[#C20010]'
              >
                <QrCode className='mr-2 h-5 w-5' />
                ชำระเลย
              </MobileButton>
            </div>
          </div>
        ) : null}
      </MobileContent>

      <BottomNavigation currentPath='/installment' />
    </MobileLayout>
  )
}
