import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import type { ContractCard } from '../types'
import { cn } from '@/lib/utils'

export type ContractCarouselMode = 'home' | 'installment'

export interface ContractCardsCarouselProps {
  contracts: ContractCard[]
  className?: string
  mode: ContractCarouselMode
  /** หน้า installment: เลื่อนแนวนอนให้ตรงกับ index จาก URL */
  scrollToIndex?: number
  /** หน้า installment: contractId ปัจจุบันจาก URL — ใช้กันยิง navigate ซ้ำตอน sync scroll */
  activeContractId?: string
}

const STATUS_CONFIG = {
  active: {
    label: 'ปกติ',
    badgeBg: 'bg-emerald-500/90',
    accent: 'border-l-emerald-500',
    ring: 'ring-emerald-500/20',
  },
  overdue: {
    label: 'ค้างชำระ',
    badgeBg: 'bg-red-500/90',
    accent: 'border-l-red-500',
    ring: 'ring-red-500/20',
  },
  completed: {
    label: 'ปิดสัญญา',
    badgeBg: 'bg-sky-500/90',
    accent: 'border-l-sky-500',
    ring: 'ring-sky-500/20',
  },
} as const

function getCardSurfaceClass(status: ContractCard['status']): string {
  if (status === 'overdue') {
    return 'bg-gradient-to-br from-rose-50/95 via-white to-stone-50 dark:from-rose-950/25 dark:via-gray-900 dark:to-zinc-950'
  }
  if (status === 'completed') {
    return 'bg-gradient-to-br from-slate-50 to-slate-100/90 dark:from-slate-900 dark:to-slate-950'
  }
  return 'bg-gradient-to-br from-gray-50 via-white to-gray-100/80 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950'
}

const SCROLL_GAP_PX = 8

