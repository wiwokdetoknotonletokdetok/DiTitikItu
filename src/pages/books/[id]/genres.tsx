import { useLocation, useNavigate, useParams } from 'react-router-dom'
import PrivateRoute from '@/PrivateRoute.tsx'
import Navbar from '@/components/Navbar.tsx'
import { updateBook } from '@/api/books.ts'
import { ApiError } from '@/exception/ApiError.ts'
import { useCallback, useEffect, useMemo, useState } from 'react'
import UpdateFieldForm from '@/components/UpdateFieldForm.tsx'
import SelectGenre from '@/components/SelectGenre.tsx'
import TextInputError from '@/components/TextInputError.tsx'
import Alert from '@/components/Alert.tsx'
import { getGenres } from '@/api/genres.ts'
import type { UpdateBookRequest } from '@/dto/UpdateBookRequest.ts'

export default function BookUpdateGenresPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const book = (location.state?.value) as UpdateBookRequest
  const [genreId, setGenreId] = useState<string>(book?.genreIds ? book?.genreIds[0]?.toString() : '')
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

  const validateGenre = useCallback(() => {
    if (!genreId || genreId.trim() === '') return 'Genre tidak boleh kosong!'
    return ''
  }, [genreId])

  const errorMessage = useMemo(() => {
    if (!touched && !submitAttempted) return ''
    return validateGenre()
  }, [genreId, touched, submitAttempted])

  const isValid = useMemo(() => errorMessage === '', [errorMessage])

  const handleGenreChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setGenreId(e.target.value)
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
      await updateBook(id, { genreIds: [parseInt(genreId)] })
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
  }, [genreId, isValid, id, navigate, book])

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
          title="Edit Genre"
          isLoading={isLoading}
          isValid={isValid}
        >
          {apiMessage && (
            <Alert
              message={apiMessage}
              onClose={() => setApiMessage('')}
            />
          )}
          <SelectGenre
            label="Genre"
            name="genre"
            value={genreId}
            onChange={handleGenreChange}
            placeholder="Pilih genre"
            fetchOptions={getGenres}
          />
          {errorMessage && <TextInputError message={errorMessage} />}
        </UpdateFieldForm>
      </div>
      </div>
      </div>
    </PrivateRoute>
  )
}
