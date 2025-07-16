interface TextInputProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  className?: string
  onFocus?: () => void
  validation?: React.ReactNode
}

const TextInput: React.FC<TextInputProps> = ({ label, name, value, onChange, placeholder, onFocus, className, validation }) => {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-gray-700 " htmlFor={name}>{label}</label>
      <input
        type="text"
        name={name}
        id={name}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:border-[#1E497C] placeholder:text-sm"
        value={value}
        onChange={onChange}
        onFocus={onFocus}
      />
      {validation}
    </div>
  )
}

export default TextInput