export function ContractCardsCarousel({
  contracts,
  className,
  mode,
  scrollToIndex = 0,
  activeContractId,
}: ContractCardsCarouselProps) {
  const navigate = useNavigate()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const programmaticScrollRef = useRef(false)
  const scrollDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  const contractPaymentData = useMemo(() => {
    return contracts.map((contract) => ({
      contractId: contract.id,
      amount: contract.remainingAmount,
    }))
  }, [contracts])

  const clampedScrollIndex = Math.min(
    Math.max(0, scrollToIndex),
    Math.max(0, contracts.length - 1),
  )

  /** เลื่อนให้ตรง index จาก parent (เช่น หลังโหลด / URL เปลี่ยน) — ไม่ยิง navigate */
  useEffect(() => {
    const root = scrollerRef.current
    if (!root || contracts.length === 0) return
    const child = root.children[clampedScrollIndex] as HTMLElement | undefined
    if (!child) return

    programmaticScrollRef.current = true
    child.scrollIntoView({ behavior: 'instant', inline: 'center', block: 'nearest' })
    setActiveIdx(clampedScrollIndex)
    const t = window.setTimeout(() => {
      programmaticScrollRef.current = false
    }, 200)
    return () => window.clearTimeout(t)
  }, [clampedScrollIndex, contracts.length])

  const onScrollerScroll = useCallback(() => {
    if (programmaticScrollRef.current) return
    if (scrollDebounceRef.current) window.clearTimeout(scrollDebounceRef.current)
    scrollDebounceRef.current = window.setTimeout(() => {
      scrollDebounceRef.current = null
      const root = scrollerRef.current
      if (!root || contracts.length === 0) return
      const first = root.children[0] as HTMLElement | undefined
      if (!first) return
      const step = first.getBoundingClientRect().width + SCROLL_GAP_PX
      if (step <= 0) return
      const idx = Math.max(0, Math.min(Math.round(root.scrollLeft / step), contracts.length - 1))
      setActiveIdx(idx)
      if (mode !== 'installment') return
      const id = contracts[idx]?.id
      if (!id) return
      if (activeContractId && (id === activeContractId || decodeMatch(id, activeContractId))) return
      void navigate({ to: '/installment', search: { contractId: id }, replace: true })
    }, 60)
  }, [activeContractId, contracts, mode, navigate])

  const scrollToSlide = (i: number) => {
    const root = scrollerRef.current
    if (!root) return
    const child = root.children[i] as HTMLElement | undefined
    if (!child) return
    programmaticScrollRef.current = true
    child.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    setActiveIdx(i)
    if (mode === 'installment' && contracts[i]?.id) {
      void navigate({
        to: '/installment',
        search: { contractId: contracts[i].id },
        replace: true,
      })
    }
    window.setTimeout(() => {
      programmaticScrollRef.current = false
    }, 400)
  }

  if (contracts.length === 0) {
    return (
      <div className={`p-4 sm:p-6 text-center ${className ?? ''}`}>
        <div className="text-gray-500 dark:text-gray-400">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-xl sm:text-2xl">📋</span>
          </div>
          <p className="text-base sm:text-lg font-medium mb-1 text-gray-900 dark:text-gray-100">ไม่มีข้อมูลสัญญา</p>
          <p className="text-xs sm:text-sm">เริ่มต้นการผ่อนชำระรถคันแรกของคุณ</p>
        </div>
      </div>
    )
  }

  const hint =
    mode === 'home' ? 'แตะการ์ดเพื่อดูค่างวด' : 'แตะการ์ดเพื่อเลือกสัญญา'

  return (
    <div className={cn('relative', className)}>
      <div className="flex items-center justify-between mb-1.5 min-[375px]:mb-2 sm:mb-3">
        <h3 className="text-sm min-[375px]:text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
          สัญญาของฉัน ({contracts.length})
        </h3>
      </div>

      <div
        ref={scrollerRef}
        onScroll={onScrollerScroll}
        className={cn(
          'flex gap-2 overflow-x-auto pb-1',
          'snap-x snap-mandatory scroll-smooth',
          '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        )}
      >
        {contracts.map((contract, _index) => {
          const status = STATUS_CONFIG[contract.status]
          const paymentAmount =
            contractPaymentData.find((p) => p.contractId === contract.id)?.amount ?? 0

          return (
            <div
              key={contract.id}
              className="min-w-[min(92%,calc(100vw-2.5rem))] shrink-0 snap-center max-w-lg"
            >
              <Link
                to="/installment"
                search={{ contractId: contract.id }}
                replace={mode === 'installment'}
                draggable={false}
                className={cn(
                  'block w-full touch-manipulation rounded-xl border border-gray-100 text-left shadow-md transition-shadow',
                  'hover:shadow-lg active:scale-[0.99] dark:border-gray-700',
                  'border-l-[4px]',
                  status.accent,
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                  status.ring,
                  'dark:ring-offset-gray-900',
                  getCardSurfaceClass(contract.status),
                )}
              >
                <div className="px-3 py-2.5 min-[375px]:px-4 min-[375px]:py-3 min-[414px]:py-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span
                          className={`${status.badgeBg} inline-flex shrink-0 text-white text-[9px] min-[375px]:text-[10px] font-semibold px-1.5 min-[375px]:px-2 py-0.5 rounded-full`}
                        >
                          {status.label}
                        </span>
                        <span className="text-[9px] min-[375px]:text-[10px] font-mono text-gray-500 dark:text-gray-400 truncate">
                          {contract.contractNumber}
                        </span>
                      </div>
                      <h4 className="text-gray-900 dark:text-gray-100 text-sm min-[375px]:text-base min-[414px]:text-lg font-bold leading-snug">
                        {contract.vehicleInfo.brand} {contract.vehicleInfo.model}
                      </h4>
                      <p className="text-gray-500 dark:text-gray-400 text-[10px] min-[375px]:text-[11px] mt-0.5">
                        {contract.vehicleInfo.year} · สี{contract.vehicleInfo.color}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 min-[414px]:w-6 min-[414px]:h-6 text-gray-300 dark:text-gray-600 shrink-0 mt-0.5" />
                  </div>

                  <div className="mt-2.5 min-[375px]:mt-3 flex items-end justify-between gap-2 border-t border-gray-200/80 pt-2 dark:border-gray-700/80">
                    <div className="min-w-0">
                      <p className="text-[8px] min-[375px]:text-[9px] min-[414px]:text-[10px] text-gray-400 dark:text-gray-500">
                        ยอดค้างชำระ
                      </p>
                      <p className="text-base min-[375px]:text-lg min-[414px]:text-xl font-extrabold text-[#EC1B2E] leading-tight tabular-nums">
                        {paymentAmount.toLocaleString('th-TH')}
                        <span className="text-[9px] min-[375px]:text-[10px] font-semibold ml-0.5 text-[#EC1B2E]/80">
                          ฿
                        </span>
                      </p>
                    </div>
                    <span className="text-[10px] min-[375px]:text-[11px] font-medium text-[#EC1B2E]/90 whitespace-nowrap">
                      {hint}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )
        })}
      </div>

      {contracts.length > 1 && (
        <div className="flex items-center justify-center gap-1 min-[375px]:gap-1.5 mt-2 min-[375px]:mt-2.5 sm:mt-3">
          {contracts.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToSlide(i)}
              className={cn(
                'h-[4px] min-[375px]:h-[5px] sm:h-[6px] rounded-full cursor-pointer transition-all duration-300',
                i === activeIdx ? 'bg-[#EC1B2E]' : 'bg-black/15 dark:bg-white/20',
              )}
              style={{ width: i === activeIdx ? 18 : 5 }}
              aria-label={`ไปยังสไลด์ ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function decodeMatch(a: string, b: string): boolean {
  try {
    return decodeURIComponent(b) === a || decodeURIComponent(a) === b
  } catch {
    return false
  }
}
