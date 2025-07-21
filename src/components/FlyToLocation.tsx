import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

interface FlyToLocationProps {
  latitude: number
  longitude: number
  trigger: number
}

export default function FlyToLocation({ latitude, longitude, trigger }: FlyToLocationProps) {
  const map = useMap()

  useEffect(() => {
    map.flyTo([latitude, longitude], 16, {
      duration: 1.5
    })
  }, [trigger, map])

  return null
}
