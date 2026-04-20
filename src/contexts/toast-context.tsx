import React, { createContext, useState, useCallback } from 'react'
import { type Toast, ToastContainer } from '@/components/shared/toast'
import { type ToastContextType } from './toast-constants'

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...toast, id }])
  }, [])

  const showSuccess = useCallback((message: string, title?: string) => {
    showToast({ message, title, type: 'success' })
  }, [showToast])

  const showError = useCallback((message: string, title?: string) => {
    showToast({ message, title, type: 'error' })
  }, [showToast])

  const showWarning = useCallback((message: string, title?: string) => {
    showToast({ message, title, type: 'warning' })
  }, [showToast])

  const showInfo = useCallback((message: string, title?: string) => {
    showToast({ message, title, type: 'info' })
  }, [showToast])

  return (
    <ToastContext.Provider value={{
      showToast,
      showSuccess,
      showError,
      showWarning,
      showInfo,
    }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

// Export the context for use in hooks
export { ToastContext }
