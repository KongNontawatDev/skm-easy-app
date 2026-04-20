import { createFileRoute, Outlet } from '@tanstack/react-router'

/** layout สำหรับ `/promotion` — ลูกคือ `promotion/index.tsx` และ `promotion/$id.tsx` */
export const Route = createFileRoute('/promotion')({
  component: () => <Outlet />,
})
