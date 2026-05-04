import { useEffect, useMemo, useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { LoaderCircle } from 'lucide-react'
import { initializeLiffPrimaryRedirect } from '@/lib/liff-client'
import {
  captureLiffStateDeepLinkFromLocation,
  getPendingLiffStateDeepLink,
} from '@/lib/liff-state-deeplink'

export const Route = createFileRoute('/liff-callback')({
  component: LiffCallbackRoute,
})

function isLocalDevelopmentOrigin(): boolean {
  if (typeof window === 'undefined') return false
  return ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)
}

function LiffCallbackRoute() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const initialTarget = useMemo(() => captureLiffStateDeepLinkFromLocation(), [])

  useEffect(() => {
    let cancelled = false

    void (async () => {
      const target = getPendingLiffStateDeepLink() ?? initialTarget ?? '/'
      if (isLocalDevelopmentOrigin()) {
        await router.navigate({ to: target, replace: true } as never)
        return
      }

      const result = await initializeLiffPrimaryRedirect()
      if (cancelled) return

      if (result.ok || isLocalDevelopmentOrigin()) {
        await router.navigate({ to: target, replace: true } as never)
        return
      }

      setError(result.message)
      window.setTimeout(() => {
        void router.navigate({ to: getPendingLiffStateDeepLink() ?? '/sign-in', replace: true } as never)
      }, 1200)
    })()

    return () => {
      cancelled = true
    }
  }, [initialTarget, router])

  return (
    <main className='grid min-h-dvh place-items-center bg-background px-6'>
      <div className='flex flex-col items-center gap-4 text-center'>
        <LoaderCircle className='size-9 animate-spin text-primary' aria-hidden='true' />
        {error ? (
          <p className='max-w-xs text-sm text-muted-foreground'>{error}</p>
        ) : (
          <div className='h-1 w-44 overflow-hidden rounded-full bg-muted'>
            <div className='h-full w-2/3 animate-pulse rounded-full bg-primary' />
          </div>
        )}
      </div>
    </main>
  )
}
