import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

interface PasswordInputProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  className?: string;
  onFocus?: () => void
  validation?: React.ReactNode
}

const PasswordInput: React.FC<PasswordInputProps> = ({ label, name, value, onChange, placeholder, className, onFocus, validation }) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-gray-700 " htmlFor={name}>{label}</label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          id={name}
          placeholder={placeholder}
          className="h-[42px] text-sm w-full border border-gray-300 rounded-md py-2 px-3 pr-8 outline-none focus:border-[#1E497C] placeholder:text-sm"
          value={value}
          onChange={onChange}
          onFocus={onFocus}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 inset-y-0 transform text-gray-500" tabIndex={-1}>
          {showPassword ? <Eye size={16}/> : <EyeOff size={16}/>}
        </button>
      </div>
      {validation}
    </div>
  )
}

export default PasswordInput
