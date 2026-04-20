import { useQuery, useQueryClient } from '@tanstack/react-query'
import { MobileLayout, MobileHeader, MobileContent, BottomNavigation } from '@/components/mobile'
import { NotificationCard } from './components/notification-card'
import {
  isNotificationEffectivelyRead,
  markAllNotificationsAsRead,
} from './notification-read-state'
import { useNotificationReadUpdates } from './hooks/use-notification-read-updates'
import { useCustomerToken } from '@/hooks/use-customer-contracts'
import { fetchCustomerNotifications, markCustomerNotificationReadOnServer } from '@/lib/customer-notifications'

export function Notification() {
  useNotificationReadUpdates()
  const qc = useQueryClient()
  const hasToken = useCustomerToken()

  const { data: apiList = [] } = useQuery({
    queryKey: ['customer-notifications'],
    enabled: hasToken,
    queryFn: fetchCustomerNotifications,
  })

  const sortedNotifications = hasToken
    ? [...apiList].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : []

  const handleMarkAllAsRead = () => {
    const unread = sortedNotifications.filter((n) => !isNotificationEffectivelyRead(n))
    if (hasToken) {
      for (const n of unread) {
        markCustomerNotificationReadOnServer(n.id)
      }
      void qc.invalidateQueries({ queryKey: ['customer-notifications'] })
    }
    markAllNotificationsAsRead(sortedNotifications.map((n) => n.id))
  }

  const unreadCount = sortedNotifications.filter((n) => !isNotificationEffectivelyRead(n)).length

  return (
    <MobileLayout>
      <MobileHeader title='แจ้งเตือน' showMoreMenu={true} />
      <MobileContent className='pb-20'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-gray-600 dark:text-gray-400'>
              {unreadCount > 0
                ? `มี ${unreadCount} ข้อความที่ยังไม่อ่าน`
                : `ทั้งหมด ${sortedNotifications.length} รายการ`}
            </span>
            {unreadCount > 0 && (
              <button type='button' onClick={handleMarkAllAsRead} className='text-sm font-medium text-[#EC1B2E]'>
                อ่านทั้งหมด
              </button>
            )}
          </div>

          {sortedNotifications.length > 0 ? (
            <div className='space-y-3'>
              {sortedNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  isRead={isNotificationEffectivelyRead(notification)}
                />
              ))}
            </div>
          ) : !hasToken ? (
            <div className='py-10 text-center text-gray-500 dark:text-gray-400'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800'>
                <span className='text-2xl'>🔔</span>
              </div>
              <p className='mb-2 text-lg font-medium text-gray-900 dark:text-gray-100'>ล็อกอินก่อน</p>
              <p className='text-sm'>ล็อกอินด้วย OTP เพื่อดูแจ้งเตือนจากระบบ</p>
            </div>
          ) : (
            <div className='py-10 text-center text-gray-500 dark:text-gray-400'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800'>
                <span className='text-2xl'>🔔</span>
              </div>
              <p className='mb-2 text-lg font-medium text-gray-900 dark:text-gray-100'>ไม่มีแจ้งเตือน</p>
              <p className='text-sm'>เมื่อมีแจ้งเตือนจากระบบ จะแสดงที่นี่</p>
            </div>
          )}
        </div>
      </MobileContent>
      <BottomNavigation currentPath='/notification' />
    </MobileLayout>
  )
}
