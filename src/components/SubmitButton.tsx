interface SumbitButtonProps {
  children: React.ReactNode
  type: 'button' | 'submit' | 'reset'
  onClick?: () => void
  className?: string
  isLoading?: boolean
  disabled?: boolean
}

const SubmitButton: React.FC<SumbitButtonProps> = ({
  disabled,
  isLoading,
  children,
  type,
  onClick,
  className = '',
}) => {
  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={`w-full h-[42px] bg-[#1E497C] text-white rounded-md hover:bg-[#5C8BC1] 
      font-semibold transition duration-200 ease-in-out ${className} 
      ${disabled ? 'bg-[#5C8BC1] cursor-not-allowed' : null}`}
    >
      {isLoading ? 'Memproses...' : children}
    </button>
  )
}

export default SubmitButton
