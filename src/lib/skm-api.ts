/**
 * 📌 Axios หลักสำหรับเรียก skm-easy-api-v2 — แนบ access token + ลอง refresh เมื่อ 401
 */
import axios, { isAxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { clearCustomerSession, setCustomerAccessToken, getCustomerRefreshToken } from '@/lib/customer-session'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1'

/** ngrok free อาจคืนหน้าเตือน HTML แทน JSON — ส่ง header นี้เพื่อข้ามและได้ response จริงของ API */
function isNgrokTunnelApiUrl(url: string): boolean {
  return /ngrok-free\.app|\.ngrok\.io|\.ngrok\.app/i.test(url)
}

const ngrokSkipHeaders =
  typeof baseURL === 'string' && isNgrokTunnelApiUrl(baseURL)
    ? ({ 'ngrok-skip-browser-warning': 'true' } as const)
    : undefined

export const skmApi = axios.create({ baseURL })

skmApi.interceptors.request.use((config) => {
  const t = localStorage.getItem('skm_access_token')
  if (t) {
    config.headers.Authorization = `Bearer ${t}`
  }
  if (ngrokSkipHeaders) {
    Object.assign(config.headers, ngrokSkipHeaders)
  }
  return config
})

type ApiEnvelope<T> = { success: true; data: T; message: string; meta?: Record<string, unknown> }

let refreshInFlight: Promise<string | null> | null = null

async function refreshCustomerAccess(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight
  const rt = getCustomerRefreshToken()
  if (!rt) return null
  refreshInFlight = (async () => {
    try {
      const res = await axios.post<ApiEnvelope<{ accessToken: string }>>(
        `${baseURL.replace(/\/$/, '')}/auth/customer/refresh`,
        { refreshToken: rt },
        { headers: ngrokSkipHeaders ? { ...ngrokSkipHeaders } : undefined },
      )
      const body = res.data as ApiEnvelope<{ accessToken: string }>
      if (!body.success || !body.data?.accessToken) return null
      setCustomerAccessToken(body.data.accessToken)
      return body.data.accessToken
    } catch {
      return null
    } finally {
      refreshInFlight = null
    }
  })()
  return refreshInFlight
}

type RetryCfg = InternalAxiosRequestConfig & { _skmRetry?: boolean }

skmApi.interceptors.response.use(
  (r) => r,
  async (error: unknown) => {
    const err = error as { response?: { status?: number }; config?: RetryCfg }
    const status = err.response?.status
    const cfg = err.config
    if (status !== 401 || !cfg || cfg._skmRetry) return Promise.reject(error)
    const url = String(cfg.url ?? '')
    if (url.includes('/auth/customer/refresh') || url.includes('/auth/customer/otp/')) {
      return Promise.reject(error)
    }
    const newAccess = await refreshCustomerAccess()
    if (!newAccess) {
      clearCustomerSession()
      if (typeof window !== 'undefined') {
        const p = window.location.pathname
        const onPublicAuthFlow =
          p.startsWith('/sign-in') || p.startsWith('/otp') || p.startsWith('/contact-support')
        if (!onPublicAuthFlow) window.location.assign('/sign-in')
      }
      return Promise.reject(error)
    }
    cfg._skmRetry = true
    cfg.headers.Authorization = `Bearer ${newAccess}`
    return skmApi(cfg)
  },
)

export function unwrapData<T>(res: AxiosResponse<ApiEnvelope<T> | { success: false }>): T {
  const body = res.data as ApiEnvelope<T>
  if (!(body as ApiEnvelope<T>).success) {
    throw new Error('คำขอ API ไม่สำเร็จ')
  }
  return body.data
}

/** ดึงข้อความจาก envelope `{ success: false, error: { message } }` ของ API */
export function getSkmApiErrorMessage(err: unknown): string {
  if (!isAxiosError(err)) return 'เกิดข้อผิดพลาด'
  const d = err.response?.data as { error?: { message?: string }; message?: string } | undefined
  const msg = d?.error?.message ?? d?.message
  if (typeof msg === 'string' && msg.trim()) return msg.trim()
  if (err.message?.trim()) return err.message.trim()
  return 'เกิดข้อผิดพลาด'
}
