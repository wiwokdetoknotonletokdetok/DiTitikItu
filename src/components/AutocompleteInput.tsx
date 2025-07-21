import React, { useState, useEffect, useRef } from 'react'
import TextInput from '@/components/TextInput.tsx'
import type { WebResponse } from '@/dto/WebResponse.ts'

interface AutocompleteInputProps {
  label: React.ReactNode
  name: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  fetchSuggestions: (query: string) => Promise<WebResponse<string[]>>
  className?: string
  hasError?: boolean
  validation?: React.ReactNode
  multi?: boolean
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({ label, name, value, onChange, placeholder, fetchSuggestions, className, hasError, validation, multi = false }) => {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const getCurrentInput = () => {
    if (!multi) return value.trim()
    const parts = value.split(',').map((s) => s.trim())
    return parts[parts.length - 1] || ''
  }

  const handleSelect = (selected: string) => {
    if (!multi) {
      onChange(selected)
    } else {
      const parts = value.split(',').map((s) => s.trim()).filter(Boolean)
      parts[parts.length - 1] = selected
      const newValue = parts.join(', ')
      onChange(newValue)
    }
    setShowSuggestions(false)
  }

  useEffect(() => {
    const query = getCurrentInput()
    if (query.length === 0) {
      setSuggestions([])
      return
    }

    const timeout = setTimeout(() => {
      fetchSuggestions(query).then((res) => setSuggestions(res.data))
    }, 300)

    return () => clearTimeout(timeout)
  }, [value, fetchSuggestions])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={wrapperRef}>
      <TextInput
        label={label}
        name={name}
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setShowSuggestions(true)
        }}
        placeholder={placeholder}
        className={className}
        hasError={hasError}
        validation={validation}
      />

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-200 mt-1 w-full rounded shadow overflow-hidden max-h-60 overflow-y-auto">
          {suggestions.map((item, i) => (
            <li
              key={i}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => handleSelect(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AutocompleteInput
