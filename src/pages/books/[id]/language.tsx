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
import { getLanguages } from '@/api/languages.ts'
import type { UpdateBookRequest } from '@/dto/UpdateBookRequest.ts'

const MAX_LANGUAGE_LENGTH = 50

export default function BookUpdateLanguagePage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const book = (location.state?.value) as UpdateBookRequest
  const [language, setLanguage] = useState(book?.language || '')
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

  const validateLanguage = useCallback(() => {
    if (!language.trim()) return 'Bahasa tidak boleh kosong'
    else if (language.length > MAX_LANGUAGE_LENGTH) return `Bahasa tidak boleh lebih dari ${MAX_LANGUAGE_LENGTH} karakter`
    return ''
  }, [language])

  const errorMessage = useMemo(() => {
    if (!touched && !submitAttempted) return ''
    return validateLanguage()
  }, [language, touched, submitAttempted])

  const isValid = useMemo(() => errorMessage === '', [errorMessage])

  const handleLanguageChange = useCallback((value: string) => {
    setLanguage(value)
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
      await updateBook(id, { language })
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
  }, [language, isValid, id, navigate, book])

  return (
    <PrivateRoute>
      <div className="px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Navbar />
        <div className="max-w-4xl mx-auto py-8">

        <UpdateFieldForm
          to={`/books/${id}`}
          isSuccess={isSuccess}
          onSubmit={handleSubmit}
          buttonText="Simpan"
          title="Edit Bahasa"
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
            label="Bahasa"
            name="language"
            value={language}
            onChange={handleLanguageChange}
            fetchSuggestions={getLanguages}
            placeholder="Masukkan bahasa buku (misal: Indonesia)"
            hasError={!!errorMessage}
            validation={errorMessage && <TextInputError message={errorMessage} />}
          />
        </UpdateFieldForm>
      </div>
      </div>
      </div>
    </PrivateRoute>
  )
}
