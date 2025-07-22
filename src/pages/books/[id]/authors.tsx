import { useLocation, useNavigate, useParams } from 'react-router-dom'
import PrivateRoute from '@/PrivateRoute.tsx'
import Navbar from '@/components/Navbar.tsx'
import { updateBook } from '@/api/books.ts'
import { ApiError } from '@/exception/ApiError.ts'
import { useEffect, useState } from 'react'
import UpdateFieldForm from '@/components/UpdateFieldForm.tsx'
import AutocompleteInput from '@/components/AutocompleteInput.tsx'
import Tooltip from '@/components/Tooltip.tsx'
import { Info } from 'lucide-react'
import { getAuthors } from '@/api/authors.ts'
import type { BookRequestDTO } from '@/dto/BookRequestDTO'

export default function BookUpdateAuthorsPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const book = (location.state?.value || null) as BookRequestDTO | null
  const [authorNames, setAuthorNames] = useState(book?.authorNames.join(', ') || '')
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

    if (!authorNames.trim()) {
      setMessage('Penulis tidak boleh kosong!')
      return
    }

    try {
      await updateBook(id, { ...book, authorNames: authorNames.split(',').map(name => name.trim()) })
      setMessage('Penulis berhasil diperbarui!')
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
        <UpdateFieldForm onSubmit={handleSubmit} buttonText="Simpan" title="Edit Penulis">
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
        </UpdateFieldForm>
      </>
    </PrivateRoute>
  )
}
