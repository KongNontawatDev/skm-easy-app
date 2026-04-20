import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Calendar, CheckCircle, Clock } from 'lucide-react'
import { MobileCard } from '@/components/mobile'

type InstallmentProgressProps = {
  totalAmount: number
  paidAmount: number
  nextDueDate: string | Date
  /** จำนวนงวดที่ "ชำระแล้ว/ถึงงวดที่" (clamp 0..totalInstallments) */
  installmentIndex: number
  /** จำนวนงวดทั้งหมด */
  totalInstallments: number
  className?: string
}

const KNOB_WIDTH = 40
const PRIMARY = '#EC1B2E'

export function InstallmentProgress({
  totalAmount,
  paidAmount,
  nextDueDate,
  installmentIndex,
  totalInstallments,
  className
}: InstallmentProgressProps) {
  const {
    doneInstallments,
    total,
    instRatio,
    instPct,
    remainAmount,
    nextText,
    hasNextDate,
    nearDone,
    safePaid,
  } = useMemo(() => {
    const total = Math.max(0, Number(totalInstallments) || 0)
    const done = Math.min(Math.max(0, Number(installmentIndex) || 0), total || 0)
    const instRatio = total > 0 ? done / total : 0
    const instPct = Math.round(instRatio * 100)

    const safePaid = Math.max(0, Number(paidAmount) || 0)
    const safeTotalAmt = Math.max(0, Number(totalAmount) || 0)
    const remainAmount = Math.max(0, safeTotalAmt - safePaid)

    // วันที่งวดถัดไป — กันเคส invalid
    let nextText = '—'
    let hasNextDate = false
    try {
      const d = new Date(nextDueDate as string)
      if (!Number.isNaN(d.getTime())) {
        nextText = d.toLocaleDateString('th-TH', { 
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
        hasNextDate = true
      }
    } catch {
      /* noop */
    }

    return {
      doneInstallments: done,
      total,
      instRatio,
      instPct,
      remainAmount,
      nextText,
      hasNextDate,
      nearDone: instPct >= 70,
      safePaid,
    }
  }, [totalAmount, paidAmount, nextDueDate, installmentIndex, totalInstallments])

  // วัดความกว้าง track เพื่อคำนวณตำแหน่ง knob แบบพิกเซล
  const trackRef = useRef<HTMLDivElement>(null)
  const [trackW, setTrackW] = useState(0)
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const update = () => setTrackW(el.clientWidth)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const maxTravel = Math.max(0, trackW - KNOB_WIDTH)
  const knobX = Math.round(maxTravel * instRatio)

  const showTicks = total > 1 && total <= 18
  const ticks = showTicks ? Array.from({ length: total + 1 }, (_, i) => i) : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={className}
    >
      <MobileCard className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">ความคืบหน้าการผ่อน</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {doneInstallments}/{total} งวด
          </div>
        </div>

        {/* ===== Progress ตามงวด ===== */}
        <div className="mt-3">
          <div
            ref={trackRef}
            className="relative w-full h-5 rounded-full"
            role="progressbar"
            aria-valuenow={doneInstallments}
            aria-valuemin={0}
            aria-valuemax={total}
          >
            {/* พื้นหลังแทร็ก */}
            <div
              className="absolute inset-0 z-0 rounded-full bg-gray-200 dark:bg-gray-600"
              aria-hidden
            />

            {/* เส้นแบ่งงวด */}
            {showTicks && (
              <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
                {ticks.map((i) => {
                  const left = (i / total) * 100
                  return (
                    <div
                      key={i}
                      className="absolute top-0 h-full bg-black/10 dark:bg-white/15"
                      style={{
                        left: `${left}%`,
                        width: 1,
                        transform: 'translateX(-0.5px)',
                      }}
                    />
                  )
                })}
              </div>
            )}

            {/* Filled area */}
            <motion.div
              className="absolute left-0 top-0 h-5 rounded-full overflow-hidden"
              style={{
                background: PRIMARY,
                zIndex: 2,
              }}
              initial={{ width: '0%' }}
              animate={{ width: `${instRatio * 100}%` }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* เส้นไฮไลท์ด้านบน */}
              <div
                aria-hidden
                className="absolute left-0 right-0"
                style={{
                  top: 1,
                  height: 2,
                  background: 'rgba(255,255,255,0.65)',
                  mixBlendMode: 'soft-light',
                }}
              />
            </motion.div>

            {/* Label กลางแถบ */}
            <div
              className="absolute inset-0 z-[4] grid place-items-center text-[11px] font-medium text-gray-800 dark:text-gray-100 select-none pointer-events-none"
              aria-hidden="true"
            >
              {doneInstallments}/{total}
            </div>

            {/* Knob — คุมด้วยระยะ px (ไม่ล้นขอบ) */}
            <motion.div
              className="absolute -top-4 pointer-events-none"
              style={{ width: KNOB_WIDTH, left: 0, zIndex: 5 }}
              initial={{ x: 0 }}
              animate={{ x: knobX }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/3085/3085398.png"
                alt="motorcycle"
                width={KNOB_WIDTH}
                height={KNOB_WIDTH}
                style={{ width: KNOB_WIDTH, height: KNOB_WIDTH, display: 'block' }}
                loading="lazy"
                decoding="async"
              />
            </motion.div>
          </div>

          {/* Legend */}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <CheckCircle className="h-4 w-4 text-green-500" />
              ชำระแล้ว {safePaid.toLocaleString('th-TH')} บาท
            </div>
            <div className="font-semibold" style={{ color: PRIMARY }}>
              เหลือ {remainAmount.toLocaleString('th-TH')} บาท
            </div>
          </div>
        </div>

        {/* Meta */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <Calendar className="h-3 w-3" />
            งวดถัดไป {hasNextDate ? nextText : '—'}
          </div>
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <Clock className="h-3 w-3" />
            คืบหน้า {instPct}%
          </div>
        </div>

        {nearDone && total > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-3 px-3 py-2 text-xs rounded-lg bg-[#EC1B2E]/10 text-[#EC1B2E] dark:bg-[#EC1B2E]/20"
            role="status"
          >
            ใกล้ครบแล้ว {instPct}% — อีกนิดเดียวเท่านั้น!
          </motion.div>
        )}
      </MobileCard>
    </motion.div>
  )
}
