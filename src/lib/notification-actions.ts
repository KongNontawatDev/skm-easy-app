type NavigateLike = (opts: { to: string }) => unknown

export function openNotificationAction(url: string, navigate: NavigateLike): void {
  const target = url.trim()
  if (!target) return

  if (/^https?:\/\//i.test(target)) {
    window.location.assign(target)
    return
  }

  if (target.startsWith('/')) {
    navigate({ to: target })
    return
  }

  navigate({ to: `/${target}` })
}
