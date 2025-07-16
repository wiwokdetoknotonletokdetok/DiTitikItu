import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchBookById, updateBook } from '@/api/books'
import { ApiError } from '@/exception/ApiError'
import type { BookRequestDTO } from '@/dto/BookRequestDTO'
import type { BookResponseDTO } from '@/dto/BookResponseDTO'

export default function EditBookPage() {
  const { bookId: id } = useParams()
  const navigate = useNavigate()

  const [book, setBook] = useState<BookResponseDTO | null>(null)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState<BookRequestDTO>({
    isbn: '',
    title: '',
    synopsis: '',
    bookPicture: '',
    totalPages: 0,
    publishedYear: 0,
    language: '',
    publisherName: '',
    authorNames: [],
    genreIds: [],
  })

  const [authorInput, setAuthorInput] = useState('')

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

  useEffect(() => {
    if (!id) return
    const fetchData = async () => {
      try {
        const data = await fetchBookById(id)
        setBook(data)
        setForm({
          isbn: data.isbn,
          title: data.title,
          synopsis: data.synopsis,
          bookPicture: data.bookPicture,
          totalPages: data.totalPages,
          publishedYear: data.publishedYear,
          language: data.language,
          publisherName: data.publisherName,
          authorNames: data.authorNames,
          genreIds: data.genreNames.map(name => GENRE_OPTIONS.findIndex(opt => opt.toLowerCase() === name.toLowerCase()) + 1),
        })
        console.log('Book data fetched:', data)
        setAuthorInput(data.authorNames.join(', '))
      } catch (err) {
        console.error(err)
        if (err instanceof ApiError) {
          setMessage(err.message)
        }
      }
    }

    fetchData()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    try {
      await updateBook(id, {
        ...form,
        authorNames: authorInput.split(',').map(name => name.trim()),
        totalPages: Number(form.totalPages),
        publishedYear: Number(form.publishedYear),
      })
      navigate('/books')
    } catch (err) {
      console.error(err)
      if (err instanceof ApiError) {
        setMessage(err.message)
      }
    }
  }

  if (!book) return <p className="p-6 text-[#1C2C4C]">Memuat data buku...</p>

  return (
    <div className="p-6 bg-[#FAFAFA] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-[#1C2C4C]">✏️ Edit Buku</h1>

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

        {/* Gambar */}
        <div>
          <label className="block text-sm text-[#1C2C4C] mb-1">URL Gambar:</label>
          <input
            name="bookPicture"
            value={form.bookPicture}
            onChange={handleChange}
            className="w-full border border-[#1E497C] rounded p-2"
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
            value={authorInput}
            onChange={(e) => setAuthorInput(e.target.value)}
            className="w-full border border-[#1E497C] rounded p-2"
          />
        </div>

        {/* Genre Checkboxes */}
        <div>
          <p className="text-sm font-medium text-[#1C2C4C] mb-1">Genre:</p>
          <div className="grid grid-cols-2 gap-2">
            {GENRE_OPTIONS.map((genre, index) => {
              const value = index + 1
              const isChecked = form.genreIds.includes(value)
              return (
                <label key={index} className="flex items-center text-sm text-[#1C2C4C]">
                  <input
                    type="checkbox"
                    value={value}
                    checked={isChecked}
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

        {/* Submit */}
        <button type="submit" className="bg-[#1E497C] hover:bg-[#1C2C4C] text-white px-6 py-2 rounded shadow transition">
          💾 Simpan Perubahan
        </button>
      </form>

      {message && <p className="mt-4 text-[#E53935] font-semibold">{message}</p>}
    </div>
  )
}
