import { useState } from 'react'
import type { BookLocationResponse } from '@/dto/BookLocationResponse'
import { deleteBookLocation, updateBookLocation } from '@/api/bookLocation'
import { ApiError } from '@/exception/ApiError'

export default function BookLocationList({
  locations,
  bookId,
  onRefresh,
}: {
  locations: BookLocationResponse[]
  bookId: string
  onRefresh: () => void
}) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editLat, setEditLat] = useState('')
  const [editLng, setEditLng] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const MAX_VISIBLE = 3

  const startEdit = (loc: BookLocationResponse) => {
    setEditingId(loc.id)
    setEditName(loc.locationName)
    setEditLat(String(loc.coordinates[0]))
    setEditLng(String(loc.coordinates[1]))
  }

  const handleUpdate = async () => {
    if (editingId == null) return
    try {
      await updateBookLocation(bookId, editingId.toString(), {
        locationName: editName,
        latitude: parseFloat(editLat),
        longitude: parseFloat(editLng),
      })
      setEditingId(null)
      onRefresh()
    } catch (e) {
        if (e instanceof ApiError) {
          console.error(e.message)
          setError(e.message || 'Gagal mengambil data user')
        } else {
          setError('Terjadi kesalahan tak terduga')
        }
    }
  }

  const handleDelete = async (id: number) => {
    try {
      console.log('Buku id:', bookId, 'Lokasi id:', id)
      await deleteBookLocation(bookId, id.toString())
      onRefresh()
    } catch (e) {
      if (e instanceof ApiError) {
          setError(e.message || 'Gagal mengambil data user')
        } else {
          setError('Terjadi kesalahan tak terduga')
        }
    }
  }

  return (
    <div className="mt-6">
      {locations.length === 0 ? (
        <p className="text-sm text-gray-500">Belum ada lokasi.</p>
      ) : (
        <>

        <ul className="space-y-4">
          {(showModal ? locations : locations.slice(0, MAX_VISIBLE)).map((loc) => (
          <li key={loc.id} className="border rounded p-3">
            {editingId === loc.id ? (
                <div className="space-y-2">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={editLat}
                      onChange={(e) => setEditLat(e.target.value)}
                      className="border p-1 rounded w-1/2"
                    />
                    <input
                      type="number"
                      value={editLng}
                      onChange={(e) => setEditLng(e.target.value)}
                      className="border p-1 rounded w-1/2"
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleUpdate}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-sm text-gray-500 underline"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
              <>
                <div>
                  <strong>{loc.locationName}</strong> – ({loc.coordinates.join(', ')}){' '}
                  <span className="text-gray-500">({loc.distanceMeters.toFixed(1)} m)</span>
                </div>
                <div className="mt-2 space-x-3">
                  <button onClick={() => startEdit(loc)} className="text-blue-600 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(loc.id)} className="text-red-600 hover:underline">
                    Hapus
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {!showModal && locations.length > MAX_VISIBLE && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowModal(true)}
            className="text-blue-600 hover:underline text-sm"
          >
            Lihat Semua Lokasi ({locations.length})
          </button>
        </div>
      )}
      {showModal && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:underline text-sm"
          >
            Tampilkan Lebih Sedikit
          </button>
        </div>
      )}
      </>
      )}
    </div>
  )
}
