const STORAGE_KEY = 'skm-notifications-marked-read'
export const NOTIFICATION_READ_EVENT = 'skm-notifications-read-updated'

function loadIds(): Set<string> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const arr = JSON.parse(raw) as unknown
    return new Set(Array.isArray(arr) ? arr : [])
  } catch {
    return new Set()
  }
}

function saveIds(ids: Set<string>) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
}

function emit() {
  window.dispatchEvent(new CustomEvent(NOTIFICATION_READ_EVENT))
}

export function markNotificationAsRead(id: string) {
  const s = loadIds()
  if (s.has(id)) return
  s.add(id)
  saveIds(s)
  emit()
}

export function markAllNotificationsAsRead(ids: string[]) {
  const s = loadIds()
  let changed = false
  for (const id of ids) {
    if (!s.has(id)) {
      s.add(id)
      changed = true
    }
  }
  if (changed) {
    saveIds(s)
    emit()
  }
}

export function isNotificationEffectivelyRead(notification: {
  id: string
  isRead: boolean
}): boolean {
  if (notification.isRead) return true
  return loadIds().has(notification.id)
}
