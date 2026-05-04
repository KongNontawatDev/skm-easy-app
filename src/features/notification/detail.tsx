import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MobileLayout, MobileHeader, MobileContent, MobileButton, BottomNavigation } from '@/components/mobile'
import { Bell, DollarSign, Gift, Settings, Clock, AlertTriangle, ArrowRight, Calendar } from 'lucide-react'
import { useParams, useRouter } from '@tanstack/react-router'
import {
  isNotificationEffectivelyRead,
  markNotificationAsRead,
} from './notification-read-state'
import { useNotificationReadUpdates } from './hooks/use-notification-read-updates'
import { useCustomerToken } from '@/hooks/use-customer-contracts'
import { fetchCustomerNotifications, markCustomerNotificationReadOnServer } from '@/lib/customer-notifications'
import { openNotificationAction } from '@/lib/notification-actions'

export function NotificationDetail() {
  const router = useRouter()
  const { id } = useParams({ from: '/notification/$id' })
  const hasToken = useCustomerToken()
  useNotificationReadUpdates()

  const { data: apiList = [], isPending, isError } = useQuery({
    queryKey: ['customer-notifications'],
    enabled: hasToken,
    queryFn: fetchCustomerNotifications,
  })

  const notification = hasToken ? apiList.find((n) => n.id === id) : undefined

  useEffect(() => {
    if (!hasToken || !notification) return
    markNotificationAsRead(notification.id)
    markCustomerNotificationReadOnServer(notification.id)
  }, [hasToken, notification])

  if (hasToken && isPending) {
    return (
      <MobileLayout>
        <MobileHeader title='รายละเอียดแจ้งเตือน' />
        <MobileContent className='flex flex-1 items-center justify-center pb-20'>
          <p className='text-sm text-gray-500'>กำลังโหลด...</p>
        </MobileContent>
        <BottomNavigation currentPath='/notification' />
      </MobileLayout>
    )
  }

  if (hasToken && isError) {
    return (
      <MobileLayout>
        <MobileHeader title='รายละเอียดแจ้งเตือน' />
        <MobileContent className='flex flex-1 items-center justify-center pb-20'>
          <p className='text-sm text-red-600'>โหลดแจ้งเตือนไม่สำเร็จ</p>
        </MobileContent>
        <BottomNavigation currentPath='/notification' />
      </MobileLayout>
    )
  }

  if (!notification) {
    return (
      <MobileLayout>
        <MobileHeader title='ไม่พบแจ้งเตือน' />
        <MobileContent className='flex h-full flex-1 items-center justify-center pb-20'>
          <div className='text-center'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100'>
              <span className='text-2xl'>🔔</span>
            </div>
            <p className='text-gray-500'>ไม่พบแจ้งเตือนที่คุณต้องการ</p>
          </div>
        </MobileContent>
        <BottomNavigation currentPath='/notification' />
      </MobileLayout>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('th-TH', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <DollarSign className='h-6 w-6' />
      case 'promotion':
        return <Gift className='h-6 w-6' />
      case 'system':
        return <Settings className='h-6 w-6' />
      case 'reminder':
        return <Clock className='h-6 w-6' />
      case 'alert':
        return <AlertTriangle className='h-6 w-6' />
      default:
        return <Bell className='h-6 w-6' />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payment':
        return 'bg-blue-100 text-blue-600'
      case 'promotion':
        return 'bg-purple-100 text-purple-600'
      case 'system':
        return 'bg-gray-100 text-gray-600'
      case 'reminder':
        return 'bg-yellow-100 text-yellow-600'
      case 'alert':
        return 'bg-red-100 text-red-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'payment':
        return 'การชำระเงิน'
      case 'promotion':
        return 'โปรโมชั่น'
      case 'system':
        return 'ระบบ'
      case 'reminder':
        return 'แจ้งเตือน'
      case 'alert':
        return 'แจ้งเตือน'
      default:
        return 'ทั่วไป'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'ด่วนมาก'
      case 'high':
        return 'สูง'
      case 'medium':
        return 'ปานกลาง'
      case 'low':
        return 'ต่ำ'
      default:
        return 'ไม่ทราบ'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700'
      case 'high':
        return 'bg-orange-100 text-orange-700'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700'
      case 'low':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const effectivelyRead = isNotificationEffectivelyRead(notification)

  return (
    <MobileLayout>
      <MobileHeader title='รายละเอียดแจ้งเตือน' />
      <MobileContent className='pb-20'>
        <div className='space-y-6'>
          <div className='rounded-2xl bg-white p-4'>
            <div className='mb-4 flex items-start space-x-3'>
              <div
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${getTypeColor(notification.type)}`}
              >
                {getTypeIcon(notification.type)}
              </div>
              <div className='flex-1'>
                <h1 className='mb-2 text-xl font-bold text-gray-900'>{notification.title}</h1>
                <div className='flex items-center space-x-2'>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${getTypeColor(notification.type)}`}>
                    {getTypeText(notification.type)}
                  </span>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                    {getPriorityText(notification.priority)}
                  </span>
                  {notification.isImportant && (
                    <span className='rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700'>สำคัญ</span>
                  )}
                </div>
              </div>
            </div>

            <div className='mb-4'>
              <p className='leading-relaxed text-gray-700'>{notification.message}</p>
            </div>

            <div className='flex items-center text-sm text-gray-500'>
              <Calendar className='mr-2 h-4 w-4' />
              <span>{formatDate(notification.createdAt)}</span>
            </div>
          </div>

          <div className='rounded-2xl bg-white p-4'>
            <h3 className='mb-4 text-lg font-semibold text-gray-900'>สถานะ</h3>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-gray-600 dark:text-gray-400'>สถานะการอ่าน</span>
                <div className='flex items-center gap-2'>
                  {!effectivelyRead && <span className='h-2 w-2 rounded-full bg-red-500' aria-hidden />}
                  <span
                    className={`font-medium ${
                      effectivelyRead ? 'text-gray-700 dark:text-gray-300' : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {effectivelyRead ? 'อ่านแล้ว' : 'ยังไม่อ่าน'}
                  </span>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-gray-600'>ความสำคัญ</span>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                  {getPriorityText(notification.priority)}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-gray-600'>ประเภท</span>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${getTypeColor(notification.type)}`}>
                  {getTypeText(notification.type)}
                </span>
              </div>
            </div>
          </div>

          {notification.relatedId && notification.relatedType && (
            <div className='rounded-2xl bg-white p-4'>
              <h3 className='mb-4 text-lg font-semibold text-gray-900'>ข้อมูลที่เกี่ยวข้อง</h3>
              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>ประเภท</span>
                  <span className='font-medium'>
                    {notification.relatedType === 'contract'
                      ? 'สัญญา'
                      : notification.relatedType === 'invoice'
                        ? 'ใบแจ้งหนี้'
                        : notification.relatedType === 'receipt'
                          ? 'ใบเสร็จ'
                          : notification.relatedType === 'installment'
                            ? 'ค่างวด'
                            : notification.relatedType === 'promotion'
                              ? 'โปรโมชั่น'
                              : 'อื่นๆ'}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>รหัส</span>
                  <span className='font-medium'>{notification.relatedId}</span>
                </div>
              </div>
            </div>
          )}

          <div className='flex flex-col gap-3'>
            {notification.actionUrl1 && notification.actionText1 && (
              <MobileButton
                className='flex h-12 w-full items-center justify-center'
                onClick={() => {
                  markNotificationAsRead(notification.id)
                  markCustomerNotificationReadOnServer(notification.id)
                  openNotificationAction(notification.actionUrl1!, router.navigate)
                }}
              >
                <ArrowRight className='mr-2 h-4 w-4' />
                {notification.actionText1}
              </MobileButton>
            )}
            {notification.actionUrl2 && notification.actionText2 && (
              <MobileButton
                variant='outline'
                className='flex h-12 w-full items-center justify-center'
                onClick={() => {
                  markNotificationAsRead(notification.id)
                  markCustomerNotificationReadOnServer(notification.id)
                  openNotificationAction(notification.actionUrl2!, router.navigate)
                }}
              >
                <ArrowRight className='mr-2 h-4 w-4' />
                {notification.actionText2}
              </MobileButton>
            )}
          </div>
        </div>
      </MobileContent>
      <BottomNavigation currentPath='/notification' />
    </MobileLayout>
  )
}
