import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '@/context/theme-provider'
import { MobileButton } from './mobile-button'

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { value: 'light', label: 'สว่าง', icon: Sun },
    { value: 'dark', label: 'มืด', icon: Moon },
    { value: 'system', label: 'ระบบ', icon: Monitor },
  ] as const

  return (
    <div className="space-y-2">
      {themes.map(({ value, label, icon: Icon }) => (
        <MobileButton
          key={value}
          variant={theme === value ? 'primary' : 'outline'}
          className="w-full justify-start"
          onClick={() => setTheme(value)}
        >
          <Icon className="mr-3 h-4 w-4" />
          {label}
        </MobileButton>
      ))}
    </div>
  )
}
