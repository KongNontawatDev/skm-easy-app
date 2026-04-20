import { useMutation, type UseMutationOptions, useQueryClient } from '@tanstack/react-query'
import { type ApiResponse } from '@/lib/api-types'

// Generic useMutation hook for API calls
export function useApiMutation<TData, TVariables = unknown>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options?: UseMutationOptions<ApiResponse<TData>, Error, TVariables>
) {
  return useMutation({
    mutationFn,
    onSuccess: (data, variables, context) => {
      // Invalidate related queries
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    onError: (error, variables, context) => {
      if (options?.onError) {
        options.onError(error, variables, context)
      }
    },
    ...options,
  })
}

// Hook for create operations
export function useApiCreate<TData, TVariables = unknown>(
  resource: string,
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options?: UseMutationOptions<ApiResponse<TData>, Error, TVariables>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: (data, variables, context) => {
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: [resource, 'list'] })
      queryClient.invalidateQueries({ queryKey: [resource] })
      
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    ...options,
  })
}

// Hook for update operations
export function useApiUpdate<TData, TVariables = unknown>(
  resource: string,
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options?: UseMutationOptions<ApiResponse<TData>, Error, TVariables>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: (data, variables, context) => {
      // Invalidate specific item and list queries
      queryClient.invalidateQueries({ queryKey: [resource, 'list'] })
      queryClient.invalidateQueries({ queryKey: [resource] })
      
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    ...options,
  })
}

// Hook for delete operations
export function useApiDelete<TData = unknown>(
  resource: string,
  mutationFn: (id: string) => Promise<ApiResponse<TData>>,
  options?: UseMutationOptions<ApiResponse<TData>, Error, string>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: (data, variables, context) => {
      // Invalidate list queries and remove specific item from cache
      queryClient.invalidateQueries({ queryKey: [resource, 'list'] })
      queryClient.invalidateQueries({ queryKey: [resource] })
      queryClient.removeQueries({ queryKey: [resource, variables] })
      
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    ...options,
  })
}
