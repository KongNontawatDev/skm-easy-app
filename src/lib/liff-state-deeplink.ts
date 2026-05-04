const PENDING_LIFF_STATE_KEY = 'skm.pendingLiffStateDeepLink'
export const LIFF_STATE_DEEPLINK_READY = 'skm:liff-state-deeplink-ready'

function normalizeLiffStatePath(rawState: string | null): string | null {
  if (!rawState) return null
  const trimmed = rawState.trim()
  if (!trimmed) return null

  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  if (path.startsWith('//') || path.includes('\\')) return null

  try {
    const url = new URL(path, window.location.origin)
    if (url.origin !== window.location.origin) return null
    return `${url.pathname}${url.search}${url.hash}` || '/'
  } catch {
    return null
  }
}

function setPendingLiffStateDeepLink(target: string) {
  window.sessionStorage.setItem(PENDING_LIFF_STATE_KEY, target)
}

export function getPendingLiffStateDeepLink(): string | null {
  if (typeof window === 'undefined') return null
  const target = window.sessionStorage.getItem(PENDING_LIFF_STATE_KEY)
  return normalizeLiffStatePath(target)
}

export function clearPendingLiffStateDeepLink() {
  if (typeof window === 'undefined') return
  window.sessionStorage.removeItem(PENDING_LIFF_STATE_KEY)
}

export function consumePendingLiffStateDeepLink(): string | null {
  const target = getPendingLiffStateDeepLink()
  if (target) clearPendingLiffStateDeepLink()
  return target
}

export function captureLiffStateDeepLinkFromLocation(): string | null {
  if (typeof window === 'undefined') return null
  const url = new URL(window.location.href)
  const target = normalizeLiffStatePath(url.searchParams.get('liff.state'))
  if (!target) return null

  setPendingLiffStateDeepLink(target)
  return target
}

export function applyLiffStateDeepLinkAfterInit() {
  if (typeof window === 'undefined') return

  const target = captureLiffStateDeepLinkFromLocation() ?? getPendingLiffStateDeepLink()
  if (!target) return

  const url = new URL(window.location.href)
  const current = `${url.pathname}${url.search}${url.hash}`
  if (current !== target) {
    window.history.replaceState(window.history.state, '', target)
  }
  window.dispatchEvent(new CustomEvent(LIFF_STATE_DEEPLINK_READY, { detail: { target } }))
}
