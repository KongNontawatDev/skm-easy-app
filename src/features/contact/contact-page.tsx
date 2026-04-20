import { MobileLayout, MobileHeader, MobileContent, BottomNavigation, MobileButton } from '@/components/mobile'
import { ContactInfo } from './components/contact-info'
import { FIXED_STORE_CONTACT } from './data/fixed-store-contact'
import { MessageSquare } from 'lucide-react'
import { useRouter } from '@tanstack/react-router'

export function Contact() {
  const router = useRouter()

  return (
    <MobileLayout>
      <MobileHeader title="ติดต่อบริษัท" showMoreMenu={true} />
      <MobileContent className="pb-20">
        <div className="space-y-6">
          <ContactInfo contactInfo={FIXED_STORE_CONTACT} />

          <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-gray-700 dark:bg-gray-800/50">
            <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
              ต้องการแจ้งปัญหาการใช้งานหรือสอบถามเจ้าหน้าที่โดยตรง สามารถส่งเรื่องผ่านระบบได้จากเมนูด้านล่าง
            </p>
            <MobileButton
              type="button"
              variant="outline"
              className="flex w-full items-center justify-center"
              onClick={() => void router.navigate({ to: '/ticket' })}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              ไปหน้าแจ้งปัญหา
            </MobileButton>
          </div>
        </div>
      </MobileContent>
      <BottomNavigation currentPath="/contact" />
    </MobileLayout>
  )
}
