import { useLocation, useNavigate, useParams } from 'react-router-dom'
import PrivateRoute from '@/PrivateRoute.tsx'
import Navbar from '@/components/Navbar.tsx'
import { updateBook } from '@/api/books.ts'
import { ApiError } from '@/exception/ApiError.ts'
import { useEffect, useState } from 'react'
import UpdateFieldForm from '@/components/UpdateFieldForm.tsx'
import TextInput from '@/components/TextInput.tsx'
import TextInputError from '@/components/TextInputError.tsx'
import type { BookRequestDTO } from '@/dto/BookRequestDTO'

export default function BookUpdateTitlePage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const book = (location.state?.value || null) as BookRequestDTO | null
  const [title, setTitle] = useState(book?.title || '')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!location.state?.value) {
      navigate(`/books/${id}`)
    }
  }, [book, id, navigate])

  const validateTitle = (title: string) => {
    if (title.trim().length === 0) {
      return 'Judul buku tidak boleh kosong'
    }
    if (title.length < 3) {
      return 'Judul buku harus memiliki setidaknya 3 karakter'
    }
    if (title.length > 100) {
      return 'Judul buku tidak boleh lebih dari 100 karakter'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!id || !book) {
      setError("Data buku tidak tersedia.")
      return
    }

    const validationError = validateTitle(title)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)

    try {
      await updateBook(id, { ...book, title: title })
      console.log('Judul buku berhasil diperbarui!')
      navigate(`/books/${id}`)
    } catch (err) {
      if (err instanceof ApiError) {
        console.error(err.message)
      } else {
        console.error('Terjadi kesalahan, coba lagi nanti.')
      }
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTitle(value)

    const validationError = validateTitle(value)
    setError(validationError)
  }

  return (
    <PrivateRoute>
      <>
        <Navbar />
        <UpdateFieldForm onSubmit={handleSubmit} buttonText="Simpan" title="Edit Judul Buku">
          <TextInput
            name="title"
            label="Judul buku"
            placeholder="Masukkan judul buku"
            value={title}
            onChange={handleTitleChange}
            hasError={error !== null}
            validation={error ? <TextInputError message={error} /> : null}
          />
        </UpdateFieldForm>
      </>
    </PrivateRoute>
  )
}
