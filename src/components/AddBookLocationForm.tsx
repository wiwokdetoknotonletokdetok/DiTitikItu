import { useState } from 'react'
import { postBookLocation } from '@/api/bookLocation' 
import { ApiError } from '@/exception/ApiError'

type AddBookLocationFormProps = {
  bookId: string
  onSuccess: () => void 
}

export default function AddBookLocationForm({ bookId, onSuccess }: AddBookLocationFormProps) {
  const [locationName, setLocationName] = useState('')
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await postBookLocation(bookId, {
        locationName,
        latitude: parseFloat(lat),
        longitude: parseFloat(lng)
      })
      setMessage('Berhasil menambahkan lokasi!')
      setLocationName('')
      setLat('')
      setLng('')
      onSuccess()
    } catch (err) {
      console.error(err)
      if (err instanceof ApiError) {
        setMessage(err.message)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-4">
      <input
        type="text"
        placeholder="Nama Lokasi"
        value={locationName}
        onChange={(e) => setLocationName(e.target.value)}
        required
        className="border rounded p-1 w-full"
      /> <br />
      <div className="flex space-x-2">
        <input
          type="number"
          step="any"
          placeholder="Latitude"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          className="border rounded p-1 w-1/2"
        />
        <input
          type="number"
          step="any"
          placeholder="Longitude"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          className="border rounded p-1 w-1/2"
        />
      </div> <br />
      <button type="submit" className="bg-[#1E497C] text-white px-3 py-1 rounded hover:bg-[#5C8BC1]">
        Tambah Lokasi
      </button>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </form>
  )
}
