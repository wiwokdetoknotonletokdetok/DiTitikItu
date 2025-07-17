interface TextInputProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  className?: string
  onFocus?: () => void
  onBlur?: () => void
  validation?: React.ReactNode
  hasError?: boolean
}

const TextInput: React.FC<TextInputProps> = ({ onBlur, label, name, value, onChange, placeholder, onFocus, className, validation, hasError }) => {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-gray-700 " htmlFor={name}>{label}</label>
      <input
        type="text"
        name={name}
        id={name}
        placeholder={placeholder}
        className={`h-[42px] text-sm w-full border rounded-md py-2 px-3 outline-none placeholder:text-sm
          ${hasError ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-[#1E497C]'}`}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {validation}
    </div>
  )
}

export default TextInput
