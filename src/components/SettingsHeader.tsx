import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Tooltip from '@/components/Tooltip.tsx'

interface SettingsHeaderProps {
  to?: string
  children: React.ReactNode
}

export default function SettingsHeader({ to, children }: SettingsHeaderProps) {
  const navigate = useNavigate()

  return (
    <>
      {to ? (
        <div className="flex items-center gap-4 mb-6">
          <Tooltip message="Kembali">
            <button
              className="w-[28px]"
              onClick={() => navigate(to, {replace: true})}
            >
              <ChevronLeft className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-800"
                           size={28}/>
            </button>
          </Tooltip>
          <h1 className="text-2xl font-bold text-gray-800">{children}</h1>
        </div>
      ) : (
        <h1 className="mb-6 text-2xl font-bold text-gray-800">{children}</h1>
      )}
    </>
  )
}
