import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query'
import { type ApiResponse, type QueryParams } from '@/lib/api-types'

// Generic useQuery hook for API calls
export function useApiQuery<T>(
  queryKey: (string | number | QueryParams)[],
  queryFn: () => Promise<ApiResponse<T>>,
  options?: Omit<UseQueryOptions<ApiResponse<T>>, 'queryKey' | 'queryFn'>
): UseQueryResult<ApiResponse<T>> {
  return useQuery({
    queryKey,
    queryFn,
    ...options,
  })
}

// Hook for paginated data
export function useApiQueryPaginated<T>(
  queryKey: (string | number | QueryParams)[],
  queryFn: () => Promise<ApiResponse<T[]>>,
  options?: Omit<UseQueryOptions<ApiResponse<T[]>>, 'queryKey' | 'queryFn'>
): UseQueryResult<ApiResponse<T[]>> {
  return useQuery({
    queryKey,
    queryFn,
    ...options,
  })
}

// Hook for single item by ID
export function useApiQueryById<T>(
  resource: string,
  id: string,
  queryFn: () => Promise<ApiResponse<T>>,
  options?: Omit<UseQueryOptions<ApiResponse<T>>, 'queryKey' | 'queryFn'>
): UseQueryResult<ApiResponse<T>> {
  return useQuery({
    queryKey: [resource, id],
    queryFn,
    enabled: !!id,
    ...options,
  })
}

// Hook for list with filters
export function useApiQueryList<T>(
  resource: string,
  params: QueryParams | undefined,
  queryFn: () => Promise<ApiResponse<T[]>>,
  options?: Omit<UseQueryOptions<ApiResponse<T[]>>, 'queryKey' | 'queryFn'>
): UseQueryResult<ApiResponse<T[]>> {
  return useQuery({
    queryKey: [resource, 'list', params],
    queryFn,
    ...options,
  })
}
