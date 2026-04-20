import { useApiQueryList, useApiQuery } from '@/hooks/useApiQuery'
import { RefinanceApiService } from '../api/refinance-api'
// Hook for getting all refinance vehicles
export function useRefinanceVehicles() {
  return useApiQueryList(
    'refinance-vehicles',
    undefined,
    () => RefinanceApiService.getRefinanceVehicles()
  )
}

// Hook for getting specific refinance vehicle
export function useRefinanceVehicle(vehicleId: string) {
  return useApiQuery(
    ['refinance-vehicle', vehicleId],
    () => RefinanceApiService.getRefinanceVehicle(vehicleId),
    {
      enabled: !!vehicleId
    }
  )
}

// Hook for getting credit check results
export function useCreditCheckResults() {
  return useApiQueryList(
    'credit-check-results',
    undefined,
    () => RefinanceApiService.getCreditCheckResults()
  )
}

// Hook for getting specific credit check result
export function useCreditCheckResult(resultId: string) {
  return useApiQuery(
    ['credit-check-result', resultId],
    () => RefinanceApiService.getCreditCheckResult(resultId),
    {
      enabled: !!resultId
    }
  )
}
