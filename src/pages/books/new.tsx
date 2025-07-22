import { useState } from 'react'
import { createBook } from '@/api/books'
import { ApiError } from '@/exception/ApiError'
import { useNavigate } from 'react-router-dom'
import PrivateRoute from '@/PrivateRoute.tsx'

export default function NewBookPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    isbn: '',
    title: '',
    synopsis: '',
    bookPicture: 'https://placehold.co/300x450?text=Book',
    totalPages: 0,
    publishedYear: 0,
    language: '',
    publisherName: '',
    authorNames: '',
    genreIds: [] as number[],
  })

  const GENRE_OPTIONS = [
    'horror',
    'fantasi',
    'Fiksi',
    'Non-Fiksi',
    'Sejarah',
    'Romansa',
    'Sains',
    'Biografi',
  ]
  
  const [message, setMessage] = useState('')
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createBook({
        ...form,
        authorNames: form.authorNames.split(',').map(name => name.trim()),
        genreIds: form.genreIds, 
        totalPages: Number(form.totalPages),
        publishedYear: Number(form.publishedYear),
      })
      navigate('/')
    } catch (err) {
      console.error(err)
      if (err instanceof ApiError) {
        setMessage(err.message)
      }
    }
  }

  return (
    <PrivateRoute>
      <div className="p-6 sm:p-6 bg-[#FAFAFA] min-h-screen">
        <div className='max-w-7xl mx-auto'>
          <h1 className="text-2xl font-bold mb-4 text-[#1C2C4C]">📖 Tambah Buku Baru</h1>

          {message && <p className="mt-4 text-[#E53935] font-semibold">{message}</p>}

          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md border border-[#A5D6A7]">
            {/* Title */}
            <div>
              <label className="block text-sm text-[#1C2C4C] mb-1">Judul:</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full border border-[#1E497C] rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#1E497C]"
              />
            </div>

            {/* ISBN */}
            <div>
              <label className="block text-sm text-[#1C2C4C] mb-1">ISBN:</label>
              <input
                name="isbn"
                value={form.isbn}
                onChange={handleChange}
                className="w-full border border-[#1E497C] rounded p-2"
              />
            </div>

            {/* Sinopsis */}
            <div>
              <label className="block text-sm text-[#1C2C4C] mb-1">Sinopsis:</label>
              <textarea
                name="synopsis"
                value={form.synopsis}
                onChange={handleChange}
                className="w-full h-40 border border-[#1E497C] rounded p-2 resize-none"
              />
            </div>


            {/* Halaman & Tahun */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#1C2C4C] mb-1">Jumlah Halaman:</label>
                <input
                  name="totalPages"
                  type="number"
                  value={form.totalPages}
                  onChange={handleChange}
                  className="w-full border border-[#1E497C] rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm text-[#1C2C4C] mb-1">Tahun Terbit:</label>
                <input
                  name="publishedYear"
                  type="number"
                  value={form.publishedYear}
                  onChange={handleChange}
                  className="w-full border border-[#1E497C] rounded p-2"
                />
              </div>
            </div>

            {/* Bahasa */}
            <div>
              <label className="block text-sm text-[#1C2C4C] mb-1">Bahasa:</label>
              <input
                name="language"
                value={form.language}
                onChange={handleChange}
                className="w-full border border-[#1E497C] rounded p-2"
              />
            </div>

            {/* Penerbit */}
            <div>
              <label className="block text-sm text-[#1C2C4C] mb-1">Nama Penerbit:</label>
              <input
                name="publisherName"
                value={form.publisherName}
                onChange={handleChange}
                className="w-full border border-[#1E497C] rounded p-2"
              />
            </div>

            {/* Penulis */}
            <div>
              <label className="block text-sm text-[#1C2C4C] mb-1">Penulis (pisahkan dengan koma):</label>
              <input
                name="authorNames"
                value={form.authorNames}
                onChange={handleChange}
                className="w-full border border-[#1E497C] rounded p-2"
              />
            </div>

            {/* Genre Checkboxes */}
            <div>
              <p className="text-sm font-medium text-[#1C2C4C] mb-1">Genre:</p>
              <div className="grid grid-cols-2 gap-2">
                {GENRE_OPTIONS.map((genre, index) => {
                  const value = index + 1
                  return (
                    <label key={index} className="flex items-center text-sm text-[#1C2C4C]">
                      <input
                        type="checkbox"
                        value={value}
                        onChange={(e) => {
                          const checked = e.target.checked
                          setForm((prev) => ({
                            ...prev,
                            genreIds: checked
                              ? [...prev.genreIds, value]
                              : prev.genreIds.filter((id) => id !== value),
                          }))
                        }}
                        className="mr-2 accent-[#2E7D32]"
                      />
                      {genre}
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit"
                    className="bg-[#1E497C] hover:bg-[#1C2C4C] text-white px-6 py-2 rounded shadow transition">
              + Tambah Buku
            </button>
          </form>
        </div>
      </div>
    </PrivateRoute>
  )
}
