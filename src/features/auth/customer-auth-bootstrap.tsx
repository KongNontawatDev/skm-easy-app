/**
 * เมื่อเปิดแอป: ใช้ JWT ใน localStorage ก่อน (ไม่เรียก LIFF/API ถ้า access ยังไม่หมด)
 * → ถ้า access หมดแต่มี refresh ให้ต่ออายุ access
 * → ถ้าไม่มีเซสชันและอยู่นอกหน้าลงทะเบียน ให้ LIFF bootstrap ตรวจ line_user_id
 */
import { useEffect, useState } from 'react'
import type { QueryClient } from '@tanstack/react-query'
import { useRouter, useRouterState, useRouteContext } from '@tanstack/react-router'
import axios from 'axios'
import {
  clearCustomerSession,
  CUSTOMER_SESSION_CHANGED,
  getCustomerAccessTokenExpiresAtMs,
  getCustomerRefreshToken,
  isCustomerAccessTokenValid,
  setCustomerAccessToken,
  setCustomerTokens,
} from '@/lib/customer-session'
import { ensureLiffLoggedIn, getLiffBootstrapResult } from '@/lib/liff-client'
import { setSkmAppErrorPayload } from '@/lib/skm-app-error'
import { getSkmApiErrorMessage } from '@/lib/skm-api'

const UNAUTH_PATH_PREFIXES = ['/sign-in', '/otp', '/contact-support', '/app-error']

function isUnauthPath(pathname: string): boolean {
  return UNAUTH_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

let authEnsureChain: Promise<void> = Promise.resolve()

async function runCustomerAuthEnsure(
  router: ReturnType<typeof useRouter>,
  pathname: string,
  queryClient: QueryClient | undefined,
) {
  try {
    if (isCustomerAccessTokenValid()) return

    const refresh = getCustomerRefreshToken()
    const base = import.meta.env.VITE_API_BASE_URL ?? 'http://i2c20wv92gd8pqui6lxq7qq2.204.168.204.48.sslip.io/api/v1'
    const root = base.replace(/\/$/, '')

    if (refresh) {
      try {
        const res = await axios.post<{ success: boolean; data: { accessToken: string } }>(
          `${root}/auth/customer/refresh`,
          { refreshToken: refresh },
        )
        if (res.data?.success && res.data.data?.accessToken) {
          setCustomerAccessToken(res.data.data.accessToken)
          return
        }
      } catch {
        clearCustomerSession()
      }
    }

    if (pathname === '/sign-in' || pathname === '/otp') {
      await ensureLiffLoggedIn()
    }

    if (isUnauthPath(pathname)) return

    const liffResult = await getLiffBootstrapResult()
    if (liffResult.tag === 'line_redirect') {
      /* กำลัง redirect ไป LINE login — ห้าม router.navigate แย่ง (จะทำให้ liff.login ไม่ทำงาน) */
      return
    }
    if (liffResult.tag === 'init_error') {
      if (!isUnauthPath(pathname)) {
        setSkmAppErrorPayload({
          title: 'เริ่มต้น LINE LIFF ไม่สำเร็จ',
          detail:
            liffResult.message ||
            'ตรวจสอบ VITE_LIFF_ID, Endpoint URL ใน LINE Console ให้ตรงกับ URL ที่เปิด (รวม https และ path)',
        })
        await router.navigate({ to: '/app-error', replace: true })
      }
      return
    }
    if (liffResult.tag !== 'ok') {
      if (!isUnauthPath(pathname)) {
        await router.navigate({ to: '/sign-in', replace: true })
      }
      return
    }

    const body = { idToken: liffResult.idToken }
    const res = await axios.post<{ success: boolean; data: unknown }>(
      `${root}/auth/customer/liff/bootstrap`,
      body,
    )
    const data = res.data?.data as
      | { status: 'session'; accessToken: string; refreshToken: string }
      | { status: 'needs_registration'; lineUserId: string }
      | undefined

    if (!res.data?.success || !data) return

    if (data.status === 'session') {
      setCustomerTokens(data.accessToken, data.refreshToken)
      void queryClient?.invalidateQueries({ queryKey: ['me-profile'] })
      void queryClient?.invalidateQueries({ queryKey: ['me-contracts'] })
      if (pathname === '/sign-in') {
        await router.navigate({ to: '/', replace: true })
      }
      return
    }

    if (data.status === 'needs_registration' && !isUnauthPath(pathname)) {
      await router.navigate({ to: '/sign-in', replace: true })
    }
  } catch (e: unknown) {
    if (isUnauthPath(pathname)) return
    const detail = getSkmApiErrorMessage(e)
    setSkmAppErrorPayload({
      title: 'เชื่อมต่อระบบลูกค้าไม่สำเร็จ',
      detail: detail ?? 'กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตหรือลองใหม่ภายหลัง',
    })
    await router.navigate({ to: '/app-error', replace: true })
  }
}

function scheduleCustomerAuthEnsure(
  router: ReturnType<typeof useRouter>,
  pathname: string,
  queryClient: QueryClient | undefined,
) {
  authEnsureChain = authEnsureChain
    .then(() => runCustomerAuthEnsure(router, pathname, queryClient))
    .catch(() => undefined)
  return authEnsureChain
}

/** ต่ออายุ access ล่วงหน้า (ลดโอกาสขึ้น OTP ซ้ำ) */
function CustomerAccessRefreshTicker() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const on = () => setTick((n) => n + 1)
    window.addEventListener(CUSTOMER_SESSION_CHANGED, on)
    return () => window.removeEventListener(CUSTOMER_SESSION_CHANGED, on)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!getCustomerRefreshToken()) return
    if (isUnauthPath(pathname)) return

    const expMs = getCustomerAccessTokenExpiresAtMs()
    if (!expMs) return

    const leadMs = 3 * 60 * 1000
    const delay = Math.max(8_000, expMs - Date.now() - leadMs)
    const id = window.setTimeout(() => {
      void (async () => {
        if (isCustomerAccessTokenValid()) return
        const rt = getCustomerRefreshToken()
        if (!rt) return
        const base = import.meta.env.VITE_API_BASE_URL ?? 'http://i2c20wv92gd8pqui6lxq7qq2.204.168.204.48.sslip.io/api/v1'
        const root = base.replace(/\/$/, '')
        try {
          const res = await axios.post<{ success: boolean; data: { accessToken: string } }>(
            `${root}/auth/customer/refresh`,
            { refreshToken: rt },
          )
          if (res.data?.success && res.data.data?.accessToken) {
            setCustomerAccessToken(res.data.data.accessToken)
          }
        } catch {
          /* ให้ interceptor จัดการเมื่อมีการเรียก API จริง */
        }
      })()
    }, delay)
    return () => window.clearTimeout(id)
  }, [pathname, tick])

  return null
}

export function CustomerAuthBootstrap() {
  const router = useRouter()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const { queryClient } = useRouteContext({ from: '__root__' })

  useEffect(() => {
    void scheduleCustomerAuthEnsure(router, pathname, queryClient)
  }, [router, pathname, queryClient])

  useEffect(() => {
    const onSession = () => {
      void scheduleCustomerAuthEnsure(router, window.location.pathname, queryClient)
    }
    window.addEventListener(CUSTOMER_SESSION_CHANGED, onSession)
    return () => window.removeEventListener(CUSTOMER_SESSION_CHANGED, onSession)
  }, [router, queryClient])

  return <CustomerAccessRefreshTicker />
}
