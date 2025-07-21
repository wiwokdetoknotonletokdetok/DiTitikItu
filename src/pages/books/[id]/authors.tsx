import {useParams, useLocation, useNavigate} from 'react-router-dom'
import PrivateRoute from '@/PrivateRoute.tsx'
import Navbar from '@/components/Navbar.tsx'
import { updateBook } from '@/api/books.ts'
import { ApiError } from '@/exception/ApiError.ts'
import { useEffect, useState } from 'react'
import UpdateBookFieldForm from '@/components/UpdateBookFieldForm.tsx'
import AutocompleteInput from '@/components/AutocompleteInput.tsx'
import Tooltip from '@/components/Tooltip.tsx'
import {Info} from 'lucide-react'
import {getAuthors} from '@/api/authors.ts'

export default function BookUpdateAuthorsPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const value = location.state?.value || ''
  const [authorNames, setAuthorNames] = useState(value)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!location.state?.value) {
      navigate(`/books/${id}`)
    }
  }, [location.state?.value, id, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!authorNames.trim()) {
      setMessage('Penulis tidak boleh kosong!')
      return
    }

    try {
      await updateBook(id, { authorNames: authorNames.split(',').map(name => name.trim()) })
      setMessage('Penulis berhasil diperbarui!')
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
        <UpdateBookFieldForm onSubmit={handleSubmit} buttonText="Simpan" title="Penulis">
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
        </UpdateBookFieldForm>
      </>
    </PrivateRoute>
  )
}
