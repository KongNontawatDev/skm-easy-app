import { useApiMutation } from '@/hooks/useApiMutation'
import { RefinanceApiService } from '../api/refinance-api'
import type {
  RefinanceCheckRequest,
  RefinanceCheckResponse,
  CreditCheckForm,
  CreditCheckResponse,
  CreditCheckResult,
} from '../types'

export function useRefinanceCheck() {
  return useApiMutation<RefinanceCheckResponse, RefinanceCheckRequest>(
    (data) => RefinanceApiService.checkRefinanceEligibility(data),
    {},
  )
}

export function useCreditCheckSubmit() {
  return useApiMutation<CreditCheckResponse, CreditCheckForm>(
    (data) => RefinanceApiService.submitCreditCheck(data),
    {},
  )
}

export function useCreditCheckStatusUpdate() {
  return useApiMutation<CreditCheckResult, { resultId: string; status: 'approved' | 'rejected'; notes?: string }>(
    ({ resultId, status, notes }) => RefinanceApiService.updateCreditCheckStatus(resultId, status, notes),
    {},
  )
}
