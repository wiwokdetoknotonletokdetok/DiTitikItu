import { useLocation, useNavigate, useParams } from 'react-router-dom'
import PrivateRoute from '@/PrivateRoute.tsx'
import Navbar from '@/components/Navbar.tsx'
import { updateBook } from '@/api/books.ts'
import { ApiError } from '@/exception/ApiError.ts'
import { useEffect, useState } from 'react'
import UpdateFieldForm from '@/components/UpdateFieldForm.tsx'
import AutocompleteInput from '@/components/AutocompleteInput.tsx'
import { getPublishers } from '@/api/publishers.ts'

export default function BookUpdatePublisherPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const value = location.state?.value || ''
  const [publisher, setPublisher] = useState(value)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!location.state?.value) {
      navigate(`/books/${id}`)
    }
  }, [location.state?.value, id, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!publisher.trim()) {
      setMessage('Penerbit tidak boleh kosong!')
      return
    }

    try {
      await updateBook(id, { publisherName: publisher })
      setMessage('Publisher berhasil diperbarui!')
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
        <UpdateFieldForm onSubmit={handleSubmit} buttonText="Simpan" title="Edit Penerbit">
          <AutocompleteInput
            label="Penerbit"
            name="publisher"
            value={publisher}
            onChange={setPublisher}
            fetchSuggestions={getPublishers}
            placeholder="Masukkan nama penerbit"
          />
        </UpdateFieldForm>
      </>
    </PrivateRoute>
  )
}
