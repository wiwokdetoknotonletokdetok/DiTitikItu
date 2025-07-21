import { useParams, useLocation, useNavigate } from 'react-router-dom'
import PrivateRoute from '@/PrivateRoute.tsx'
import Navbar from '@/components/Navbar.tsx'
import { updateBook } from '@/api/books.ts'
import { ApiError } from '@/exception/ApiError.ts'
import {useEffect, useState} from 'react'
import UpdateBookFieldForm from '@/components/UpdateBookFieldForm.tsx'
import TextInput from '@/components/TextInput.tsx'

export default function BookUpdateIsbnPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const value = location.state?.value
  const [isbn, setIsbn] = useState(value)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!location.state?.value) {
      navigate(`/books/${id}`)
    }
  }, [location.state?.value, id, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isbn.trim()) {
      setMessage('ISBN buku tidak boleh kosong!')
      return
    }

    try {
      await updateBook(id, { isbn: isbn })
      setMessage('ISBN buku berhasil diperbarui!')
    } catch (err) {
      if (err instanceof ApiError) {
        setMessage(err.message)
      } else {
        setMessage('Terjadi kesalahan, coba lagi nanti.')
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
        <Navbar />
        <UpdateBookFieldForm onSubmit={handleSubmit} buttonText="Simpan" title="ISBN">
          <TextInput
            name="isbn"
            label="ISBN"
            placeholder="Masukkan ISBN buku (contoh: 978-1-23-456789-0)"
            value={isbn}
            onChange={(e) => handleIsbnChange(e)}
          />
        </UpdateBookFieldForm>
      </>
    </PrivateRoute>
  )
}
