import { useEffect, useReducer } from 'react'
import { NOTIFICATION_READ_EVENT } from '../notification-read-state'

/** ให้รายการแจ้งเตือน re-render เมื่อมีการทำเครื่องหมายว่าอ่านแล้ว */
export function useNotificationReadUpdates() {
  const [, bump] = useReducer((n: number) => n + 1, 0)
  useEffect(() => {
    const handler = () => bump()
    window.addEventListener(NOTIFICATION_READ_EVENT, handler)
    return () => window.removeEventListener(NOTIFICATION_READ_EVENT, handler)
  }, [])
}
