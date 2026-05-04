import { useNavigate } from '@tanstack/react-router'
import {
  MobileLayout,
  MobileHeader,
  MobileContent,
  BottomNavigation,
  MobileButton,
  MobileCard,
  ThemeSwitch,
} from '@/components/mobile'
import { Switch } from '@/components/ui/switch'
import { Bell, Shield, Palette, ChevronRight } from 'lucide-react'
import { useCustomerToken } from '@/hooks/use-customer-contracts'

export function Settings() {
  const navigate = useNavigate()
  const hasSession = useCustomerToken()

  return (
    <MobileLayout>
      <MobileHeader title="ตั้งค่า" showMoreMenu={true} />

      <MobileContent className="pb-20">
        <div className="space-y-6">
          <MobileCard className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">ธีม</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Palette className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">ธีมแอป</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">เลือกธีมที่คุณต้องการ</p>
                </div>
              </div>
              <ThemeSwitch />
            </div>
          </MobileCard>

          <MobileCard className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">ความปลอดภัย</h3>
            <div className="space-y-4">
              {hasSession ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ลงทะเบียน LINE ได้สูงสุด 2 บัญชีต่อลูกค้า — ยกเลิกการเชื่อมต่อหรือดูโปรไฟล์ได้ที่เมนู{' '}
                  <button
                    type="button"
                    className="font-medium text-primary underline-offset-2 hover:underline"
                    onClick={() => void navigate({ to: '/profile' })}
                  >
                    โปรไฟล์
                  </button>
                </p>
              ) : null}
              <MobileButton 
                variant="ghost" 
                className="w-full justify-between h-auto p-0"
                onClick={() => void navigate({ to: '/settings/privacy-policy' })}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-gray-100">นโยบายความเป็นส่วนตัว</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">อ่านนโยบายความเป็นส่วนตัวของเรา</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </MobileButton>
            </div>
          </MobileCard>

          <MobileCard className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">การตั้งค่าแอป</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Bell className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">การแจ้งเตือน</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">รับการแจ้งเตือนจากแอป</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </MobileCard>
        </div>
      </MobileContent>

      <BottomNavigation currentPath="/settings" />
    </MobileLayout>
  )
}
