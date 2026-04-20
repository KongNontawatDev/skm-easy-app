import { Toaster as Sonner, ToasterProps } from 'sonner'
import { useTheme } from '@/context/theme-provider'

export function Toaster({ ...props }: ToasterProps) {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      position="top-center"
      className="toaster group"
      toastOptions={{
        className: 'rounded-xl border-0 shadow-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
        style: {
          background: 'var(--background)',
          color: 'var(--foreground)',
          border: 'none',
          boxShadow: 'none',
        },
      }}
      style={
        {
          '--normal-bg': 'var(--background)',
          '--normal-text': 'var(--foreground)',
          '--normal-border': 'transparent',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}
