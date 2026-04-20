import { MoreHorizontal, User, HelpCircle, Phone } from 'lucide-react'
import { MobileButton } from './mobile-button'
import { useNavigate } from '@tanstack/react-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function MobileHeaderMenu() {
  const navigate = useNavigate()

  const handleNavigation = (path: string) => {
    navigate({ to: path })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MobileButton variant="ghost" size="sm" className="h-10 w-10 p-0">
          <MoreHorizontal className="h-5 w-5" />
        </MobileButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 rounded-xl bg-white p-1 dark:bg-gray-800"
        style={{
          boxShadow: 'none',
          border: 'none',
        }}
      >
        <DropdownMenuItem
          onClick={() => handleNavigation('/profile')}
          className="rounded-lg hover:bg-gray-50 focus:bg-gray-50 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
        >
          <User className="mr-3 h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="text-gray-900 dark:text-gray-100">โปรไฟล์</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleNavigation('/guide')}
          className="rounded-lg hover:bg-gray-50 focus:bg-gray-50 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
        >
          <HelpCircle className="mr-3 h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="text-gray-900 dark:text-gray-100">วิธีใช้งาน</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleNavigation('/contact')}
          className="rounded-lg hover:bg-gray-50 focus:bg-gray-50 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
        >
          <Phone className="mr-3 h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="text-gray-900 dark:text-gray-100">ติดต่อบริษัท</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
