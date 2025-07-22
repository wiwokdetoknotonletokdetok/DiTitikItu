import { X } from 'lucide-react'
import { useEffect } from 'react'

type AlertMessageProps = {
  message: string
  onClose: () => void
  type?: 'error' | 'success'
  duration?: number
}

const typeStyles = {
  error: {
    container: 'bg-red-100 text-red-700 hover:text-red-900',
  },
  success: {
    container: 'bg-green-100 text-green-700 hover:text-green-900',
  },
}

export default function AlertMessage({ duration = 3000, message, onClose, type = 'error' }: AlertMessageProps) {
  const styles = typeStyles[type]

  useEffect(() => {
    if (!message) return

    const timeout = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timeout)
  }, [message, onClose, duration])

  if (!message) return null

  return (
    <div className={`mb-4 relative ${styles.container} pl-3 pr-8 py-[11px] rounded text-sm`}>
      <span>{message}</span>
      <button
        type="button"
        onClick={onClose}
        className={`absolute right-3 inset-y-0 text-lg leading-none ${styles.container}`}
        aria-label="Tutup pesan"
      >
        <X size={16} />
      </button>
    </div>
  )
}
