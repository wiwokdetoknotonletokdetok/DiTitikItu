import { X } from 'lucide-react'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

type ModalProps = {
  hash: string
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ hash, children }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const isOpen = location.hash === hash

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate(-1)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)

      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollBarWidth}px`
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      document.body.style.paddingRight = '' 
    }
  }, [isOpen, navigate])


  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[10001] flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => navigate(-1)}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={() => navigate(-1)}
        >
          <X size={20} />
        </button>
        <div>{children}</div>
      </div>
    </div>
  )
}

export default Modal
