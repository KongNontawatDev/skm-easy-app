import { createFileRoute } from '@tanstack/react-router'
import { Error500Page } from '@/features/errors/error-500-page'

export const Route = createFileRoute('/500')({
  component: Error500Page,
})
