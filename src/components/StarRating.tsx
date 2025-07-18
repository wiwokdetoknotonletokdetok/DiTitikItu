import { Star, StarHalf, StarOff } from 'lucide-react'

export function StarRating({ rating }: { rating: number }) {
  const stars = []

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(
        <Star key={i} className="text-yellow-400 w-5 h-5" fill="currentColor" stroke="#000000" strokeWidth={1} />
      )
    } else if (rating >= i - 0.5) {
      stars.push(
        <div key={i} className="relative w-5 h-5">
          <Star className="absolute text-gray-300 w-5 h-5" fill="none" stroke="#000000" strokeWidth={1}/>
          <StarHalf className="absolute text-yellow-400 w-5 h-5" fill="currentColor" stroke="none"/>
        </div>
      )
    } else {
      stars.push(
        <StarOff key={i} className="text-gray-300 w-5 h-5" fill="currentColor" stroke="#AAAAAA" strokeWidth={1}/>
      )
    }
  }

  return <div className="flex gap-1 justify-center">{stars}</div>
}
