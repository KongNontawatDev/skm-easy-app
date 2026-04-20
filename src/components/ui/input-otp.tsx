import * as React from 'react'
import { OTPInput, OTPInputContext } from 'input-otp'
import { MinusIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentProps<typeof OTPInput> & {
    containerClassName?: string
  }
>(({ className, containerClassName, ...props }, ref) => {
  return (
    <OTPInput
      ref={ref}
      data-slot='input-otp'
      containerClassName={cn(
        'flex items-center justify-center gap-[0.5rem] has-disabled:opacity-50',
        containerClassName
      )}
      className={cn('disabled:cursor-not-allowed', className)}
      {...props}
    />
  )
})
InputOTP.displayName = 'InputOTP'

function InputOTPGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='input-otp-group'
      className={cn('flex items-center gap-[0.33rem]', className)}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot='input-otp-slot'
      data-active={isActive}
      className={cn(
        'relative flex h-[2.662rem] w-[2.332rem] shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white text-[1.165rem] font-medium tabular-nums leading-none text-gray-900 shadow-xs transition-all outline-none',
        'dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100',
        'aria-invalid:border-red-500 data-[active=true]:z-10 data-[active=true]:border-[#EC1B2E] data-[active=true]:ring-2 data-[active=true]:ring-[#EC1B2E]/25',
        'dark:data-[active=true]:border-[#EC1B2E]',
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
          <div className='animate-caret-blink h-[1.165rem] w-px rounded-full bg-[#EC1B2E] duration-1000' />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='input-otp-separator'
      role='separator'
      className={cn('flex shrink-0 items-center px-0.5 text-gray-400 dark:text-gray-500', className)}
      {...props}
    >
      <MinusIcon className='h-[1.165rem] w-[1.165rem]' aria-hidden />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
