import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'

interface FlyToLocationProps {
  trigger: boolean
}

export default function FlyToLocation({ trigger }: FlyToLocationProps) {
  const map = useMap()
  const flyToLocation = useSelector((state: RootState) => state.flyToLocation)

  useEffect(() => {
    if (flyToLocation)
    map.flyTo([flyToLocation.latitude, flyToLocation.longitude], flyToLocation?.zoom, {
      duration: 1.5
    })
  }, [trigger, map])

  return null
}
