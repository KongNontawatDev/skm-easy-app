import { useCallback, useEffect, useState } from 'react'
import { CUSTOMER_SESSION_CHANGED, getCustomerJwtSub } from '@/lib/customer-session'
import { hasAcceptedAppTerms, markAppTermsAccepted } from '@/lib/terms-acceptance'
import { useCustomerToken } from '@/hooks/use-customer-contracts'
import { APP_TERMS_COMPANY_BLOCK, APP_TERMS_SECTIONS } from '@/features/legal/app-terms-sections'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * บังคับแสดงครั้งแรกหลังล็อกอินเมื่อยังไม่ยอมรับข้อตกลง — เก็บสถานะใน localStorage ต่อ `sub` ของ JWT
 *
 * ไม่ใช้ @radix-ui/react-dialog เพราะ Portal ไป document.body อาจทำให้เกิด Invalid hook call
 * เมื่อ bundler แยก chunk / React ซ้ำชุด — เลเยอร์ fixed นี้อยู่ใน React tree เดียวกับ route (ไม่ portal ออกนอก root)
 */
export function TermsAcceptanceModal() {
  const hasToken = useCustomerToken()
  const [open, setOpen] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const syncOpen = useCallback(() => {
    if (!hasToken) {
      setOpen(false)
      return
    }
    if (!getCustomerJwtSub()) {
      setOpen(false)
      return
    }
    setOpen(!hasAcceptedAppTerms())
  }, [hasToken])

  useEffect(() => {
    syncOpen()
    window.addEventListener(CUSTOMER_SESSION_CHANGED, syncOpen)
    return () => window.removeEventListener(CUSTOMER_SESSION_CHANGED, syncOpen)
  }, [syncOpen])

  useEffect(() => {
    if (!open || typeof document === 'undefined') return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const handleAccept = () => {
    if (!agreed) return
    markAppTermsAccepted()
    setAgreed(false)
    setOpen(false)
  }

  if (!open) return null

  return (
    <div
      className='fixed inset-0 z-[100] flex items-end justify-center p-2 sm:items-center'
      role='dialog'
      aria-modal='true'
      aria-labelledby='terms-dialog-title'
    >
      <div className='absolute inset-0 bg-black/60' aria-hidden />

      <div
        className={cn(
          'relative flex max-h-[min(88vh,640px)] w-full max-w-lg flex-col overflow-hidden rounded-xl border bg-background shadow-lg',
          'animate-in fade-in zoom-in-95 duration-200',
        )}
      >
        <header className='shrink-0 border-b px-4 py-4 text-start'>
          <h2 id='terms-dialog-title' className='text-base leading-snug font-semibold text-foreground'>
            เงื่อนไขและข้อตกลงการใช้งานแอปพลิเคชัน
          </h2>
          <p className='mt-1 text-start text-xs leading-relaxed text-muted-foreground'>
            กรุณาอ่านและยอมรับข้อตกลงก่อนใช้งานแอป ข้อมูลด้านล่างเป็นข้อตกลงระหว่างท่านกับบริษัท
          </p>
        </header>

        <div className='min-h-0 flex-1 overflow-y-auto px-4 py-3'>
          <div className='space-y-4 text-sm leading-relaxed text-foreground'>
            <div className='rounded-lg border bg-muted/30 p-3 text-xs whitespace-pre-line'>
              {APP_TERMS_COMPANY_BLOCK}
            </div>
            {APP_TERMS_SECTIONS.map((sec) => (
              <section key={sec.id} className='space-y-2'>
                <h3 className='text-sm font-semibold text-foreground'>{sec.title}</h3>
                {sec.paragraphs.map((p, i) => (
                  <p key={i} className='text-muted-foreground text-[13px]'>
                    {p}
                  </p>
                ))}
              </section>
            ))}
            <p className='text-muted-foreground text-[11px] leading-normal'>
              ข้อความนี้จัดทำเพื่อความสมเหตุสมผลทางธุรกิจและการปฏิบัติตามกฎหมายทั่วไป
              หากท่านต้องการคำแนะนำเฉพาะกรณี โปรดปรึกษานักกฎหมาย
            </p>
          </div>
        </div>

        <footer className='shrink-0 flex flex-col gap-3 border-t bg-background px-4 py-4'>
          <div className='flex items-start gap-3'>
            <input
              id='terms-agree'
              type='checkbox'
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className='border-input text-primary focus-visible:ring-ring mt-0.5 size-4 shrink-0 rounded border shadow-xs focus-visible:ring-[3px] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
            />
            <label htmlFor='terms-agree' className='cursor-pointer text-start text-sm leading-snug font-normal'>
              ข้าพเจ้าได้อ่านและยอมรับเงื่อนไขและข้อตกลงการใช้งานแอปพลิเคชันข้างต้นแล้ว
            </label>
          </div>
          <Button type='button' className='w-full' disabled={!agreed} onClick={handleAccept}>
            ยืนยันการยอมรับ
          </Button>
        </footer>
      </div>
    </div>
  )
}
