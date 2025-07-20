import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import type { UserPosition } from '@/dto/UserPosition.ts'
import type { BookLocationResponse } from '@/dto/BookLocationResponse.ts'
import FlyToLocation from "@/components/FlyToLocation.tsx";

function SetViewTo({ position }) {
  const map = useMap()
  useEffect(() => {
    if (position) {
      map.setView(position, 13)
    }
  }, [])
  return null
}

function GoToUserButton({ position }) {
  const map = useMap()

  const handleClick = () => {
    if (position) {
      map.flyTo([position.latitude, position.longitude], 13)
    }
  }

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1000,
        padding: '8px 12px',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      Ke Lokasi Saya
    </button>
  )
}

interface MapViewProps {
  bookLocations: BookLocationResponse[]
  userPosition?: UserPosition
  flyToLocation?: { latitude: number, longitude: number } | null
}

export default function MapView({ bookLocations, userPosition, flyToLocation }: MapViewProps) {
  const center = userPosition ? [userPosition.latitude, userPosition.longitude] : [0, 0]

  return (
    <div style={{ position: 'relative' }}>
      <MapContainer center={center} zoom={userPosition ? 13 : 2} style={{ height: '85vh', width: '100%' }}>
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {userPosition && (
          <>
            <Marker position={[userPosition.latitude, userPosition.longitude]}>
              <Popup>Lokasi Anda</Popup>
            </Marker>
            <SetViewTo position={[userPosition.latitude, userPosition.longitude]} />
          </>
        )}

        {bookLocations
        .filter(location => location.coordinates[0] !== undefined && location.coordinates[1] !== undefined)
        .map(location => (
          <Marker
            key={location.id}
            position={[location.coordinates[0], location.coordinates[1]]}
          >
            <Popup>{location.locationName}</Popup>
          </Marker>
        ))}

        {flyToLocation && (
          <FlyToLocation
            latitude={flyToLocation.latitude}
            longitude={flyToLocation.longitude}
          />
        )}

        {userPosition && <GoToUserButton position={userPosition} />}
      </MapContainer>
    </div>
  )
}
