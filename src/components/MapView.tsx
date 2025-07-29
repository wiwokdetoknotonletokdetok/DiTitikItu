import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import type { BookLocationResponse } from '@/dto/BookLocationResponse.ts'
import FlyToLocation from '@/components/FlyToLocation.tsx'
import { Minus, Plus } from 'lucide-react'
import { ApiError } from '@/exception/ApiError.ts'
import { deleteBookLocation, updateBookLocation } from '@/api/bookLocation.ts'
import { useAuth } from '@/context/AuthContext'
import L from 'leaflet'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { setNewMarkerPosition } from '@/store/actions/newMarkerPositionActions.ts'
import type { UserPosition } from '@/dto/UserPosition.ts'

function SetViewTo({ userPosition } : { userPosition: UserPosition }) {
  const map = useMap()
  useEffect(() => {
    if (userPosition && userPosition.gps) {
      map.setView([userPosition.latitude, userPosition.longitude], 16)
    } else {
      map.setView([userPosition.latitude, userPosition.longitude], 12)
    }
  }, [])
  return null
}

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
  shadowSize: [41, 41]
})

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
  flyToTrigger: boolean
  children?: React.ReactNode
  onRefreshLocations: () => void
}

export default function MapView({ flyToTrigger, children, onRefreshLocations }: MapViewProps) {
  const { token } = useAuth()
  const dispatch = useDispatch()
  const userPosition = useSelector((state: RootState) => state.userPosition)
  const selectedBook = useSelector((state: RootState) => state.selectedBook)
  const bookLocations = useSelector((state: RootState) => state.selectedBookLocations)
  const newMarkerPosition = useSelector((state: RootState) => state.newMarkerPosition)
  const center: [number, number] = userPosition ? [userPosition.latitude, userPosition.longitude] : [0, 0]
  const [editingLocationId, setEditingLocationId] = useState<number | null>(null)
  const [editedPosition, setEditedPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [editedLocationName, setEditedLocationName] = useState("")
  const [localLocations, setLocalLocations] = useState<BookLocationResponse[]>(bookLocations)
  const markerRef = useRef<L.Marker>(null)

  useEffect(() => {
    if (newMarkerPosition && markerRef.current) {
      setTimeout(() => {
        markerRef.current?.openPopup()
      }, 0)
    }
  }, [newMarkerPosition])

  async function handleSaveEditedLocation(bookId: string, locationId: number) {
    if (!editedPosition || !editedLocationName.trim()) return

    try {
      await updateBookLocation(bookId, String(locationId), {
        latitude: editedPosition.lat,
        longitude: editedPosition.lng,
        locationName: editedLocationName.trim()
      })

      setEditingLocationId(null)
      setEditedPosition(null)
      setEditedLocationName("")
      setLocalLocations(prev => prev.map(loc =>
        loc.id === locationId
          ? { ...loc, coordinates: [editedPosition.lat, editedPosition.lng], locationName: editedLocationName.trim() }
          : loc
      ))
      onRefreshLocations()
    } catch (error) {
      console.error("Gagal update lokasi:", error)
    }
  }


  async function handleDeleteLocation(bookId: string, locationId: number) {
    try {
      await deleteBookLocation(bookId, locationId)
      onRefreshLocations()
      } catch (err) {
    if (err instanceof ApiError) {
      console.error("API error:", err.message)
    } else {
      console.error("Error tak dikenal:", err)
    }
  }
  }

  useEffect(() => {
    setLocalLocations(bookLocations)
  }, [bookLocations])

  return (
    <div style={{ position: 'relative' }}>
      <MapContainer
        center={center}
        zoom={2}
        style={{ height: '85vh', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {newMarkerPosition && (
          <Marker
            ref={markerRef}
            position={[newMarkerPosition.latitude, newMarkerPosition.longitude]}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target
                const position = marker.getLatLng()
                dispatch(setNewMarkerPosition({ latitude: position.lat, longitude: position.lng}))
              }
            }}
          >
            <Popup>
              <p className="font-medium">Lokasi baru (geser pin ini)</p>
              <p className="italic">Gunakan tombol di kanan atas peta untuk menyimpan atau membatalkan.</p>
            </Popup>
          </Marker>
        )}

        {userPosition.latitude && userPosition.longitude && (
          <>
            {userPosition.gps && (
              <Marker
                position={[userPosition.latitude, userPosition.longitude]}
                icon={redIcon}
              >
                <Popup>Lokasi Anda</Popup>
              </Marker>
            )}
            <SetViewTo userPosition={userPosition} />
          </>
        )}

        {localLocations
          .filter(location => location.coordinates[0] !== undefined && location.coordinates[1] !== undefined)
          .map((location) => (
            <Marker
              key={location.id}
              position={
                editingLocationId === location.id && editedPosition
                ? [editedPosition.lat, editedPosition.lng]
                : [location.coordinates[0], location.coordinates[1]]
              }
              draggable={!!(token && location.id === editingLocationId)}
              eventHandlers={
                token && location.id === editingLocationId
                  ? {
                      dragend: (e) => {
                        const marker = e.target
                        const pos = marker.getLatLng()
                        setEditedPosition({ lat: pos.lat, lng: pos.lng })
                      }
                    }
                  : {}
              }
            >
              <Popup>
                <div>
                  <p className="font-semibold">Lokasi: {location.locationName}</p>
                  {token && (
                    <>
                      {editingLocationId === location.id ? (
                          <>
                            <input
                              className="border p-1 text-sm w-full mt-1"
                              value={editedLocationName}
                              onChange={(e) => setEditedLocationName(e.target.value)}
                            />

                            <button
                              className="mt-2 mr-2 text-blue-600 text-sm hover:underline"
                              onClick={() => handleSaveEditedLocation(selectedBook!.id, location.id)}
                            >
                              Simpan Lokasi
                            </button>
                          </>
                        ) : (
                          <button
                            className="mt-2 mr-2 text-blue-600 text-sm hover:underline"
                            onClick={() => {
                              setEditingLocationId(location.id)
                              setEditedPosition({ lat: location.coordinates[0], lng: location.coordinates[1] })
                              setEditedLocationName(location.locationName)
                            }}
                          >
                            Edit
                          </button>
                        )}
                      <button
                        className="mt-2 text-red-600 text-sm hover:underline"
                        onClick={() => handleDeleteLocation(selectedBook!.id, location.id)}
                      >
                        Hapus
                      </button>
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
        ))}

        <FlyToLocation
          trigger={flyToTrigger}
        />
        <CustomZoomControl />
      </MapContainer>
      {children}
    </div>
  )
}
