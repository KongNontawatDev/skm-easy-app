import { createFileRoute } from '@tanstack/react-router'
import { ContractDetail } from '@/features/installment/contract-detail'

export const Route = createFileRoute('/installment/contract/$id')({
  component: () => <ContractDetail />,
})
