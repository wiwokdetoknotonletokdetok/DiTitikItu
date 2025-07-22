import { useLocation, useNavigate, useParams } from 'react-router-dom'
import PrivateRoute from '@/PrivateRoute.tsx'
import Navbar from '@/components/Navbar.tsx'
import { updateBook } from '@/api/books.ts'
import { ApiError } from '@/exception/ApiError.ts'
import { useEffect, useState } from 'react'
import UpdateFieldForm from '@/components/UpdateFieldForm.tsx'
import TextArea from '@/components/TextArea.tsx'
import type { BookRequestDTO } from '@/dto/BookRequestDTO'

export default function BookUpdateSynopsisPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const book = (location.state?.value || null) as BookRequestDTO | null
  const [synopsis, setSynopsis] = useState(book?.synopsis || '')
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

    if (!synopsis.trim()) {
      setMessage('Sinopsis buku tidak boleh kosong!')
      return
    }

    try {
      await updateBook(id, {
        ...book,
        synopsis: synopsis.trim(),
      })
      setMessage('Sinopsis buku berhasil diperbarui!')
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
        <UpdateFieldForm onSubmit={handleSubmit} buttonText="Simpan" title="Edit Sinopsis">
        <TextArea
          name="synopsis"
          label="Sinopsis"
          placeholder="Ringkas sinopsis buku"
          value={synopsis}
          onChange={(e) => setSynopsis(e.target.value)}
        />
      </UpdateFieldForm>
      </>
    </PrivateRoute>
  )
}
