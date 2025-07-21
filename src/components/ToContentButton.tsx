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
    <div className="z-[10000] fixed bottom-2 left-1/2 -translate-x-1/2 transform">
      <Tooltip message="Rekomendasi buku">
        <button
          onClick={onClick}
          className={`border border-gray-200  w-[46px] h-[46px] rounded-full text-gray-500 bg-white shadow-md flex items-center justify-center transition-all ${className}`}
          aria-label={ariaLabel}
        >
          <ChevronDown size={20} />
        </button>
      </Tooltip>
    </div>
  )
}
