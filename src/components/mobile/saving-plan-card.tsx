import {type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

interface SavingPlan {
  id: string
  name: string
  amount: string
  icon: ReactNode
  color: string
}

interface SavingPlanCardProps {
  title: string
  plans: SavingPlan[]
  className?: string
}

export function SavingPlanCard({
  title,
  plans,
  className
}: SavingPlanCardProps) {
  return (
    <div className={cn(
      'bg-white rounded-2xl p-4',
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <ArrowRight className="h-4 w-4 text-gray-400" />
      </div>
      
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="flex-shrink-0 bg-gray-50 rounded-xl p-3 min-w-[120px]"
          >
            <div className="flex flex-col items-center space-y-2">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center',
                plan.color
              )}>
                {plan.icon}
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600 font-medium">{plan.name}</div>
                <div className="text-sm font-bold text-gray-900">{plan.amount}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
