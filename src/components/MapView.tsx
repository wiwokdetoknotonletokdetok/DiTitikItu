import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import type {UserPosition} from '@/dto/UserPosition.ts'

interface MapViewProps {
  userPosition: UserPosition
}

function SetViewTo({ position }) {
  const map = useMap()
  useEffect(() => {
    if (position) {
      map.setView(position, 13)
    }
  }, [position])
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

export default function MapView({ books, userPosition } : MapViewProps) {
  const center = userPosition ? [userPosition.latitude, userPosition.longitude] : [0, 0]

  return (
    <div style={{position: 'relative'}}>
      <MapContainer center={center} zoom={userPosition ? 13 : 2} style={{height: '450px', width: '100%'}}>
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

        {books.map(book => (
          <Marker key={book.id} position={[book.lat, book.lng]}>
            <Popup>{book.title}</Popup>
          </Marker>
        ))}

        {userPosition && <GoToUserButton position={userPosition}/>}
      </MapContainer>
    </div>
  )
}
