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

export default function BookUpdateTotalPagesPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const book = (location.state?.value) as UpdateBookRequest
  const [totalPages, setTotalPages] = useState(String(book?.totalPages) || '')
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

  const validateTotalPages = useCallback(() => {
    const positifNumber = /^[1-9][0-9]*$/
    if (!totalPages.trim()) return 'Jumlah halaman buku tidak boleh kosong!'
    else if (!positifNumber.test(totalPages)) return 'Jumlah halaman harus berupa angka positif!'
    return ''
  }, [totalPages])

  const errorMessage = useMemo(() => {
    if (!touched && !submitAttempted) return ''
    return validateTotalPages()
  }, [totalPages, touched, submitAttempted, validateTotalPages])

  const isValid = useMemo(() => errorMessage === '', [errorMessage])

  const handleTotalPagesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTotalPages(e.target.value)
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
      await updateBook(id, { totalPages: parseInt(totalPages) })
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
  }, [totalPages, isValid, id, book])

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
          title="Edit Jumlah Halaman"
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
            name="totalPages"
            label="Jumlah halaman"
            placeholder="Masukkan jumlah halaman buku (misal: 100)"
            value={totalPages}
            onChange={handleTotalPagesChange}
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
