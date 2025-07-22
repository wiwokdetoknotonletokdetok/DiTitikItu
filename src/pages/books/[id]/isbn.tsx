import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import PrivateRoute from '@/PrivateRoute.tsx'
import Navbar from '@/components/Navbar.tsx'
import { updateBook } from '@/api/books.ts'
import { ApiError } from '@/exception/ApiError.ts'
import UpdateFieldForm from '@/components/UpdateFieldForm.tsx'
import TextInput from '@/components/TextInput.tsx'
import TextInputError from '@/components/TextInputError.tsx'
import Alert from '@/components/Alert.tsx'
import type { UpdateBookRequest } from '@/dto/UpdateBookRequest.ts'

const MAX_ISBN_LENGTH = 17

export default function BookUpdateIsbnPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const book = (location.state?.value) as UpdateBookRequest
  const [isbn, setIsbn] = useState(book?.isbn || '')
  const [touched, setTouched] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [apiMessage, setApiMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (!book) {
      navigate(`/books/${id}`)
    }
  }, [book, id, navigate])

  const formatISBN = (value: string) => {
    const cleaned = value.replace(/[^0-9Xx]/g, '')
    if (cleaned.length <= 3) return cleaned
    if (cleaned.length <= 4) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 4)}-${cleaned.slice(4)}`
    if (cleaned.length <= 12) return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6)}`
    if (cleaned.length <= 13) return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 12)}-${cleaned.slice(12)}`
    return cleaned
  }

  const handleIsbnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value
    if (val.length > MAX_ISBN_LENGTH) val = val.slice(0, MAX_ISBN_LENGTH)
    setIsbn(formatISBN(val))
    setTouched(true)
    setApiMessage('')
    setIsSuccess(false)
  }, [])

  const isValidISBN10 = useCallback((isbn: string): boolean => {
    if (isbn.length !== 10) return false
    let sum = 0
    for (let i = 0; i < 9; i++) {
      const digit = parseInt(isbn[i], 10)
      if (isNaN(digit)) return false
      sum += digit * (10 - i)
    }
    const lastChar = isbn[9].toUpperCase()
    if (lastChar !== 'X' && isNaN(Number(lastChar))) return false
    sum += lastChar === 'X' ? 10 : Number(lastChar)
    return sum % 11 === 0
  }, [])

  const isValidISBN13 = useCallback((isbn: string): boolean => {
    if (isbn.length !== 13) return false
    let sum = 0
    for (let i = 0; i < 13; i++) {
      const digit = parseInt(isbn[i], 10)
      if (isNaN(digit)) return false
      sum += i % 2 === 0 ? digit : digit * 3
    }
    return sum % 10 === 0
  }, [])

  const isValidISBN = useCallback((value: string) => {
    const cleaned = value.replace(/[^0-9Xx]/g, '')
    return cleaned.length === 10
      ? isValidISBN10(cleaned)
      : cleaned.length === 13
        ? isValidISBN13(cleaned)
        : false
  }, [isValidISBN10, isValidISBN13])

  const validateIsbn = useCallback(() => {
    const cleanedIsbn = isbn.replace(/[^0-9Xx]/g, '')
    if (!cleanedIsbn) return 'ISBN tidak boleh kosong'
    else if (!isValidISBN(cleanedIsbn)) return 'ISBN tidak valid'
    return ''
  }, [isbn, isValidISBN])

  const errorMessage = useMemo(() => {
    if (!touched && !submitAttempted) return ''
    return validateIsbn()
  }, [isbn, touched, submitAttempted, validateIsbn])

  const isValid = useMemo(() => errorMessage === '', [errorMessage])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitAttempted(true)

    if (!id) {
      setApiMessage('Data buku tidak tersedia.')
      return
    }

    if (!isValid) return

    setIsLoading(true)
    try {
      await updateBook(id, { isbn })
      setIsSuccess(true)
    } catch (err) {
      if (err instanceof ApiError) {
        setApiMessage(err.message)
      } else {
        setApiMessage('Terjadi kesalahan. Silakan coba lagi.')
      }
    } finally {
      setIsLoading(false)
    }
  }, [isbn, isValid, id, navigate])

  return (
    <PrivateRoute>
      <>
        <Navbar />
        <UpdateFieldForm
          isSuccess={isSuccess}
          onSubmit={handleSubmit}
          buttonText="Simpan"
          title="Edit ISBN"
          isLoading={isLoading}
          isValid={isValid}
        >
          {apiMessage && (
            <Alert
              type="error"
              message={apiMessage}
              onClose={() => setApiMessage('')}
            />
          )}
          <TextInput
            name="isbn"
            label="ISBN"
            placeholder="Masukkan ISBN buku (contoh: 978-1-23-456789-7)"
            value={isbn}
            onChange={handleIsbnChange}
            hasError={!!errorMessage}
            validation={errorMessage && <TextInputError message={errorMessage} />}
          />
        </UpdateFieldForm>
      </>
    </PrivateRoute>
  )
}
