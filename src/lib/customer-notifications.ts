import { skmApi, unwrapData } from '@/lib/skm-api'
import { mapCustomerNotificationRow } from '@/lib/notification-api-map'
import { hasCustomerSession } from '@/lib/customer-session'
import type { Notification } from '@/features/notification/types'

export async function fetchCustomerNotifications(): Promise<Notification[]> {
  const res = await skmApi.get('/notifications', { params: { page: 1, limit: 100 } })
  const body = unwrapData<{ items: Record<string, unknown>[] }>(res)
  return body.items.map(mapCustomerNotificationRow)
}

/** แจ้งเซิร์ฟเวอร์ว่าอ่านแล้ว — ไม่ throw ถ้าไม่มีโทเคน */
export function markCustomerNotificationReadOnServer(id: string): void {
  if (!hasCustomerSession()) return
  void skmApi.patch(`/notifications/${encodeURIComponent(id)}/read`).catch(() => {
    /* ignore — อ่านฝั่ง client ยังทำงาน */
  })
}
