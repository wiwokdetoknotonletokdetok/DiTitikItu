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

export default function BookUpdateIsbnPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const book = (location.state?.value || null) as BookRequestDTO | null
  const [isbn, setIsbn] = useState(book?.isbn || '')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!book) {
      navigate(`/books/${id}`)
    }
  }, [book, id, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!id || !book) {
      setError("Data buku tidak tersedia.")
      return
    }

    if (!isValidISBN(isbn)) {
      setError('ISBN yang dimasukkan tidak valid!')
      return
    }

    setError(null)

    try {
      await updateBook(id, { ...book, isbn: isbn })
      console.log('ISBN buku berhasil diperbarui!')
      navigate(`/books/${id}`)
    } catch (err) {
      if (err instanceof ApiError) {
        console.error(err.message)
      } else {
        console.error('Terjadi kesalahan, coba lagi nanti.')
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

  function isValidISBN(isbn: string): boolean {
    const cleaned = isbn.replace(/[^0-9Xx]/g, '')

    if (cleaned.length === 13) {
      return isValidISBN13(cleaned)
    }

    if (cleaned.length === 10) {
      return isValidISBN10(cleaned)
    }

    return false
  }

  function isValidISBN10(isbn: string): boolean {
    if (isbn.length !== 10) return false

    let sum = 0
    for (let i = 0; i < 9; i++) {
      const digit = parseInt(isbn[i], 10)
      if (isNaN(digit)) return false
      sum += (digit * (10 - i))
    }

    const lastChar = isbn[9].toUpperCase()
    if (lastChar !== 'X' && isNaN(parseInt(lastChar, 10))) return false

    sum += (lastChar === 'X' ? 10 : parseInt(lastChar, 10))

    return sum % 11 === 0
  }

  function isValidISBN13(isbn: string): boolean {
    if (isbn.length !== 13) return false

    let sum = 0
    for (let i = 0; i < 13; i++) {
      const digit = parseInt(isbn[i], 10)
      if (isNaN(digit)) return false

      sum += (i % 2 === 0) ? digit : (digit * 3)
    }

    return sum % 10 === 0
  }

  return (
    <PrivateRoute>
      <>
        <Navbar />
        <UpdateFieldForm onSubmit={handleSubmit} buttonText="Simpan" title="Edit ISBN">
          <TextInput
            name="isbn"
            label="ISBN"
            placeholder="Masukkan ISBN buku (contoh: 978-1-23-456789-0)"
            value={isbn}
            onChange={(e) => handleIsbnChange(e)}
            hasError={error !== null}
            validation={error ? <TextInputError message={error} /> : null}
          />
        </UpdateFieldForm>
      </>
    </PrivateRoute>
  )
}
