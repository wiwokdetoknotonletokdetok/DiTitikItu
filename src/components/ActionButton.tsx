import Tooltip from '@/components/Tooltip.tsx'
import type { ReactNode } from 'react'


export interface ActionButtonProps {
  icon: ReactNode
  onClick?: () => void
  label: string
  tooltip: string
  className: string
  disabled?: boolean
}

export default function ActionButton({ disabled, icon, onClick, label, className, tooltip } : ActionButtonProps) {
  return (
    <div className="flex flex-col items-center w-16">
      <Tooltip message={tooltip}>
        <button
          onClick={onClick}
          disabled={disabled}
          className={`w-[42px] h-[42px] rounded-full shadow-md flex items-center justify-center 
          transition-colors disabled:cursor-not-allowed ${className}`}
          aria-label={label}
        >
          {icon}
        </button>
      </Tooltip>
      <p className="text-xs font-medium mt-2 text-center text-gray-600">{label}</p>
    </div>
  )
}
