import { type Toast } from '@/components/shared/toast'

export interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void
  showSuccess: (message: string, title?: string) => void
  showError: (message: string, title?: string) => void
  showWarning: (message: string, title?: string) => void
  showInfo: (message: string, title?: string) => void
}
