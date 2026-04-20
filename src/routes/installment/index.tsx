import { createFileRoute } from '@tanstack/react-router'
import { Installment } from '@/features/installment'

export const Route = createFileRoute('/installment/')({
  validateSearch: (search: Record<string, unknown>) => ({
    contractId:
      typeof search.contractId === 'string' && search.contractId.trim()
        ? search.contractId.trim()
        : undefined,
  }),
  component: InstallmentRoute,
})

function InstallmentRoute() {
  const { contractId } = Route.useSearch()
  return <Installment contractIdFromSearch={contractId} />
}