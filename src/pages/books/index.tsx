import { useState } from 'react'
import { createBook } from '@/api/books'
import { ApiError } from '@/exception/ApiError'
import { useNavigate } from 'react-router-dom'
import PrivateRoute from '@/PrivateRoute.tsx'
import TextInput from '@/components/TextInput.tsx'
import Navbar from '@/components/Navbar.tsx'
import TextArea from '@/components/TextArea.tsx'
import SubmitButton from '@/components/SubmitButton.tsx'
import AutocompleteInput from '@/components/AutocompleteInput.tsx'
import { getAuthors } from '@/api/authors.ts'
import { getLanguages } from '@/api/languages.ts'
import { getPublishers } from '@/api/publishers.ts'
import Tooltip from '@/components/Tooltip.tsx'
import { Info } from 'lucide-react'
import SelectGenre from '@/components/SelectGenre.tsx'
import { getGenres } from '@/api/genres.ts'

export default function NewBookPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    synopsis: '',
    bookPicture: 'https://placehold.co/300x450?text=Book',
    totalPages: '',
    publishedYear: '',
  })

  const [isbn, setIsbn] = useState('')
  const [language, setLanguage] = useState('')
  const [publisherName, setPublisherName] = useState('')
  const [authorNames, setAuthorNames] = useState('')
  const [genreId, setGenreId] = useState('')

  const [message, setMessage] = useState('')
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createBook({
        ...form,
        isbn: isbn,
        language: language,
        publisherName: publisherName,
        authorNames: authorNames.split(',').map(name => name.trim()),
        genreIds: [parseInt(genreId)],
        totalPages: parseInt(form.totalPages),
        publishedYear: parseInt(form.publishedYear),
      })
      navigate('/')
    } catch (err) {
      console.error(err)
      if (err instanceof ApiError) {
        setMessage(err.message)
      }
    }
  }

  function formatISBN(value: string) {
    const cleaned = value.replace(/[^0-9Xx]/g, '')

    if (cleaned.length <= 3) return cleaned
    if (cleaned.length <= 4) return `${cleaned.slice(0,3)}-${cleaned.slice(3)}`
    if (cleaned.length <= 6) return `${cleaned.slice(0,3)}-${cleaned.slice(3,4)}-${cleaned.slice(4)}`
    if (cleaned.length <= 12) return `${cleaned.slice(0,3)}-${cleaned.slice(3,4)}-${cleaned.slice(4,6)}-${cleaned.slice(6)}`
    if (cleaned.length <= 13) return `${cleaned.slice(0,3)}-${cleaned.slice(3,4)}-${cleaned.slice(4,6)}-${cleaned.slice(6,12)}-${cleaned.slice(12)}`

    return cleaned
  }

  const MAX_ISBN_LENGTH = 17

  const handleIsbnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value

    if (val.length > MAX_ISBN_LENGTH) {
      val = val.slice(0, MAX_ISBN_LENGTH)
    }

    const formatted = formatISBN(val)
    setIsbn(formatted)
  }

  return (
    <PrivateRoute>
      <>
        <Navbar/>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Tambah Buku Baru</h1>
          {message && <p className="mt-4 text-[#E53935] font-semibold">{message}</p>}

          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <TextInput
              label="Judul"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Masukkan judul buku"
            />

            <TextInput
              label="ISBN"
              name="isbn"
              value={isbn}
              onChange={handleIsbnChange}
              placeholder="Masukkan ISBN buku (contoh: 978-1-23-456789-0)"
            />

            <TextArea
              label="Sinopsis"
              name="synopsis"
              value={form.synopsis}
              onChange={handleChange}
              placeholder="Ringkas sinopsis buku"
            />

            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="Jumlah halaman"
                name="totalPages"
                value={form.totalPages}
                onChange={handleChange}
                placeholder="(misal: 100)"
              />
              <TextInput
                label="Tahun terbit"
                name="publishedYear"
                value={form.publishedYear}
                onChange={handleChange}
                placeholder="(misal: 2025)"
              />
            </div>

            <AutocompleteInput
              label="Bahasa"
              name="language"
              value={language}
              onChange={setLanguage}
              fetchSuggestions={getLanguages}
              placeholder="Masukkan bahasa buku (misal: Indonesia)"
            />

            <AutocompleteInput
              label="Penerbit"
              name="publisherName"
              value={publisherName}
              onChange={setPublisherName}
              fetchSuggestions={getPublishers}
              placeholder="Masukkan nama penerbit"
            />

            <AutocompleteInput
              label={
                <div className="flex items-center">
                  <span>Penulis</span>
                  <Tooltip message="Jika lebih dari satu, pisahkan dengan koma">
                    <Info size={12} className="ml-1 text-gray-500"/>
                  </Tooltip>
                </div>
              }
              name="authorNames"
              value={authorNames}
              onChange={setAuthorNames}
              fetchSuggestions={getAuthors}
              placeholder="Masukkan nama penulis, pisahkan dengan koma"
              multi
            />

            <SelectGenre
              label="Genre"
              name="genre"
              value={genreId}
              onChange={e => setGenreId(e.target.value)}
              placeholder="Pilih genre"
              fetchOptions={getGenres}
            />

            <SubmitButton type="submit">
              Simpan buku
            </SubmitButton>
          </form>
        </div>
      </>
    </PrivateRoute>
  )
}
