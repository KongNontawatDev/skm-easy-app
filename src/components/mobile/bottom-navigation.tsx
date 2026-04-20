import { Home, CreditCard, Bell, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from '@tanstack/react-router'

interface BottomNavigationProps {
  currentPath?: string
  className?: string
}

const navigationItems = [
  { id: 'home', label: 'หน้าแรก', icon: Home, path: '/' },
  { id: 'installment', label: 'ค่างวดรถ', icon: CreditCard, path: '/installment' },
  { id: 'notification', label: 'แจ้งเตือน', icon: Bell, path: '/notification' },
  { id: 'profile', label: 'โปรไฟล์', icon: User, path: '/profile' },
]

export function BottomNavigation({ 
  currentPath = '/',
  className 
}: BottomNavigationProps) {
  const router = useRouter()
  
  return (
    <nav
      className={cn(
        'fixed bottom-0 left-1/2 z-50 flex h-16 w-full max-w-lg -translate-x-1/2 items-center justify-around bg-white dark:bg-gray-800 mobile-safe-area',
        className
      )}
    >
      {navigationItems.map((item) => {
        const Icon = item.icon
        const isActive = currentPath === item.path
        
        return (
          <button
            key={item.id}
            onClick={() => router.navigate({ to: item.path })}
            className={cn(
              'flex flex-col items-center justify-center space-y-1 px-2 py-2 transition-all duration-200',
              isActive 
                ? 'text-[#EC1B2E]' 
                : 'text-gray-500 dark:text-gray-400'
            )}
          >
            <Icon className={cn(
              'h-5 w-5 transition-all duration-200',
              isActive && 'scale-105'
            )} />
            <span className={cn(
              'text-xs font-medium transition-all duration-200',
              isActive && 'text-[#EC1B2E]'
            )}>
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
