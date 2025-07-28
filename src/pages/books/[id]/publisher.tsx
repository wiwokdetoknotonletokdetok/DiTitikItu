import { useLocation, useNavigate, useParams } from 'react-router-dom'
import PrivateRoute from '@/PrivateRoute.tsx'
import Navbar from '@/components/Navbar.tsx'
import { updateBook } from '@/api/books.ts'
import { ApiError } from '@/exception/ApiError.ts'
import { useCallback, useEffect, useMemo, useState } from 'react'
import UpdateFieldForm from '@/components/UpdateFieldForm.tsx'
import AutocompleteInput from '@/components/AutocompleteInput.tsx'
import TextInputError from '@/components/TextInputError.tsx'
import Alert from '@/components/Alert.tsx'
import { getPublishers } from '@/api/publishers.ts'
import type { UpdateBookRequest } from '@/dto/UpdateBookRequest.ts'
import InnerContainer from '@/components/InnerContainer.tsx'

const MAX_PUBLISHER_LENGTH = 50

export default function BookUpdatePublisherPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const book = (location.state?.value) as UpdateBookRequest
  const [publisher, setPublisher] = useState(book?.publisherName || '')
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

  const validatePublisher = useCallback(() => {
    if (!publisher.trim()) return 'Penerbit tidak boleh kosong'
    else if (publisher.length > MAX_PUBLISHER_LENGTH) return `Nama penerbit tidak boleh lebih dari ${MAX_PUBLISHER_LENGTH} karakter`
    return ''
  }, [publisher])

  const errorMessage = useMemo(() => {
    if (!touched && !submitAttempted) return ''
    return validatePublisher()
  }, [publisher, touched, submitAttempted])

  const isValid = useMemo(() => errorMessage === '', [errorMessage])

  const handlePublisherChange = useCallback((value: string) => {
    setPublisher(value)
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
      await updateBook(id, { ...book, publisherName: publisher })
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
  }, [publisher, isValid, id, navigate, book])

  return (
    <PrivateRoute>
      <Navbar />
      <InnerContainer>
        <UpdateFieldForm
          to={`/books/${id}`}
          isSuccess={isSuccess}
          onSubmit={handleSubmit}
          buttonText="Simpan"
          title="Edit Penerbit"
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
          <AutocompleteInput
            label="Penerbit"
            name="publisher"
            value={publisher}
            onChange={handlePublisherChange}
            fetchSuggestions={getPublishers}
            placeholder="Masukkan nama penerbit"
            hasError={!!errorMessage}
            validation={errorMessage && <TextInputError message={errorMessage} />}
          />
        </UpdateFieldForm>
      </InnerContainer>
    </PrivateRoute>
  )
}
