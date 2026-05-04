import type { Liff } from '@line/liff'
import { applyLiffStateDeepLinkAfterInit } from '@/lib/liff-state-deeplink'

/**
 * LINE LIFF — desktop / external browser
 * @see https://developers.line.biz/en/docs/liff/developing-liff-apps/#initializing-liff-app
 * @see https://developers.line.biz/en/docs/liff/developing-liff-apps/#to-use-line-login-in-an-external-browser
 *
 * ไม่ใช้ `withLoginOnExternalBrowser` คู่กับ `liff.login()` — ใน Chrome บางเคส init จบแล้วยังไม่ล็อกอิน แต่ SDK กำลังจะ redirect
 * ทำให้เรียก login ซ้ำแล้วพัง — ใช้ init แบบธรรมดาแล้วค่อย `liff.login({ redirectUri })` ครั้งเดียว
 *
 * React 19 StrictMode (dev) เรียก useEffect สองรอบ — กันไม่ให้ `liff.login()` ถูกเรียกซ้ำ
 */

let liffInitPromise: Promise<void> | null = null

/** กัน StrictMode / effect ซ้ำเรียก liff.login() สองครั้งก่อน redirect จริง */
let externalLoginRedirectDispatched = false

function isLocalDevelopmentOrigin(): boolean {
  if (typeof window === 'undefined') return false
  return ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)
}

function getLiffLoginRedirectUri(): string {
  if (typeof window === 'undefined') return ''
  const { origin, pathname, search } = window.location
  return `${origin}${pathname}${search}`
}

async function getLiff(): Promise<Liff> {
  const liffId = (import.meta.env.VITE_LIFF_ID as string | undefined)?.trim()
  if (!liffId) {
    throw new Error('missing VITE_LIFF_ID')
  }
  const liff = (await import('@line/liff')).default

  if (!liffInitPromise) {
    liffInitPromise = liff
      .init({
        liffId,
      })
      .catch((err: unknown) => {
        liffInitPromise = null
        throw err
      })
  }
  await liffInitPromise
  applyLiffStateDeepLinkAfterInit()
  return liff
}

export async function initializeLiffPrimaryRedirect(): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    await getLiff()
    return { ok: true }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'LIFF init failed'
    return { ok: false, message }
  }
}

export type LiffBootstrapPayload = { idToken?: string }

export type LiffBootstrapResult =
  | { tag: 'ok'; idToken: string }
  | { tag: 'line_redirect' }
  | { tag: 'missing' }
  | { tag: 'init_error'; message: string }

function scheduleExternalLogin(liff: Liff): void {
  if (externalLoginRedirectDispatched) return
  externalLoginRedirectDispatched = true

  const redirectUri = getLiffLoginRedirectUri()
  const run = () => {
    try {
      liff.login({ redirectUri })
    } catch {
      externalLoginRedirectDispatched = false
    }
  }
  /* ให้ init / microtask ของ SDK จบก่อน แล้วค่อย login — ลดโอกาสชนกับ router ตอนเริ่มระบบ */
  if (typeof queueMicrotask === 'function') {
    queueMicrotask(() => {
      window.setTimeout(run, 0)
    })
  } else {
    window.setTimeout(run, 0)
  }
}

/**
 * @returns false = กำลังไป LINE login (redirect)
 */
export async function ensureLiffLoggedIn(): Promise<boolean> {
  if (typeof window === 'undefined') return true
  const liffId = import.meta.env.VITE_LIFF_ID as string | undefined
  if (!liffId?.trim()) return true
  if (isLocalDevelopmentOrigin()) return true

  try {
    const liff = await getLiff()
    if (liff.isLoggedIn()) {
      externalLoginRedirectDispatched = false
      return true
    }

    const inLiffBrowser = typeof liff.isInClient === 'function' ? liff.isInClient() : false
    if (inLiffBrowser) {
      return true
    }

    scheduleExternalLogin(liff)
    return false
  } catch {
    return true
  }
}

export async function getLiffBootstrapResult(): Promise<LiffBootstrapResult> {
  if (typeof window === 'undefined') return { tag: 'missing' }
  const liffId = (import.meta.env.VITE_LIFF_ID as string | undefined)?.trim()
  if (!liffId) {
    return { tag: 'missing' }
  }

  try {
    const proceed = await ensureLiffLoggedIn()
    if (!proceed) return { tag: 'line_redirect' }

    const liff = await getLiff()
    if (!liff.isLoggedIn()) return { tag: 'missing' }

    const idToken = liff.getIDToken()
    if (!idToken?.trim()) return { tag: 'missing' }

    return { tag: 'ok', idToken }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { tag: 'init_error', message: msg }
  }
}

export async function getLiffBootstrapPayload(): Promise<LiffBootstrapPayload> {
  const r = await getLiffBootstrapResult()
  return r.tag === 'ok' ? { idToken: r.idToken } : {}
}

export async function getLiffIdTokenOrNull(): Promise<string | null> {
  const { idToken } = await getLiffIdTokenAndProfileForOtp()
  return idToken ?? null
}

export async function getLiffIdTokenAndProfileForOtp(): Promise<{
  idToken?: string
  displayName?: string
  pictureUrl?: string
}> {
  const liffId = import.meta.env.VITE_LIFF_ID as string | undefined
  if (!liffId?.trim()) return {}
  try {
    const proceed = await ensureLiffLoggedIn()
    if (!proceed) return {}

    const liff = await getLiff()
    if (!liff.isLoggedIn()) return {}
    const idToken = liff.getIDToken() ?? undefined
    let displayName: string | undefined
    let pictureUrl: string | undefined
    try {
      const p = await liff.getProfile()
      if (p.displayName?.trim()) displayName = p.displayName.trim()
      if (p.pictureUrl?.trim()) pictureUrl = p.pictureUrl.trim()
    } catch {
      /* บางสภาพแวดล้อมไม่มีสิทธิ์ profile */
    }
    return { idToken, displayName, pictureUrl }
  } catch {
    return {}
  }
}

export async function getLineUserIdForRegistration(): Promise<string> {
  const r = await getLiffBootstrapResult()
  if (r.tag === 'line_redirect') {
    throw new Error('กำลังไปล็อกอิน LINE — ลองอีกครั้งหลังกลับมาที่แอป')
  }
  if (r.tag === 'init_error') {
    throw new Error(r.message)
  }
  if (r.tag !== 'ok') {
    throw new Error('ต้องล็อกอิน LINE (LIFF) ก่อน')
  }
  const liff = await getLiff()
  const p = await liff.getProfile()
  return p.userId
}
