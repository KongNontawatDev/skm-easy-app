import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AlertTriangle, Home } from 'lucide-react'
import { MobileLayout, MobileContent, MobileButton } from '@/components/mobile'
import { consumeSkmAppErrorPayload, type SkmAppErrorPayload } from '@/lib/skm-app-error'

export function AppErrorPage() {
  const [payload, setPayload] = useState<SkmAppErrorPayload | null>(null)

  useEffect(() => {
    setPayload(consumeSkmAppErrorPayload())
  }, [])

  const title = payload?.title ?? 'เกิดข้อผิดพลาด'
  const detail = payload?.detail

  return (
    <MobileLayout>
      <MobileContent className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 py-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" aria-hidden />
        </div>
        <div className="max-w-md text-center">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
          {detail ? (
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{detail}</p>
          ) : (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              ระบบไม่สามารถดำเนินการต่อได้ กรุณาลองใหม่ภายหลัง หรือติดต่อเจ้าหน้าที่หากยังเกิดข้อผิดพลาด
            </p>
          )}
        </div>
        <div className="flex w-full max-w-xs flex-col gap-3">
          <MobileButton
            variant="primary"
            fullWidth
            className="w-full"
            onClick={() => {
              if (typeof window !== 'undefined') window.location.assign('/')
            }}
          >
            <Home className="mr-2 h-5 w-5" />
            กลับหน้าแรก
          </MobileButton>
          <Link
            to="/sign-in"
            className="text-center text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            ไปหน้าล็อกอิน
          </Link>
        </div>
      </MobileContent>
    </MobileLayout>
  )
}
