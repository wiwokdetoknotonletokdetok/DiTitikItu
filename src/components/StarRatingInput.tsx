import { useState } from 'react'

interface StarRatingInputProps {
  value: number
  onChange: (value: number) => void
  max?: number
  size?: string 
}

export default function StarRatingInput({
  value,
  onChange,
  max = 5,
  size = 'text-3xl'
}: StarRatingInputProps) {
  const [hoverRating, setHoverRating] = useState(0)

  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, index) => {
        const filled = index < (hoverRating || value)
        return (
          <button
            key={index}
            type="button"
            onClick={() => onChange(index + 1)}
            onMouseEnter={() => setHoverRating(index + 1)}
            onMouseLeave={() => setHoverRating(0)}
            className={`cursor-pointer ${size} transition-transform duration-150 ease-in-out ${
              filled ? 'text-yellow-500' : 'text-gray-300'
            } hover:scale-110 active:scale-90`}
            title={`Rating: ${index + 1}`}
          >
            ★
          </button>
        )
      })}
    </div>
  )
}
