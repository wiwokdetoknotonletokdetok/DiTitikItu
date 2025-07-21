import { useParams, useLocation, useNavigate } from 'react-router-dom'
import PrivateRoute from '@/PrivateRoute.tsx'
import Navbar from '@/components/Navbar.tsx'
import { updateBook } from '@/api/books.ts'
import { ApiError } from '@/exception/ApiError.ts'
import { useEffect, useState } from 'react'
import UpdateBookFieldForm from '@/components/UpdateBookFieldForm.tsx'
import TextArea from '@/components/TextArea.tsx'

export default function BookUpdateSynopsisPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const value = location.state?.value
  const [synopsis, setSynopsis] = useState(value)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!location.state?.value) {
      navigate(`/books/${id}`)
    }
  }, [location.state?.value, id, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!synopsis.trim()) {
      setMessage('Sinopsis buku tidak boleh kosong!')
      return
    }

    try {
      await updateBook(id, { synopsis: synopsis })
      setMessage('Sinopsis buku berhasil diperbarui!')
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
        <UpdateBookFieldForm onSubmit={handleSubmit} buttonText="Simpan" title="Sinopsis">
        <TextArea
          name="synopsis"
          label="Sinopsis"
          placeholder="Ringkas sinopsis buku"
          value={synopsis}
          onChange={(e) => setSynopsis(e.target.value)}
        />
      </UpdateBookFieldForm>
      </>
    </PrivateRoute>
  )
}
