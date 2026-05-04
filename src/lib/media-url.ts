/**
 * แปลง path รูปจาก API ให้เป็น URL ที่ `<img src>` โหลดได้
 *
 * - `VITE_API_BASE_URL` เป็น URL เต็ม → ใช้ origin ของมัน
 * - เป็น path (เช่น `/api/v1`) → ใช้ origin ของหน้าเว็บ (แนะนำตั้ง Vite proxy `/api` → API)
 * - แอปกับ API คนละโดเมนใน production → ตั้ง `VITE_API_PUBLIC_ORIGIN`
 */
function apiOriginForAssets(): string {
  const publicOrigin = import.meta.env.VITE_API_PUBLIC_ORIGIN as string | undefined
  if (publicOrigin?.trim() && /^https?:\/\//i.test(publicOrigin.trim())) {
    return publicOrigin.trim().replace(/\/$/, '')
  }
  const base = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1'
  if (/^https?:\/\//i.test(base)) {
    try {
      return new URL(base).origin
    } catch {
      /* fall through */
    }
  }
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return 'http://127.0.0.1:3000'
}

/** แปลง path รูปจาก API ให้เป็น URL เต็มเมื่อแอปรันคนละ origin กับ API */
export function resolveMediaUrl(stored: string | null | undefined): string {
  if (!stored) return ''
  if (stored.startsWith('http://') || stored.startsWith('https://')) return stored
  const path = stored.startsWith('/') ? stored : `/${stored}`
  return `${apiOriginForAssets()}${path}`
}
