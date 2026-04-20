import { useMutation, useQueryClient } from '@tanstack/react-query'
import { skmApi } from '@/lib/skm-api'

// Mark promotion as viewed
export const useMarkPromotionViewed = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (promotionId: string) => {
      const response = await skmApi.post(`/promotions/${promotionId}/view`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotion-ads'] })
    },
  })
}

// Update contract status
export const useUpdateContractStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ contractId, status }: { contractId: string; status: string }) => {
      const response = await skmApi.patch(`/contracts/${contractId}/status`, { status })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-cards'] })
      queryClient.invalidateQueries({ queryKey: ['home-data'] })
    },
  })
}

// Refresh home data
export const useRefreshHomeData = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      const response = await skmApi.post('/home/refresh')
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home-data'] })
      queryClient.invalidateQueries({ queryKey: ['contract-cards'] })
      queryClient.invalidateQueries({ queryKey: ['promotion-ads'] })
    },
  })
}

// Upload contract vehicle image
export const useUploadContractImage = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ contractId, file }: { contractId: string; file: File }) => {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('contractId', contractId)
      
      const response = await skmApi.post('/contracts/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-cards'] })
      queryClient.invalidateQueries({ queryKey: ['home-data'] })
    },
  })
}
