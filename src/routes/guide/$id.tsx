import { createFileRoute } from '@tanstack/react-router'
import { GuideDetail } from '@/features/guide'

export const Route = createFileRoute('/guide/$id')({
  component: () => <GuideDetail />,
})