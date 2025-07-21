import React, { useEffect, useState } from 'react'
import type { WebResponse } from '@/dto/WebResponse.ts'
import type { GenreResponse } from '@/dto/GenreResponse.ts'

interface SelectInputProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  placeholder?: string
  className?: string
  hasError?: boolean
  validation?: React.ReactNode
  fetchOptions: (query: string) => Promise<WebResponse<GenreResponse[]>>
}

const SelectGenre: React.FC<SelectInputProps> = ({label, name, value, onChange, placeholder, className, hasError, validation, fetchOptions}) => {
  const [options, setOptions] = useState<GenreResponse[]>([])
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchOptions('')
    .then(res => {
      setOptions(res.data)
      setError(false)
    })
    .catch(() => {
      setOptions([{ id: -1, genreName: 'Lainnya' }])
      setError(true)
    })
  }, [fetchOptions])

  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`h-[42px] text-sm w-full border rounded-md py-2 px-3 outline-none placeholder:text-sm
          ${
          hasError || error
            ? 'border-red-500 focus:border-red-600'
            : 'border-gray-300 focus:border-[#1E497C]'
        }`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map(opt => (
          <option key={opt.id} value={opt.id.toString()}>
            {opt.genreName}
          </option>
        ))}
      </select>
      {validation}
    </div>
  )
}

export default SelectGenre
