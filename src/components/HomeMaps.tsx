import MapView from '@/components/MapView'
import type { UserPosition } from '@/dto/UserPosition'
import type { BookLocationResponse } from '@/dto/BookLocationResponse'

type HomeMapsProps = {
  userPosition?: UserPosition
  bookLocations: BookLocationResponse[]
  flyToLocation: { latitude: number; longitude: number } | null
}

export default function HomeMaps({ userPosition, bookLocations, flyToLocation }: HomeMapsProps) {
  return (
    <MapView
      userPosition={userPosition}
      bookLocations={bookLocations}
      flyToLocation={flyToLocation}
    />
  )
}
