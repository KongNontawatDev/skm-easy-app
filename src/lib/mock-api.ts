import { type ApiResponse, type PaginatedResponse, HttpStatus, type QueryParams } from './api-types'

// Mock API delay simulation
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock API Base URL
export const MOCK_API_BASE_URL = '/api/mock'

// Mock API Service
export class MockApiService {
  private static async simulateRequest<T>(
    data: T,
    message: string = 'Success',
    statusCode: HttpStatus = HttpStatus.OK,
    pagination?: ApiResponse<unknown>['pagination']
  ): Promise<ApiResponse<T>> {
    // Simulate network delay
    await delay(Math.random() * 500 + 200)
    
    // Simulate occasional errors (5% chance)
    if (Math.random() < 0.05) {
      throw new Error('Network error')
    }

    return {
      success: statusCode < 400,
      message,
      data,
      statusCode,
      pagination
    }
  }

  // Generic GET request
  static async get<T>(
    endpoint: string,
    params?: QueryParams
  ): Promise<ApiResponse<T>> {
    const mockData = await this.getMockData<T>(endpoint, params)
    return this.simulateRequest(mockData, 'Data retrieved successfully')
  }

  // Generic POST request
  static async post<T>(
    endpoint: string,
    data: unknown
  ): Promise<ApiResponse<T>> {
    const mockData = await this.createMockData<T>(endpoint, data)
    return this.simulateRequest(mockData, 'Data created successfully', HttpStatus.CREATED)
  }

  // Generic PUT request
  static async put<T>(
    endpoint: string,
    data: unknown
  ): Promise<ApiResponse<T>> {
    const mockData = await this.updateMockData<T>(endpoint, data)
    return this.simulateRequest(mockData, 'Data updated successfully')
  }

  // Generic PATCH request
  static async patch<T>(
    endpoint: string,
    data: unknown
  ): Promise<ApiResponse<T>> {
    const mockData = await this.updateMockData<T>(endpoint, data)
    return this.simulateRequest(mockData, 'Data updated successfully')
  }

  // Generic DELETE request
  static async delete<T>(
    endpoint: string
  ): Promise<ApiResponse<T>> {
    await this.deleteMockData(endpoint)
    return this.simulateRequest({} as T, 'Data deleted successfully')
  }

  // Mock data retrieval based on endpoint
  private static async getMockData<T>(endpoint: string, _params?: QueryParams): Promise<T> {
    // Import mock data dynamically based on endpoint
    if (endpoint.includes('/refinance/vehicles')) {
      const { mockRefinanceVehicles } = await import('@/features/refinance/data/mock-data')
      return mockRefinanceVehicles as T
    }
    
    if (endpoint.includes('/credit-check/results')) {
      const { mockCreditCheckResults } = await import('@/features/refinance/data/mock-data')
      return mockCreditCheckResults as T
    }
    
    // For other endpoints, return empty object as placeholder
    return {} as T
  }

  // Mock data creation
  private static async createMockData<T>(endpoint: string, data: unknown): Promise<T> {
    // Generate ID and timestamps
    const newData = {
      ...(typeof data === 'object' && data !== null ? data : {}),
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Handle specific endpoints
    if (endpoint.includes('/refinance/check')) {
      // Mock refinance check response
      return {
        success: true,
        data: {
          id: this.generateId(),
          brand: 'Honda',
          model: 'Wave 125',
          year: 2020,
          color: 'แดง',
          plateNumber: 'กข-1234 กรุงเทพฯ',
          condition: 'excellent',
          estimatedValue: 45000,
          refinanceAmount: 30000,
          monthlyPayment: 2500,
          interestRate: 2.5,
          termMonths: 12,
          eligibility: {
            isEligible: true,
            score: 85,
            reasons: ['รถอายุไม่เกิน 5 ปี', 'สภาพรถดี', 'เอกสารครบถ้วน'],
            requirements: ['บัตรประชาชน', 'ใบขับขี่', 'ทะเบียนรถ', 'ประกันภัย']
          },
          requirements: ['บัตรประชาชน', 'ใบขับขี่', 'ทะเบียนรถ', 'ประกันภัย']
        },
        message: 'ตรวจสอบการรีไฟแนนสำเร็จ'
      } as T
    }

    if (endpoint.includes('/credit-check/submit')) {
      // Mock credit check response
      return {
        success: true,
        data: {
          creditScore: Math.floor(Math.random() * 300) + 500, // 500-800
          eligibility: Math.random() > 0.3, // 70% chance of approval
          approvedAmount: Math.floor(Math.random() * 50000) + 20000, // 20k-70k
          interestRate: Math.random() * 2 + 2, // 2-4%
          monthlyPayment: Math.floor(Math.random() * 3000) + 2000, // 2k-5k
          termMonths: 12,
          requirements: ['บัตรประชาชน', 'ใบขับขี่', 'หลักฐานรายได้', 'บัญชีธนาคาร'],
          message: 'ข้อมูลได้รับการส่งเรียบร้อยแล้ว เราจะติดต่อกลับภายใน 24 ชั่วโมง'
        },
        message: 'ส่งข้อมูลตรวจสอบเครดิตสำเร็จ'
      } as T
    }

    return newData as T
  }

  // Mock data update
  private static async updateMockData<T>(_endpoint: string, data: unknown): Promise<T> {
    const updatedData = {
      ...(typeof data === 'object' && data !== null ? data : {}),
      updatedAt: new Date().toISOString()
    }
    return updatedData as T
  }

  // Mock data deletion
  private static async deleteMockData(_endpoint: string): Promise<void> {
    // Simulate deletion
    return Promise.resolve()
  }

  // Generate unique ID
  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
  }
}

// Helper function to create paginated response
export function createPaginatedResponse<T>(
  data: T[],
  page: number = 1,
  pageSize: number = 10,
  total?: number
): PaginatedResponse<T> {
  const totalItems = total || data.length
  const pageCount = Math.ceil(totalItems / pageSize)
  
  return {
    success: true,
    message: 'Data retrieved successfully',
    data,
    statusCode: HttpStatus.OK,
    pagination: {
      page,
      pageSize,
      total: totalItems,
      pageCount
    }
  }
}
