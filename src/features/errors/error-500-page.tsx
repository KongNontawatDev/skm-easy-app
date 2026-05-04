import { Link } from '@tanstack/react-router'
import { ServerCrash, Home, RefreshCw } from 'lucide-react'
import { MobileLayout, MobileContent, MobileButton } from '@/components/mobile'

export function Error500Page() {
  return (
    <MobileLayout>
      <MobileContent className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 py-10">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <ServerCrash className="h-10 w-10 text-red-600 dark:text-red-400" aria-hidden />
        </div>
        <div className="max-w-md text-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            เกิดข้อผิดพลาดจากเซิร์ฟเวอร์
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            ระบบไม่สามารถประมวลผลคำขอได้ในขณะนี้ กรุณาลองใหม่ภายหลัง
            หรือติดต่อเจ้าหน้าที่หากยังพบปัญหา
          </p>
        </div>
        <div className="flex w-full max-w-xs flex-col gap-3">
          <MobileButton
            variant="primary"
            fullWidth
            className="w-full"
            onClick={() => {
              if (typeof window !== 'undefined') window.location.reload()
            }}
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            ลองใหม่
          </MobileButton>
          <MobileButton
            variant="outline"
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
            to="/contact-support"
            className="text-center text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            ติดต่อฝ่ายสนับสนุน
          </Link>
        </div>
      </MobileContent>
    </MobileLayout>
  )
}
