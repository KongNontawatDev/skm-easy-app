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

// Mark article as viewed
export const useMarkArticleViewed = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (articleId: string) => {
      const response = await skmApi.post(`/articles/${articleId}/view`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
  })
}

// Mark guide as viewed
export const useMarkGuideViewed = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (guideId: string) => {
      const response = await skmApi.post(`/guides/${guideId}/view`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guides'] })
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

