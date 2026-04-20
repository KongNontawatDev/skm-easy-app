import { Bell, DollarSign, Gift, Settings, Clock, AlertTriangle, ArrowRight } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import type { Notification } from '../types'
import { markNotificationAsRead } from '../notification-read-state'
import { markCustomerNotificationReadOnServer } from '@/lib/customer-notifications'

interface NotificationCardProps {
  notification: Notification
  isRead: boolean
}

export function NotificationCard({ notification, isRead }: NotificationCardProps) {
  const navigate = useNavigate()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return 'วันนี้'
    } else if (diffDays === 1) {
      return 'เมื่อวาน'
    } else if (diffDays < 7) {
      return `${diffDays} วันที่แล้ว`
    } else {
      return date.toLocaleDateString('th-TH', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <DollarSign className="w-5 h-5" />
      case 'promotion':
        return <Gift className="w-5 h-5" />
      case 'system':
        return <Settings className="w-5 h-5" />
      case 'reminder':
        return <Clock className="w-5 h-5" />
      case 'alert':
        return <AlertTriangle className="w-5 h-5" />
      default:
        return <Bell className="w-5 h-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payment':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-950/50 dark:text-blue-400'
      case 'promotion':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-950/50 dark:text-purple-400'
      case 'system':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400'
      case 'reminder':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-950/50 dark:text-yellow-400'
      case 'alert':
        return 'text-red-600 bg-red-100 dark:bg-red-950/50 dark:text-red-400'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <Link
        to="/notification/$id"
        params={{ id: notification.id }}
        onClick={() => {
          markNotificationAsRead(notification.id)
          markCustomerNotificationReadOnServer(notification.id)
        }}
        aria-label={
          !isRead ? `${notification.title} (ยังไม่อ่าน)` : notification.title
        }
        className="block p-4 transition-colors active:bg-gray-50 dark:active:bg-gray-700/50"
      >
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${getTypeColor(notification.type)}`}
          >
            {getTypeIcon(notification.type)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="line-clamp-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                {notification.title}
              </h3>
              {!isRead && (
                <span
                  className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-red-500"
                  aria-hidden
                />
              )}
            </div>

            <p className="mb-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
              {notification.message}
            </p>

            <span className="text-xs text-gray-500 dark:text-gray-500">
              {formatDate(notification.createdAt)}
            </span>
          </div>
        </div>
      </Link>

      {notification.actionUrl && notification.actionText && (
        <div className="border-t border-gray-100 dark:border-gray-700">
          <button
            type="button"
            aria-label={`${notification.actionText} — ${notification.title}`}
            className="flex w-full items-center justify-end gap-1 px-4 py-2.5 text-xs font-medium text-[#EC1B2E] transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
            onClick={() => {
              markNotificationAsRead(notification.id)
              markCustomerNotificationReadOnServer(notification.id)
              navigate({ to: notification.actionUrl! })
            }}
          >
            <span>{notification.actionText}</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  )
}
