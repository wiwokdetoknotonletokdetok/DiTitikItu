import { useLocation, useNavigate, useParams } from 'react-router-dom'
import PrivateRoute from '@/PrivateRoute.tsx'
import Navbar from '@/components/Navbar.tsx'
import { updateBook } from '@/api/books.ts'
import { ApiError } from '@/exception/ApiError.ts'
import { useCallback, useEffect, useMemo, useState } from 'react'
import UpdateFieldForm from '@/components/UpdateFieldForm.tsx'
import AutocompleteInput from '@/components/AutocompleteInput.tsx'
import Tooltip from '@/components/Tooltip.tsx'
import { Info } from 'lucide-react'
import { getAuthors } from '@/api/authors.ts'
import TextInputError from '@/components/TextInputError.tsx'
import Alert from '@/components/Alert.tsx'
import type { UpdateBookRequest } from '@/dto/UpdateBookRequest.ts'

const MAX_AUTHOR_NAME = 50

export default function BookUpdateAuthorsPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const book = (location.state?.value) as UpdateBookRequest | null
  const [authorNames, setAuthorNames] = useState(book?.authorNames ? book?.authorNames.join(', ') : '')
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

  const validateAuthors = useCallback((value: string) => {
    const arr = value.split(',').map(v => v.trim())
    return (
      arr.length > 0 &&
      arr.every(v => v !== '' && v.length <= MAX_AUTHOR_NAME)
    )
  }, [])

  const errorMessage = useMemo(() => {
    if (!touched && !submitAttempted) return ''
    if (!authorNames.trim()) return  'Nama penulis tidak boleh kosong'
    else if (!validateAuthors(authorNames)) return `Setiap nama penulis harus terisi dan tidak lebih dari ${MAX_AUTHOR_NAME} karakter`
    return ''
  }, [authorNames, touched, submitAttempted])

  const isValid = useMemo(() => errorMessage === '', [errorMessage])

  const handleAuthorNamesChange = useCallback((value: string) => {
    setAuthorNames(value)
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
      await updateBook(id, { authorNames: authorNames.split(',').map(name => name.trim()) })
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
  }, [authorNames, isValid, id, navigate, book])

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
          title="Edit Penulis"
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
            onChange={handleAuthorNamesChange}
            fetchSuggestions={getAuthors}
            placeholder="Masukkan nama penulis, pisahkan dengan koma"
            hasError={!!errorMessage}
            validation={errorMessage && <TextInputError message={errorMessage} />}
            multi
          />
        </UpdateFieldForm>
      </div>
      </div>
      </div>
    </PrivateRoute>
  )
}
