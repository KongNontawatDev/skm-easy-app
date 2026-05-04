/**
 * Refinance API Service — placeholder for production
 * รีไฟแนนซ์ยังไม่มี API จริง — แสดง "เร็วๆ นี้" ใน UI
 */
import type {
  RefinanceVehicle,
  RefinanceCheckRequest,
  RefinanceCheckResponse,
  CreditCheckForm,
  CreditCheckResponse,
  CreditCheckResult
} from '../types'

export class RefinanceApiService {
  static async getRefinanceVehicles(): Promise<RefinanceVehicle[]> {
    return [] as unknown as RefinanceVehicle[]
  }

  static async getRefinanceVehicle(_vehicleId: string): Promise<RefinanceVehicle> {
    throw new Error('ฟีเจอร์รีไฟแนนซ์ยังไม่เปิดให้บริการ')
  }

  static async checkRefinanceEligibility(_request: RefinanceCheckRequest): Promise<RefinanceCheckResponse> {
    throw new Error('ฟีเจอร์รีไฟแนนซ์ยังไม่เปิดให้บริการ')
  }

  static async submitCreditCheck(_form: CreditCheckForm): Promise<CreditCheckResponse> {
    throw new Error('ฟีเจอร์ตรวจสอบเครดิตยังไม่เปิดให้บริการ')
  }

  static async getCreditCheckResults(): Promise<CreditCheckResult[]> {
    return [] as unknown as CreditCheckResult[]
  }

  static async getCreditCheckResult(_resultId: string): Promise<CreditCheckResult> {
    throw new Error('ฟีเจอร์ตรวจสอบเครดิตยังไม่เปิดให้บริการ')
  }

  static async updateCreditCheckStatus(_resultId: string, _status: 'approved' | 'rejected', _notes?: string): Promise<CreditCheckResult> {
    throw new Error('ฟีเจอร์ตรวจสอบเครดิตยังไม่เปิดให้บริการ')
  }
}
