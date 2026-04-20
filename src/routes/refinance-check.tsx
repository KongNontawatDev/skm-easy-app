import { createFileRoute } from '@tanstack/react-router'
import { RefinanceCheckPage } from '@/features/refinance'

export const Route = createFileRoute('/refinance-check')({
  component: RefinanceCheckPage,
})
