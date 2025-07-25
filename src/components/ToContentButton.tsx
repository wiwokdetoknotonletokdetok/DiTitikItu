import { ChevronDown, ChevronUp } from 'lucide-react'
import type { MouseEventHandler } from 'react'
import Tooltip from '@/components/Tooltip.tsx'

interface ToContentButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>
  className?: string
  ariaLabel?: string
  direction?: 'down' | 'up'
}

export default function ToContentButton({
  onClick,
  className,
  ariaLabel = 'Scroll',
  direction = 'down'
}: ToContentButtonProps) {
  return (
    <div className="z-[2000] fixed bottom-2 left-1/2 -translate-x-1/2 transform">
      <Tooltip message={direction === 'down' ? 'Rekomendasi buku' : 'Kembali ke atas'}>
        <button
          onClick={onClick}
          className={`border border-gray-200 w-[46px] h-[46px] rounded-full text-gray-500 bg-white shadow-md flex items-center justify-center transition-all ${className}`}
          aria-label={ariaLabel}
        >
          {direction === 'down' ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
      </Tooltip>
    </div>
  )
}
