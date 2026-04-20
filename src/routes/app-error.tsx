import { createFileRoute } from '@tanstack/react-router'
import { AppErrorPage } from '@/features/errors/app-error-page'

export const Route = createFileRoute('/app-error')({
  component: AppErrorPage,
})
