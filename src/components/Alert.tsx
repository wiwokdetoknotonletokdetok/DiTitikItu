import { X } from 'lucide-react'

type AlertMessageProps = {
  message: string
  onClose: () => void
  type?: 'error' | 'success'
}

const typeStyles = {
  error: {
    container: 'bg-red-100 text-red-700 hover:text-red-900',
  },
  success: {
    container: 'bg-green-100 text-green-700 hover:text-green-900',
  },
}

export default function AlertMessage({ message, onClose, type = 'error' }: AlertMessageProps) {
  if (!message) return null

  const styles = typeStyles[type]

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
