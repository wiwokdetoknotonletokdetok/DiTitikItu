import { useLocation, useNavigate, useParams } from 'react-router-dom'
import PrivateRoute from '@/PrivateRoute.tsx'
import Navbar from '@/components/Navbar.tsx'
import { updateBook } from '@/api/books.ts'
import { ApiError } from '@/exception/ApiError.ts'
import { useEffect, useState } from 'react'
import UpdateFieldForm from '@/components/UpdateFieldForm.tsx'
import TextInput from '@/components/TextInput.tsx'
import type { BookRequestDTO } from '@/dto/BookRequestDTO'

export default function BookUpdateTotalPagesPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const book = (location.state?.value || null) as BookRequestDTO | null
  const [totalPages, setTotalPages] = useState(book?.totalPages.toString() || '')
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!book) {
      navigate(`/books/${id}`)
    }
  }, [book, id, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!id || !book) {
      setMessage("Data buku tidak tersedia.")
      return
    }

    if (!totalPages.trim()) {
      setMessage('Jumlah halaman buku tidak boleh kosong!')
      return
    }

    try {
      await updateBook(id, {...book, totalPages: parseInt(totalPages) })
      setMessage('Jumlah halaman buku berhasil diperbarui!')
      navigate(`/books/${id}`)
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
        <UpdateFieldForm onSubmit={handleSubmit} buttonText="Simpan" title="Edit Jumlah Halaman">
          <TextInput
            name="totalPages"
            label="Jumlah halaman"
            placeholder="Masukkan jumlah halaman buku (misal: 100)"
            value={totalPages}
            onChange={(e) => setTotalPages(e.target.value)}
          />
        </UpdateFieldForm>
      </>
    </PrivateRoute>
  )
}
