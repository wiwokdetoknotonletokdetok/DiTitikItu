import { ChevronDown } from 'lucide-react'
import type { MouseEventHandler } from 'react'
import Tooltip from '@/components/Tooltip.tsx'

interface ToContentButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>
  className?: string
  ariaLabel?: string
}

export default function ToContentButton({onClick, className, ariaLabel = 'Scroll ke konten'}: ToContentButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`z-[10000] fixed bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full text-gray-600 bg-white shadow-lg flex items-center justify-center transition-all ${className}`}
      aria-label={ariaLabel}
    >
      <Tooltip message="Rekomendasi buku">
        <ChevronDown className="w-5 h-5" />
      </Tooltip>
    </button>
  )
}
