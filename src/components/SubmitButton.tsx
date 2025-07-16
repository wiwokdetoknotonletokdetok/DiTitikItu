interface SumbitButtonProps {
  children: React.ReactNode
  type: 'button' | 'submit' | 'reset'
  onClick?: () => void
  className?: string
}

const SubmitButton: React.FC<SumbitButtonProps> = ({
  children,
  type,
  onClick,
  className = '',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full h-[42px] bg-[#1E497C] text-white rounded-md hover:bg-[#5C8BC1] 
      text-sm font-semibold tracking-wide transition duration-200 ease-in-out ${className}`}
    >
      {children}
    </button>
  )
}

export default SubmitButton
