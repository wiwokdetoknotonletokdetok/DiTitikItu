import { useState } from 'react'

interface TooltipProps {
  message: string
  children: React.ReactNode
}

const Tooltip: React.FC<TooltipProps> = ({ message, children }) => {
  const [show, setShow] = useState(false)

  return (
    <span
      className="relative inline-block cursor-pointer"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-xs rounded bg-gray-800 px-3 py-1 text-xs text-white shadow-lg whitespace-nowrap z-10">
          {message}
        </div>
      )}
    </span>
  )
}

export default Tooltip
