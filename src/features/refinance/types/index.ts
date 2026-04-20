// Refinance check types
export interface RefinanceVehicle {
  id: string
  brand: string
  model: string
  year: number
  color: string
  plateNumber: string
  imageUrl?: string
  condition: VehicleCondition
  estimatedValue: number
  refinanceAmount: number
  monthlyPayment: number
  interestRate: number
  termMonths: number
  eligibility: RefinanceEligibility
  requirements: string[]
}

export type VehicleCondition = 'excellent' | 'good' | 'fair' | 'poor'

export interface RefinanceEligibility {
  isEligible: boolean
  score: number // 0-100
  reasons: string[]
  requirements: string[]
}

export interface RefinanceCheckRequest {
  vehicleId: string
  customerInfo: {
    name: string
    phone: string
    email: string
  }
}

export interface RefinanceCheckResponse {
  success: boolean
  data?: RefinanceVehicle
  message?: string
}

// Credit check types
export interface CreditCheckForm {
  personalInfo: {
    firstName: string
    lastName: string
    phone: string
    email: string
    idCard: string
    birthDate: string
  }
  addressInfo: {
    currentAddress: string
    province: string
    district: string
    postalCode: string
    residenceType: 'owned' | 'rented' | 'family'
    residenceDuration: number // months
  }
  employmentInfo: {
    occupation: string
    company: string
    workDuration: number // months
    monthlyIncome: number
    incomeSource: 'salary' | 'business' | 'freelance' | 'other'
    additionalIncome?: number
  }
  financialInfo: {
    monthlyExpenses: number
    existingLoans: number
    creditCards: number
    bankAccounts: string[]
  }
  vehicleInfo: {
    brand: string
    model: string
    year: number
    price: number
    downPayment: number
  }
}

export interface CreditCheckResponse {
  success: boolean
  data?: {
    creditScore: number
    eligibility: boolean
    approvedAmount: number
    interestRate: number
    monthlyPayment: number
    termMonths: number
    requirements: string[]
    message: string
  }
  message?: string
}

export interface CreditCheckResult {
  id: string
  customerName: string
  phone: string
  creditScore: number
  eligibility: boolean
  approvedAmount: number
  interestRate: number
  monthlyPayment: number
  termMonths: number
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  processedAt?: string
  requirements: string[]
  notes?: string
}
