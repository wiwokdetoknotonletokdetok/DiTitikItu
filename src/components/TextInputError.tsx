interface TextInputValidationProps {
  message: string
}

const TextInputValidation: React.FC<TextInputValidationProps> = ({ message }) => {
  return (
    <p className="text-red-500 text-xs mt-1">{message}</p>
  )
}

export default TextInputValidation
