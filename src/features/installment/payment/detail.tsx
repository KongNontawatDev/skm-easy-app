import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  RefreshCw,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  Download,
} from 'lucide-react'
import { getContractById, getPaymentsByContract } from '@/lib/mock-data'
import { skmApi, unwrapData } from '@/lib/skm-api'
import {
  mapLegacyContractDetailToContractData,
  mapLegacyInstallmentsToPayments,
} from '@/lib/legacy-contract-detail-map'
import { useCustomerToken } from '@/hooks/use-customer-contracts'
import {
  calculatePaymentBreakdown,
  calculateTotalOverdueAmount,
  getOverduePayments,
  getMinimumPaymentAmount,
} from '@/lib/payment-utils'
import {
  MobileLayout,
  MobileHeader,
  MobileContent,
  BottomNavigation,
  MobileCard,
  MobileButton,
} from '@/components/mobile'
import { toast } from 'sonner'
import {
  bahtToSatangString,
  nationalId13FromProfileRow,
  readBillPaymentEnv,
  tryBuildThaiBillPaymentPayload,
} from '@/lib/thai-bill-payment-qr'

type PaymentStep = 'qrcode' | 'success'

export function PaymentDetail() {
  const { id: contractRef } = useParams({ from: '/installment/pay/$id' })
  const hasToken = useCustomerToken()
  const [isLoading, setIsLoading] = useState(true)
  const [isPaymentBreakdownExpanded, setIsPaymentBreakdownExpanded] = useState(false)
  const [currentStep, setCurrentStep] = useState<PaymentStep>('qrcode')

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['me-profile'],
    enabled: hasToken,
    queryFn: async () => {
      const res = await skmApi.get('/me/profile')
      return unwrapData<Record<string, unknown>>(res)
    },
  })

  const { data: apiPayments, isLoading: payLoading } = useQuery({
    queryKey: ['me-installments', contractRef],
    enabled: hasToken && !!contractRef,
    queryFn: async () => {
      const res = await skmApi.get(`/me/contracts/${encodeURIComponent(contractRef)}/installments`)
      const rows = unwrapData<Record<string, unknown>[]>(res)
      return mapLegacyInstallmentsToPayments(rows, contractRef)
    },
  })

  const { data: apiContract, isLoading: contractLoading } = useQuery({
    queryKey: ['me-contract-detail', contractRef],
    enabled: hasToken && !!contractRef,
    queryFn: async () => {
      const res = await skmApi.get(`/me/contracts/${encodeURIComponent(contractRef)}`)
      const row = unwrapData<Record<string, unknown>>(res)
      return mapLegacyContractDetailToContractData(row, contractRef)
    },
  })

  const payments = hasToken ? (apiPayments ?? []) : getPaymentsByContract(contractRef)
  const contract = hasToken ? apiContract ?? undefined : getContractById(contractRef)

  const currentPayment = payments.find((p) => p.status === 'pending' || p.status === 'overdue')
  const overduePayments = getOverduePayments(payments)

  useEffect(() => {
    setIsLoading(hasToken ? payLoading || contractLoading || profileLoading : false)
  }, [hasToken, payLoading, contractLoading, profileLoading])

  const totalOverdueAmount = calculateTotalOverdueAmount(payments)
  const minimumAmount = getMinimumPaymentAmount(payments)

  const nationalId13 = useMemo(() => {
    if (hasToken) return nationalId13FromProfileRow(profile)
    const t = contract?.customerInfo.taxId?.replace(/\D/g, '') ?? ''
    return t.length === 13 ? t : null
  }, [hasToken, profile, contract])

  const { billPaymentPayload, billPaymentError, billPaymentUseZeroAmount } = useMemo(() => {
    if (!contract) {
      return {
        billPaymentPayload: null as string | null,
        billPaymentError: null as string | null,
        billPaymentUseZeroAmount: true,
      }
    }
    const env = readBillPaymentEnv()
    if (hasToken && profileLoading) {
      return { billPaymentPayload: null, billPaymentError: null, billPaymentUseZeroAmount: env.useZeroAmount }
    }
    const amountSatang = env.useZeroAmount ? '0' : bahtToSatangString(totalOverdueAmount)
    if (!nationalId13) {
      return {
        billPaymentPayload: null,
        billPaymentError: 'ไม่พบเลขบัตรประชาชน 13 หลัก — ตรวจสอบข้อมูลลูกค้าในระบบหรือโปรไฟล์',
        billPaymentUseZeroAmount: env.useZeroAmount,
      }
    }
    const built = tryBuildThaiBillPaymentPayload({
      billerTaxId13: env.billerTaxId13,
      bankSuffix2: env.bankSuffix2,
      ref1NationalId13: nationalId13,
      ref2ContractNo: contract.contractNumber,
      amountSatang,
    })
    return built.ok
      ? { billPaymentPayload: built.payload, billPaymentError: null, billPaymentUseZeroAmount: env.useZeroAmount }
      : {
          billPaymentPayload: null,
          billPaymentError: built.message,
          billPaymentUseZeroAmount: env.useZeroAmount,
        }
  }, [contract, nationalId13, totalOverdueAmount, hasToken, profileLoading])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatNumber = (num: number) => num.toLocaleString('th-TH')

  if (!contract || !currentPayment) {
    return (
      <MobileLayout>
        <MobileHeader title='ไม่พบข้อมูลการชำระ' />
        <MobileContent>
          <MobileCard>
            <p className='text-center text-gray-500'>
              {!hasToken
                ? 'เข้าสู่ระบบเพื่อดูงวดผ่อนจากระบบ หรือข้อมูลตัวอย่างไม่มีสัญญานี้'
                : 'ไม่พบงวดที่ต้องชำระหรือสัญญาไม่ตรงกับบัญชีของคุณ'}
            </p>
          </MobileCard>
        </MobileContent>
        <BottomNavigation currentPath='/installment' />
      </MobileLayout>
    )
  }

  const isOverdue = new Date(currentPayment.dueDate) < new Date()

  const getStepTitle = (): string => {
    switch (currentStep) {
      case 'qrcode': return 'QR Code ชำระเงิน'
      case 'success': return 'บันทึกการชำระเงิน'
    }
  }

  return (
    <MobileLayout>
      <MobileHeader title={getStepTitle()} />

      <MobileContent className='pb-20'>
        {currentStep === 'qrcode' && (
          <QRCodeStep
            overduePayments={overduePayments}
            totalOverdueAmount={totalOverdueAmount}
            minimumAmount={minimumAmount}
            isOverdue={isOverdue}
            isLoading={isLoading}
            isPaymentBreakdownExpanded={isPaymentBreakdownExpanded}
            togglePaymentBreakdown={() => setIsPaymentBreakdownExpanded(!isPaymentBreakdownExpanded)}
            formatDate={formatDate}
            formatNumber={formatNumber}
            onConfirmPaid={() => setCurrentStep('success')}
            billPaymentPayload={billPaymentPayload}
            billPaymentError={billPaymentError}
            contractNumberLabel={contract.contractNumber}
            nationalIdMasked={
              nationalId13 ? `${nationalId13.slice(0, 3)}•••••${nationalId13.slice(-4)}` : '—'
            }
            useZeroAmount={billPaymentUseZeroAmount}
          />
        )}

        {currentStep === 'success' && <PaymentRecordedStep />}
      </MobileContent>

      <BottomNavigation currentPath='/installment' />
    </MobileLayout>
  )
}

