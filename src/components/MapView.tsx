import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import L from 'leaflet'

const defaultIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [35, 35],
})

interface MapViewProps {
  userLocation?: { lat: number; lng: number }
  books?: { id: string; lat: number; lng: number; title: string }[]
}

export default function MapView({ userLocation, books = [] }: MapViewProps) {
  const [position, setPosition] = useState<[number, number] | null>(null)

  useEffect(() => {
    if (userLocation) {
      setPosition([userLocation.lat, userLocation.lng])
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
        (err) => {
          console.warn('Lokasi tidak bisa diakses:', err)
          setPosition([-6.2, 106.8])
        }
      )
    }
  }, [userLocation])

  if (!position) return <p>Memuat lokasi...</p>

  return (
    <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={position} icon={defaultIcon}>
        <Popup>Kamu di sini</Popup>
      </Marker>

      {books.map((book) => (
        <Marker key={book.id} position={[book.lat, book.lng]}>
          <Popup>{book.title}</Popup>
        </Marker>
      ))}
      
    </MapContainer>
  )
}
