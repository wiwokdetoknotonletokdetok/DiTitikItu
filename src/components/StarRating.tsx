import { Star, StarHalf, StarOff } from 'lucide-react'

export function StarRating({ rating, size = 5 }: { rating: number; size?: number }) {
  const sizeClass = `w-${size} h-${size}`
  const stars = []

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<Star key={i} className={`text-yellow-400 ${sizeClass}`} fill="currentColor" stroke="#000000" />)
    } else if (rating >= i - 0.5) {
      stars.push(
        <div key={i} className={`relative ${sizeClass}`}>
          <Star className={`absolute text-gray-300 ${sizeClass}`} fill="none" stroke="#000000" />
          <StarHalf className={`absolute text-yellow-400 ${sizeClass}`} fill="currentColor" stroke="none" />
        </div>
      )
    } else {
      stars.push(<StarOff key={i} className={`text-gray-300 ${sizeClass}`} fill="currentColor" stroke="#AAAAAA" />)
    }
  }

  return <div className="flex gap-1 justify-center">{stars}</div>
}
