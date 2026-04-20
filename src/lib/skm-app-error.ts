/** เก็บข้อความแสดงบนหน้า `/app-error` (หลัง redirect จาก bootstrap ฯลฯ) */
export const SKM_APP_ERROR_STORAGE_KEY = 'skm_app_error_payload'

export interface SkmAppErrorPayload {
  title: string
  detail?: string
}

export function setSkmAppErrorPayload(payload: SkmAppErrorPayload): void {
  if (typeof sessionStorage === 'undefined') return
  try {
    sessionStorage.setItem(SKM_APP_ERROR_STORAGE_KEY, JSON.stringify(payload))
  } catch {
    /* ignore quota / private mode */
  }
}

export function consumeSkmAppErrorPayload(): SkmAppErrorPayload | null {
  if (typeof sessionStorage === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(SKM_APP_ERROR_STORAGE_KEY)
    sessionStorage.removeItem(SKM_APP_ERROR_STORAGE_KEY)
    if (!raw) return null
    const o = JSON.parse(raw) as unknown
    if (!o || typeof o !== 'object') return null
    const title = (o as { title?: unknown }).title
    if (typeof title !== 'string' || !title.trim()) return null
    const detail = (o as { detail?: unknown }).detail
    return {
      title: title.trim(),
      detail: typeof detail === 'string' && detail.trim() ? detail.trim() : undefined,
    }
  } catch {
    return null
  }
}
