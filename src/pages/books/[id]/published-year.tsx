import { useLocation, useNavigate, useParams } from 'react-router-dom'
import PrivateRoute from '@/PrivateRoute.tsx'
import Navbar from '@/components/Navbar.tsx'
import { updateBook } from '@/api/books.ts'
import { ApiError } from '@/exception/ApiError.ts'
import { useCallback, useEffect, useMemo, useState } from 'react'
import UpdateFieldForm from '@/components/UpdateFieldForm.tsx'
import TextInput from '@/components/TextInput.tsx'
import TextInputError from '@/components/TextInputError.tsx'
import Alert from '@/components/Alert.tsx'
import type { UpdateBookRequest } from '@/dto/UpdateBookRequest.ts'
import InnerContainer from '@/components/InnerContainer.tsx'

export default function BookUpdatePublishedYearPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const book = (location.state?.value) as UpdateBookRequest
  const [publishedYear, setPublishedYear] = useState(String(book?.publishedYear) || '')
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

  const validatePublishedYear = useCallback(() => {
    const validYear = /^[1-9][0-9]{3}$/
    const currentYear = new Date().getFullYear()
    if (!publishedYear.trim()) return 'Tahun terbit buku tidak boleh kosong!'
    else if (!validYear.test(publishedYear)) return 'Tahun terbit harus berupa angka 4 digit yang valid!'
    else if (parseInt(publishedYear) > currentYear) return `Tahun terbit tidak boleh lebih dari tahun ${currentYear}!`
    return ''
  }, [publishedYear])

  const errorMessage = useMemo(() => {
    if (!touched && !submitAttempted) return ''
    return validatePublishedYear()
  }, [publishedYear, touched, submitAttempted, validatePublishedYear])

  const isValid = useMemo(() => errorMessage === '', [errorMessage])

  const handlePublishedYearChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPublishedYear(e.target.value)
    setTouched(true)
    setApiMessage('')
    setIsSuccess(false)
  }, [])

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
      await updateBook(id, { publishedYear: parseInt(publishedYear) })
      setIsSuccess(true)
    } catch (err) {
      if (err instanceof ApiError) {
        setApiMessage(err.message)
      } else {
        setApiMessage('Terjadi kesalahan, coba lagi nanti.')
      }
    } finally {
      setIsLoading(false)
    }
  }, [publishedYear, isValid, id, book])

  return (
    <PrivateRoute>
      <Navbar />
      <InnerContainer>
        <UpdateFieldForm
          to={`/books/${id}`}
          isSuccess={isSuccess}
          onSubmit={handleSubmit}
          buttonText="Simpan"
          title="Edit Tahun Terbit"
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
            name="publishedYear"
            label="Tahun terbit"
            placeholder="Masukkan tahun terbit buku (misal: 2025)"
            value={publishedYear}
            onChange={handlePublishedYearChange}
            hasError={!!errorMessage}
            validation={errorMessage && <TextInputError message={errorMessage} />}
          />
        </UpdateFieldForm>
      </InnerContainer>
    </PrivateRoute>
  )
}
