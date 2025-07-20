import {MapContainer, Marker, Popup, TileLayer, useMap, ZoomControl} from 'react-leaflet'
import { useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import type { UserPosition } from '@/dto/UserPosition.ts'
import type { BookLocationResponse } from '@/dto/BookLocationResponse.ts'
import FlyToLocation from '@/components/FlyToLocation.tsx'
import { Locate, Plus, Minus } from 'lucide-react'

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
      className="absolute text-gray-500 bottom-28 right-2.5 z-[1000] p-2 bg-white hover:bg-gray-100 border border-gray-200 shadow-md rounded cursor-pointer"
    >
      <Locate size={20} />
    </button>
  )
}

function CustomZoomControl() {
  const map = useMap()

  return (
    <div className="absolute text-gray-500 bottom-6 right-2.5 flex flex-col z-[1000] border border-gray-200 shadow-md rounded overflow-hidden">
      <button
        onClick={() => map.zoomIn()}
        className="p-2 bg-white hover:bg-gray-100"
      >
        <Plus size={20} />
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="p-2 bg-white hover:bg-gray-100"
      >
        <Minus size={20} />
      </button>
    </div>
  )
}


interface MapViewProps {
  bookLocations: BookLocationResponse[]
  userPosition?: UserPosition
  flyToLocation?: { latitude: number, longitude: number } | null
  children?: React.ReactNode
}

export default function MapView({ children, bookLocations, userPosition, flyToLocation }: MapViewProps) {
  const center = userPosition ? [userPosition.latitude, userPosition.longitude] : [0, 0]

  return (
    <div style={{ position: 'relative' }}>
      <MapContainer
        center={center}
        zoom={userPosition ? 13 : 2}
        style={{ height: '85vh', width: '100%' }}
        zoomControl={false}
      >
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
        <CustomZoomControl />
        {userPosition && <GoToUserButton position={userPosition} />}
      </MapContainer>
      {children}
    </div>
  )
}
