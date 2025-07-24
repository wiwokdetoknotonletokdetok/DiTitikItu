import { useLocation, useNavigate, useParams } from 'react-router-dom'
import PrivateRoute from '@/PrivateRoute.tsx'
import Navbar from '@/components/Navbar.tsx'
import { updateBook } from '@/api/books.ts'
import { ApiError } from '@/exception/ApiError.ts'
import { useCallback, useEffect, useMemo, useState } from 'react'
import UpdateFieldForm from '@/components/UpdateFieldForm.tsx'
import TextArea from '@/components/TextArea.tsx'
import TextInputError from '@/components/TextInputError.tsx'
import Alert from '@/components/Alert.tsx'
import type { UpdateBookRequest } from '@/dto/UpdateBookRequest.ts'

export default function BookUpdateSynopsisPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const book = (location.state?.value) as UpdateBookRequest
  const [synopsis, setSynopsis] = useState(book?.synopsis || '')
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

  const validateSynopsis = useCallback(() => {
    if (!synopsis.trim()) return 'Sinopsis buku tidak boleh kosong!'
    else if (synopsis.length > 400) return 'Sinopsis buku tidak boleh lebih dari 400 karakter!'
    return ''
  }, [synopsis])

  const errorMessage = useMemo(() => {
    if (!touched && !submitAttempted) return ''
    return validateSynopsis()
  }, [synopsis, touched, submitAttempted, validateSynopsis])

  const isValid = useMemo(() => errorMessage === '', [errorMessage])

  const handleSynopsisChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSynopsis(e.target.value)
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
      await updateBook(id, { synopsis: synopsis.trim() })
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
  }, [synopsis, isValid, id, navigate])

  return (
    <PrivateRoute>
      <div className="px-4 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Navbar />
        <div className="max-w-4xl mx-auto py-8">

        <UpdateFieldForm
          to={`/books/${id}`}
          isSuccess={isSuccess}
          onSubmit={handleSubmit}
          buttonText="Simpan"
          title="Edit Sinopsis"
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
          <TextArea
            name="synopsis"
            label="Sinopsis"
            placeholder="Ringkas sinopsis buku"
            value={synopsis}
            onChange={handleSynopsisChange}
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
