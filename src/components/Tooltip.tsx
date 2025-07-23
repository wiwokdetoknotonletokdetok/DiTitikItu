import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function Tooltip({ children, message }: { children: React.ReactNode, message: string }) {
  const [show, setShow] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  const ref = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    if (show && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      setPosition({
        top: rect.top + window.scrollY,
        left: rect.left + rect.width / 2 + window.scrollX
      })
    }
  }, [show])

  return (
    <>
      <span
        ref={ref}
        className="relative inline-block cursor-pointer"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </span>

      {show &&
        createPortal(
          <div
            style={{
              position: 'absolute',
              top: position.top - 30,
              left: position.left,
              transform: 'translateX(-50%)',
              zIndex: 9999
            }}
            className="bg-gray-800 text-white text-xs px-3 py-1 rounded shadow-lg pointer-events-none"
          >
            {message}
          </div>,
          document.body
        )}
    </>
  )
}
