import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import {
  ChevronRight,
  Settings,
  FileText,
  HelpCircle,
  Phone,
  Gift,
  BookOpen,
  Ticket,
  Link2Off,
  type LucideIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { unlinkCurrentLineDeviceFromApi } from '@/lib/customer-line-unlink'
import { clearCustomerSession } from '@/lib/customer-session'
import { handleServerError } from '@/lib/handle-server-error'
import { skmApi, unwrapData } from '@/lib/skm-api'
import { useCustomerToken } from '@/hooks/use-customer-contracts'
import { Skeleton } from '@/components/ui/skeleton'
import {
  MobileLayout,
  MobileHeader,
  MobileContent,
  BottomNavigation,
  MobileCard,
  MobileButton,
  MobileAvatar,
} from '@/components/mobile'
import { ErrorState } from '@/components/shared/error-state'

interface ProfileMenuItem {
  id: string
  title: string
  icon: LucideIcon
  color: string
  path: string
  disabled?: boolean
}

function pickProfileField(
  row: Record<string, unknown> | undefined,
  keys: string[]
): string {
  if (!row) return ''
  for (const k of keys) {
    const v = row[k]
    if (v != null && String(v).trim()) return String(v).trim()
  }
  return ''
}

export function Profile() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const hasSession = useCustomerToken()
  const [unlinkBusy, setUnlinkBusy] = useState(false)

  const profileQuery = useQuery({
    queryKey: ['me-profile'],
    enabled: hasSession,
    queryFn: async () => {
      const res = await skmApi.get('/me/profile')
      return unwrapData<Record<string, unknown>>(res)
    },
  })

  const displayName =
    pickProfileField(profileQuery.data, [
      'cus_name',
      'name',
      'CusName',
      'customer_name',
      'full_name',
    ]) ||
    [
      pickProfileField(profileQuery.data, ['THNAME']),
      pickProfileField(profileQuery.data, ['THSURN', 'thsurn']),
    ]
      .filter(Boolean)
      .join(' ')
      .trim()
  const phone = pickProfileField(profileQuery.data, [
    'phone',
    'tel',
    'mobile',
    'cus_tel',
    'TELNO',
    'telno',
    'CONTACTTELNO',
  ])
  const lineName = pickProfileField(profileQuery.data, [
    'line_display_name',
    'line_user_name',
    'lineUserName',
  ])
  const avatarUrl = pickProfileField(profileQuery.data, [
    'line_picture_url',
    'linePictureUrl',
    'line_user_profile',
    'lineUserProfile',
  ])

  const menuItems: ProfileMenuItem[] = [
    {
      id: 'setting',
      title: 'ตั้งค่า',
      icon: Settings,
      color: 'bg-gray-50 text-gray-600',
      path: '/settings',
    },
    {
      id: 'blog',
      title: 'ข่าวสาร/บทความ',
      icon: FileText,
      color: 'bg-blue-50 text-blue-600',
      path: '/blog',
    },
    {
      id: 'ticket',
      title: 'แจ้งปัญหา',
      icon: HelpCircle,
      color: 'bg-orange-50 text-orange-600',
      path: '/ticket',
    },
    {
      id: 'contact',
      title: 'ติดต่อบริษัท',
      icon: Phone,
      color: 'bg-green-50 text-green-600',
      path: '/contact',
    },
    {
      id: 'promotion',
      title: 'โปรโมชั่น',
      icon: Gift,
      color: 'bg-red-50 text-red-600',
      path: '/promotion',
    },
    {
      id: 'guide',
      title: 'วิธีใช้งาน',
      icon: BookOpen,
      color: 'bg-purple-50 text-purple-600',
      path: '/guide',
    },
    {
      id: 'coupon',
      title: 'คูปองส่วนลด',
      icon: Ticket,
      color: 'bg-yellow-50 text-yellow-600',
      path: '/coupon',
      disabled: true,
    },
  ]

  const handleMenuClick = (item: ProfileMenuItem) => {
    if (item.disabled) {
      toast.info('ฟีเจอร์นี้ยังไม่เปิดให้บริการ เร็วๆ นี้')
      return
    }
    navigate({ to: item.path })
  }

  const handleUnlinkLine = async () => {
    setUnlinkBusy(true)
    try {
      await unlinkCurrentLineDeviceFromApi()
      clearCustomerSession()
      queryClient.clear()
      toast.success(
        'ยกเลิกการเชื่อมต่อ LINE แล้ว',
        'สามารถลงทะเบียนอุปกรณ์ใหม่ได้หลังยืนยัน OTP'
      )
      await navigate({ to: '/sign-in', replace: true })
    } catch (e) {
      handleServerError(e)
      toast.error('ยกเลิกการเชื่อมต่อไม่สำเร็จ')
    } finally {
      setUnlinkBusy(false)
    }
  }

  const avatarFallback =
    (displayName || lineName || phone).trim().charAt(0) || 'ค'

  return (
    <MobileLayout>
      <MobileHeader title='โปรไฟล์' showMoreMenu={true} />

      <MobileContent className='pb-20'>
        <div className='space-y-6'>
          <MobileCard className='p-6'>
            {!hasSession ? (
              <p className='text-center text-sm text-gray-600 dark:text-gray-400'>
                เมื่อยืนยันตัวตนผ่าน LINE หรือ OTP แล้ว
                ระบบจะเชื่อมต่อและแสดงข้อมูลโปรไฟล์อัตโนมัติ
              </p>
            ) : profileQuery.isLoading ? (
              <div className='flex items-center space-x-4'>
                <Skeleton className='h-16 w-16 shrink-0 rounded-full' />
                <div className='flex-1 space-y-2'>
                  <Skeleton className='h-6 w-40' />
                  <Skeleton className='h-4 w-48' />
                  <Skeleton className='h-4 w-32' />
                </div>
              </div>
            ) : profileQuery.isError ? (
              <div className='py-4'>
                <ErrorState
                  title='ไม่สามารถโหลดข้อมูลโปรไฟล์ได้'
                  onRetry={() => void profileQuery.refetch()}
                />
              </div>
            ) : (
              <div className='flex items-center space-x-4'>
                <MobileAvatar
                  size='xl'
                  src={avatarUrl || undefined}
                  fallback={avatarFallback}
                  className='h-16 w-16 shrink-0'
                />
                <div className='min-w-0 flex-1'>
                  {displayName ? (
                    <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
                      {displayName}
                    </h2>
                  ) : (
                    <h2 className='text-lg font-medium text-gray-700 dark:text-gray-300'>
                      —
                    </h2>
                  )}
                  {lineName || avatarUrl ? (
                    <p className='mt-0.5 truncate text-sm text-[#06C755]'>
                      LINE: {lineName || '—'}
                    </p>
                  ) : null}
                  {phone ? (
                    <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                      {phone}
                    </p>
                  ) : (
                    <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                      ไม่มีเบอร์ในระบบ
                    </p>
                  )}
                </div>
              </div>
            )}
          </MobileCard>

          <div className='space-y-2'>
            {menuItems.map((item) => (
              <MobileButton
                key={item.id}
                variant='ghost'
                className={`h-auto w-full justify-between p-4 ${item.disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                onClick={() => handleMenuClick(item)}
              >
                <div className='flex w-full items-center space-x-4'>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${item.color} ${item.disabled ? 'grayscale' : ''}`}
                  >
                    <item.icon className='h-5 w-5' />
                  </div>
                  <div className='flex flex-col items-start'>
                    <span
                      className={`font-medium ${item.disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}
                    >
                      {item.title}
                    </span>
                    {item.disabled ? (
                      <span className='text-[10px] text-gray-400 dark:text-gray-500'>
                        เร็วๆ นี้
                      </span>
                    ) : null}
                  </div>
                  <ChevronRight
                    className={`ml-auto h-5 w-5 ${item.disabled ? 'text-gray-300 dark:text-gray-600' : 'text-gray-400 dark:text-gray-500'}`}
                  />
                </div>
              </MobileButton>
            ))}
          </div>

          {hasSession ? (
            <MobileButton
              variant='outline'
              className='h-12 w-full border-amber-200 text-amber-800 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-200 dark:hover:bg-amber-950/40'
              onClick={() => void handleUnlinkLine()}
              disabled={unlinkBusy}
            >
              <Link2Off className='mr-2 h-5 w-5' />
              {unlinkBusy
                ? 'กำลังดำเนินการ...'
                : 'ยกเลิกการเชื่อมต่อ LINE บนเครื่องนี้'}
            </MobileButton>
          ) : null}
        </div>
      </MobileContent>

      <BottomNavigation currentPath='/profile' />
    </MobileLayout>
  )
}
