import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

interface FlyToLocationProps {
  latitude: number
  longitude: number
}

export default function FlyToLocation({ latitude, longitude }: FlyToLocationProps) {
  const map = useMap()

  useEffect(() => {
    map.flyTo([latitude, longitude], 16, {
      duration: 1.5
    })
  }, [latitude, longitude, map])

  return null
}
