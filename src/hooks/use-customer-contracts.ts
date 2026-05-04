import { useQuery } from '@tanstack/react-query'
import { skmApi, unwrapData } from '@/lib/skm-api'
import { mapLegacyContractRow } from '@/lib/legacy-contract-mapper'
import { hasCustomerSession } from '@/lib/customer-session'
import type { ContractCard } from '@/features/home/types'

export function useCustomerToken(): boolean {
  return hasCustomerSession()
}

/** รายการสัญญา — แชร์ queryKey กับหน้าแรก (`me-contracts`) */
export function useCustomerContracts() {
  const hasToken = useCustomerToken()
  return useQuery({
    queryKey: ['me-contracts'],
    enabled: hasToken,
    queryFn: async (): Promise<ContractCard[]> => {
      const res = await skmApi.get('/me/contracts')
      const rows = unwrapData<Record<string, unknown>[]>(res)
      return rows.map(mapLegacyContractRow)
    },
  })
}
