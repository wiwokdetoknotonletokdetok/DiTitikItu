import {MapContainer, Marker, Popup, TileLayer, useMap} from 'react-leaflet'
import {useEffect, useState} from 'react'
import 'leaflet/dist/leaflet.css'
import type { UserPosition } from '@/dto/UserPosition.ts'
import type { BookLocationResponse } from '@/dto/BookLocationResponse.ts'
import FlyToLocation from '@/components/FlyToLocation.tsx'
import { Plus, Minus } from 'lucide-react'
import {ApiError} from "@/exception/ApiError.ts";
import {deleteBookLocation, updateBookLocation} from "@/api/bookLocation.ts";
import type {BookResponseDTO} from "@/dto/BookResponseDTO.ts";
import { useAuth } from '@/context/AuthContext'

function SetViewTo({ position }) {
  const map = useMap()
  useEffect(() => {
    if (position) {
      map.setView(position, 16)
    }
  }, [])
  return null
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
  selectedBook: BookResponseDTO | null
  bookLocations: BookLocationResponse[]
  userPosition: UserPosition
  flyToLocation?: { latitude: number, longitude: number } | null
  flyToTrigger: number
  children?: React.ReactNode
  newMarkerPosition?: { lat: number; lng: number } | null
  onUpdateNewMarkerPosition?: (pos: { lat: number; lng: number }) => void
  onRefreshLocations: () => void
}

export default function MapView({ flyToTrigger, selectedBook, newMarkerPosition, onUpdateNewMarkerPosition, children, bookLocations, userPosition, flyToLocation, onRefreshLocations }: MapViewProps) {
  const center = userPosition ? [userPosition.latitude, userPosition.longitude] : [0, 0]
  const { token } = useAuth()
  const [editingLocationId, setEditingLocationId] = useState<number | null>(null)
  const [editedPosition, setEditedPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [editedLocationName, setEditedLocationName] = useState("")
  const [localLocations, setLocalLocations] = useState<BookLocationResponse[]>(bookLocations)

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
        zoom={userPosition ? 16 : 2}
        style={{ height: '85vh', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {newMarkerPosition && (
          <Marker
            position={[newMarkerPosition.lat, newMarkerPosition.lng]}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target
                const position = marker.getLatLng()
                onUpdateNewMarkerPosition?.({ lat: position.lat, lng: position.lng })
              }
            }}
          >
            <Popup>Lokasi baru (geser pin ini)</Popup>
          </Marker>
        )}

        {userPosition && (
          <>
            <Marker position={[userPosition.latitude, userPosition.longitude]}>
              <Popup>Lokasi Anda</Popup>
            </Marker>
            <SetViewTo position={[userPosition.latitude, userPosition.longitude]}/>
          </>
        )}

        {localLocations
          .filter(location => location.coordinates[0] !== undefined && location.coordinates[1] !== undefined)
          .map(location => (
            <Marker
              key={location.id}
              position={
                editingLocationId === location.id && editedPosition
                ? [editedPosition.lat, editedPosition.lng]
                : [location.coordinates[0], location.coordinates[1]]
              }
              draggable={token && location.id === editingLocationId} // hanya bisa drag saat edit
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

        {flyToLocation && (
          <FlyToLocation
            latitude={flyToLocation.latitude}
            longitude={flyToLocation.longitude}
            trigger={flyToTrigger}
          />
        )}
        <CustomZoomControl />
      </MapContainer>
      {children}
    </div>
  )
}