/* ========== QRCodeStep ========== */

function QRCodeStep({
  overduePayments,
  totalOverdueAmount,
  minimumAmount,
  isOverdue,
  isLoading,
  isPaymentBreakdownExpanded,
  togglePaymentBreakdown,
  formatDate,
  formatNumber,
  onConfirmPaid,
  billPaymentPayload,
  billPaymentError,
  contractNumberLabel,
  nationalIdMasked,
  useZeroAmount,
}: {
  overduePayments: ReturnType<typeof getOverduePayments>
  totalOverdueAmount: number
  minimumAmount: number
  isOverdue: boolean
  isLoading: boolean
  isPaymentBreakdownExpanded: boolean
  togglePaymentBreakdown: () => void
  formatDate: (d: string) => string
  formatNumber: (n: number) => string
  onConfirmPaid: () => void
  billPaymentPayload: string | null
  billPaymentError: string | null
  contractNumberLabel: string
  nationalIdMasked: string
  useZeroAmount: boolean
}) {
  const [isSaving, setIsSaving] = useState(false)

  const { data: qrDataUrl, isLoading: qrGenerating } = useQuery({
    queryKey: ['bill-payment-qr-png', billPaymentPayload],
    enabled: !!billPaymentPayload,
    queryFn: async () => {
      const QR = await import('qrcode')
      return QR.default.toDataURL(billPaymentPayload!, {
        errorCorrectionLevel: 'M',
        margin: 2,
        width: 280,
        color: { dark: '#000000', light: '#ffffff' },
      })
    },
    staleTime: Infinity,
  })

  const handleSaveQRCode = useCallback(async () => {
    setIsSaving(true)
    try {
      if (!qrDataUrl) {
        toast.error('ยังไม่มี QR Code ให้บันทึก')
        return
      }
      const pngRes = await fetch(qrDataUrl)
      const pngBlob = await pngRes.blob()
      const fileName = 'qr-bill-payment.png'

      // Web Share API — works on iOS Safari, Android Chrome
      if (navigator.share) {
        const file = new File([pngBlob], fileName, { type: 'image/png' })
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            title: 'QR Code ชำระเงิน',
            files: [file],
          })
          toast.success('แชร์รูป QR Code สำเร็จ')
          return
        }
      }

      // Fallback: programmatic download (Desktop, Android fallback)
      const url = URL.createObjectURL(pngBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      // small delay before cleanup so the browser can start the download
      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 200)
      toast.success('ดาวน์โหลดรูป QR Code สำเร็จ')
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      toast.error('ไม่สามารถบันทึกรูปได้ กรุณาแคปหน้าจอแทน')
    } finally {
      setIsSaving(false)
    }
  }, [qrDataUrl])

  return (
    <div className='space-y-4'>
      <MobileCard className='p-4'>
        <div className='text-center'>
          <div className='mb-2 text-3xl font-bold text-[#EC1B2E]'>
            {formatNumber(totalOverdueAmount)} ฿
          </div>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            ยอดรวมงวดที่ค้างชำระ {overduePayments.length} งวด
          </p>
          <div className='mt-3 rounded-lg bg-green-50 p-2 dark:bg-green-900/20'>
            <p className='text-sm font-medium text-green-800 dark:text-green-200'>
              ขั้นต่ำ: {formatNumber(minimumAmount)} ฿ (งวดที่ {overduePayments[0]?.installmentNo} + ค่าธรรมเนียม)
            </p>
          </div>
        </div>
      </MobileCard>

      {isOverdue && (
        <div className='flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 dark:border-red-700 dark:bg-red-900/20'>
          <AlertCircle className='h-4 w-4 shrink-0 text-red-500 dark:text-red-400' />
          <p className='text-xs text-red-600 dark:text-red-400'>เกินกำหนดชำระ — กรุณาชำระโดยเร็วเพื่อหลีกเลี่ยงค่าปรับเพิ่มเติม</p>
        </div>
      )}

      {overduePayments.length > 0 && (
        <MobileCard className='p-4'>
          <div className='rounded-lg border border-gray-200 dark:border-gray-700'>
            <button className='flex w-full items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800' onClick={togglePaymentBreakdown}>
              <div className='flex-1'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>รายละเอียดงวดที่ค้างชำระ</h3>
                  <span className='text-xl font-bold text-[#EC1B2E]'>{formatNumber(totalOverdueAmount)} ฿</span>
                </div>
                <p className='mt-1 text-sm text-gray-500'>รวม {overduePayments.length} งวด</p>
              </div>
              {isPaymentBreakdownExpanded ? <ChevronUp className='h-5 w-5 text-gray-400' /> : <ChevronDown className='h-5 w-5 text-gray-400' />}
            </button>
            {isPaymentBreakdownExpanded && (
              <div className='border-t border-gray-200 px-4 pb-4 dark:border-gray-700'>
                <div className='space-y-4 pt-4'>
                  {overduePayments.map((payment) => {
                    const breakdown = calculatePaymentBreakdown(payment)
                    return (
                      <div key={payment.id} className='rounded-lg bg-gray-50 p-3 dark:bg-gray-800'>
                        <div className='mb-2 flex items-center justify-between'>
                          <h4 className='font-medium text-gray-900 dark:text-gray-100'>งวดที่ {payment.installmentNo}</h4>
                          <span className='text-lg font-bold text-[#EC1B2E]'>{formatNumber(breakdown.totalAmount)} ฿</span>
                        </div>
                        <p className='mb-3 text-sm text-gray-500'>
                          ครบกำหนด: {formatDate(payment.dueDate)}
                          {breakdown.daysOverdue > 0 && <span className='ml-2 text-red-500'>(เกินกำหนด {breakdown.daysOverdue} วัน)</span>}
                        </p>
                        <div className='space-y-2'>
                          {[
                            ['ค่างวด:', formatNumber(breakdown.baseAmount), false],
                            ['ค่าปรับล่าช้า:', formatNumber(breakdown.lateFee), breakdown.lateFee > 0],
                            ['ค่าติดตามหนี้:', formatNumber(breakdown.collectionFee), breakdown.collectionFee > 0],
                            ['ค่าธรรมเนียมอื่นๆ:', formatNumber(breakdown.otherFees), false],
                          ].map(([label, value, isRed]) => (
                            <div key={label as string} className='flex justify-between text-sm'>
                              <span className='text-gray-600 dark:text-gray-400'>{label as string}</span>
                              <span className={isRed ? 'text-red-600' : ''}>{value as string} ฿</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </MobileCard>
      )}

      <MobileCard className='p-4'>
        <div className='mb-3 rounded-lg border border-blue-100 bg-blue-50/90 px-3 py-2 text-left text-xs text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-100'>
          <p className='font-semibold'>Bill Payment — ธนาคารกรุงศรี (suffix 01)</p>
          <p className='mt-1 text-blue-800/90 dark:text-blue-200/90'>
            Ref1 (เลขบัตร ปชช.): <span className='font-mono'>{nationalIdMasked}</span>
          </p>
          <p className='text-blue-800/90 dark:text-blue-200/90'>
            Ref2 (เลขที่สัญญา): <span className='font-mono'>{contractNumberLabel}</span>
          </p>
          <p className='mt-1 text-blue-800/90 dark:text-blue-200/90'>
            {useZeroAmount
              ? 'ยอดใน QR เป็น 0 — เปิดแอปธนาคารแล้วกรอกยอดตามที่ต้องชำระ (รองรับชำระบางส่วน)'
              : `ยอดใน QR: ${formatNumber(totalOverdueAmount)} บาท (สตางค์ในสตริงตามยอดรวมค้าง)`}
          </p>
        </div>

        {billPaymentError ? (
          <div className='mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100'>
            {billPaymentError}
          </div>
        ) : null}

        <div className='text-center'>
          {isLoading || qrGenerating ? (
            <div className='mx-auto flex h-64 w-64 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-700'>
              <RefreshCw className='h-8 w-8 animate-spin text-gray-400' />
            </div>
          ) : qrDataUrl ? (
            <div className='mx-auto flex h-64 w-64 items-center justify-center rounded-2xl border-2 border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800'>
              <img src={qrDataUrl} alt='QR Bill Payment กรุงศรี' className='h-60 w-60 rounded-lg' />
            </div>
          ) : (
            <div className='mx-auto flex min-h-48 max-w-sm flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-400'>
              <p>ไม่สามารถสร้าง QR ได้ — ตรวจสอบข้อความด้านบน หรือลองใหม่ภายหลัง</p>
            </div>
          )}

          {/* Save QR Code button */}
          <button
            onClick={handleSaveQRCode}
            disabled={isLoading || isSaving || !qrDataUrl}
            className='mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
          >
            {isSaving ? (
              <RefreshCw className='h-4 w-4 animate-spin' />
            ) : (
              <Download className='h-4 w-4' />
            )}
            {isSaving ? 'กำลังบันทึก...' : 'บันทึกรูป QR Code'}
          </button>
        </div>
      </MobileCard>

      <MobileCard className='p-4'>
        <h3 className='mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100'>ขั้นตอนการชำระเงิน</h3>
        <div className='space-y-3 text-sm text-gray-600 dark:text-gray-400'>
          {[
            'กดปุ่ม "บันทึกรูป QR Code" หรือแคปหน้าจอเก็บไว้ในอุปกรณ์ของคุณ',
            'เปิดแอปธนาคารกรุงศรี (หรือแอปที่รองรับ Bill Payment) เลือกสแกน QR / อัปโหลดรูป QR',
            'ตรวจสอบผู้รับเงินและ Ref1 / Ref2 ให้ตรงกับเลขบัตรและเลขที่สัญญาของคุณ จากนั้นกรอกยอดเงิน (ถ้า QR ใช้ยอด 0)',
            'ยืนยันการโอน แล้วกลับมาที่แอปนี้กดปุ่ม "ชำระแล้ว" ด้านล่าง',
          ].map((text, i) => (
            <div key={i} className='flex items-start'>
              <div className='mr-3 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EC1B2E] text-xs font-bold text-white'>{i + 1}</div>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </MobileCard>

      <div className='space-y-3'>
        <MobileButton className='w-full' onClick={onConfirmPaid} size='lg'>
          <CheckCircle className='mr-2 h-5 w-5' />
          ชำระแล้ว
        </MobileButton>
      </div>
    </div>
  )
}

/* ========== PaymentRecordedStep ========== */

function PaymentRecordedStep() {
  const afterPaySteps = [
    {
      icon: CheckCircle,
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
      title: 'บันทึกข้อมูลสำเร็จ',
      desc: 'ระบบได้บันทึกข้อมูลการชำระเงินของท่านแล้ว',
      done: true,
    },
    {
      icon: Clock,
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
      title: 'เจ้าหน้าที่ตรวจสอบ',
      desc: 'เจ้าหน้าที่จะตรวจสอบรายการ Bill Payment และดำเนินการตัดชำระงวด',
      done: false,
    },
  ] as const

  return (
    <div className='space-y-4'>
      {/* Main Success Message */}
      <MobileCard className='border-green-200 bg-green-50 p-6 dark:border-green-700 dark:bg-green-900/20'>
        <div className='flex flex-col items-center text-center'>
          <div className='mb-4 rounded-full bg-green-100 p-4 dark:bg-green-900/30'>
            <CheckCircle className='h-14 w-14 text-green-600 dark:text-green-400' />
          </div>
          <h2 className='text-xl font-bold text-green-800 dark:text-green-200'>
            บันทึกข้อมูลการชำระเรียบร้อย
          </h2>
          <p className='mt-3 text-sm leading-relaxed text-green-700 dark:text-green-300'>
            ระบบได้ทำการบันทึกข้อมูลการชำระเงินของท่านแล้ว
          </p>
        </div>
      </MobileCard>

      {/* Waiting for Review */}
      <MobileCard className='border-amber-200 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-900/20'>
        <div className='flex items-start'>
          <Clock className='mr-3 mt-0.5 h-6 w-6 shrink-0 text-amber-600 dark:text-amber-400' />
          <div>
            <h4 className='font-semibold text-amber-800 dark:text-amber-200'>กรุณารอเจ้าหน้าที่ตรวจสอบ</h4>
            <p className='mt-1 text-sm leading-relaxed text-amber-700 dark:text-amber-300'>
              เจ้าหน้าที่จะทำการตรวจสอบข้อมูลการชำระเงินของท่าน เมื่อตรวจสอบเรียบร้อยแล้วระบบจะดำเนินการตัดชำระงวดให้อัตโนมัติ
            </p>
          </div>
        </div>
      </MobileCard>

      {/* Steps / What happens next */}
      <MobileCard className='p-4'>
        <h3 className='mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100'>ขั้นตอนหลังชำระเงิน</h3>
        <div className='space-y-4'>
          {afterPaySteps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={step.title} className='flex items-start'>
                <div className='relative flex flex-col items-center'>
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${step.iconBg}`}>
                    <Icon className={`h-5 w-5 ${step.iconColor}`} />
                  </div>
                  {i < afterPaySteps.length - 1 ? (
                    <div className={`mt-1 h-6 w-0.5 ${step.done ? 'bg-green-300' : 'bg-gray-200 dark:bg-gray-700'}`} />
                  ) : null}
                </div>
                <div className='ml-3 flex-1'>
                  <h4 className={`font-semibold ${step.done ? 'text-green-700 dark:text-green-300' : 'text-gray-900 dark:text-gray-100'}`}>
                    {step.title}
                    {step.done ? <span className='ml-2 text-xs text-green-600'>&#10003;</span> : null}
                  </h4>
                  <p className='mt-0.5 text-sm text-gray-500 dark:text-gray-400'>{step.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </MobileCard>

    </div>
  )
}
