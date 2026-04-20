// API Response Types
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  statusCode: number
  pagination?: {
    page: number
    pageSize: number
    total: number
    pageCount: number
  }
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    pageSize: number
    total: number
    pageCount: number
  }
}

// API Error Types
export interface ApiError {
  success: false
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}

// HTTP Status Codes
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

// API Configuration
export interface ApiConfig {
  baseURL: string
  timeout: number
  headers?: Record<string, string>
}

// Query Parameters
export interface QueryParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  category?: string
  status?: string
  [key: string]: string | number | undefined
}
