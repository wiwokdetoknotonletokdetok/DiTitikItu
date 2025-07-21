import { useParams, useLocation, useNavigate } from 'react-router-dom'
import PrivateRoute from '@/PrivateRoute.tsx'
import Navbar from '@/components/Navbar.tsx'
import { updateBook } from '@/api/books.ts'
import { ApiError } from '@/exception/ApiError.ts'
import { useEffect, useState } from 'react'
import UpdateBookFieldForm from '@/components/UpdateBookFieldForm.tsx'
import TextInput from '@/components/TextInput.tsx'

export default function BookUpdatePublishedYearPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const value = location.state?.value
  const [publishedYear, setPublishedYear] = useState(value)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!location.state?.value) {
      navigate(`/books/${id}`)
    }
  }, [location.state?.value, id, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!publishedYear.trim()) {
      setMessage('Tahun terbit buku tidak boleh kosong!')
      return
    }

    try {
      await updateBook(id, { publishedYear: parseInt(publishedYear) })
      setMessage('Tahun terbit buku berhasil diperbarui!')
    } catch (err) {
      if (err instanceof ApiError) {
        setMessage(err.message)
      } else {
        setMessage('Terjadi kesalahan, coba lagi nanti.')
      }
    }
  }

  return (
    <PrivateRoute>
      <>
        <Navbar />
        <UpdateBookFieldForm onSubmit={handleSubmit} buttonText="Simpan" title="Tahun Terbit">
          <TextInput
            name="publishedYear"
            label="Tahun terbit"
            placeholder="Masukkan tahun terbit buku (misal: 2025)"
            value={publishedYear}
            onChange={(e) => setPublishedYear(e.target.value)}
          />
        </UpdateBookFieldForm>
      </>
    </PrivateRoute>
  )
}
