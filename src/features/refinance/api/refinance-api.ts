import { MockApiService } from '@/lib/mock-api'
import type { 
  RefinanceVehicle, 
  RefinanceCheckRequest, 
  RefinanceCheckResponse,
  CreditCheckForm,
  CreditCheckResponse,
  CreditCheckResult
} from '../types'

export class RefinanceApiService {
  // Get all refinance eligible vehicles
  static async getRefinanceVehicles(): Promise<RefinanceVehicle[]> {
    return MockApiService.get<RefinanceVehicle[]>('/refinance/vehicles')
  }

  // Get specific vehicle for refinance
  static async getRefinanceVehicle(vehicleId: string): Promise<RefinanceVehicle> {
    return MockApiService.get<RefinanceVehicle>(`/refinance/vehicles/${vehicleId}`)
  }

  // Check refinance eligibility
  static async checkRefinanceEligibility(request: RefinanceCheckRequest): Promise<RefinanceCheckResponse> {
    return MockApiService.post<RefinanceCheckResponse>('/refinance/check', request)
  }

  // Submit credit check form
  static async submitCreditCheck(form: CreditCheckForm): Promise<CreditCheckResponse> {
    return MockApiService.post<CreditCheckResponse>('/credit-check/submit', form)
  }

  // Get credit check results
  static async getCreditCheckResults(): Promise<CreditCheckResult[]> {
    return MockApiService.get<CreditCheckResult[]>('/credit-check/results')
  }

  // Get specific credit check result
  static async getCreditCheckResult(resultId: string): Promise<CreditCheckResult> {
    return MockApiService.get<CreditCheckResult>(`/credit-check/results/${resultId}`)
  }

  // Update credit check result status
  static async updateCreditCheckStatus(resultId: string, status: 'approved' | 'rejected', notes?: string): Promise<CreditCheckResult> {
    return MockApiService.patch<CreditCheckResult>(`/credit-check/results/${resultId}`, { status, notes })
  }
}
