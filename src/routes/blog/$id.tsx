import { createFileRoute } from '@tanstack/react-router'
import { BlogDetail } from '@/features/blog'

export const Route = createFileRoute('/blog/$id')({
  component: () => <BlogDetail />,
})