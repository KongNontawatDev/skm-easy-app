export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  priority: NotificationPriority
  isRead: boolean
  isImportant: boolean
  relatedId?: string
  relatedType?: RelatedType
  createdAt: string
  updatedAt: string
  actionUrl?: string
  actionText?: string
}

export type NotificationType = 'payment' | 'promotion' | 'system' | 'reminder' | 'alert'
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent'
export type RelatedType = 'contract' | 'invoice' | 'receipt' | 'installment' | 'promotion'
