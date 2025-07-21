import { useParams, useLocation, useNavigate } from 'react-router-dom'
import PrivateRoute from '@/PrivateRoute.tsx'
import Navbar from '@/components/Navbar.tsx'
import { updateBook } from '@/api/books.ts'
import { ApiError } from '@/exception/ApiError.ts'
import { useEffect, useState } from 'react'
import UpdateBookFieldForm from '@/components/UpdateBookFieldForm.tsx'
import { getLanguages } from '@/api/languages.ts'
import AutocompleteInput from '@/components/AutocompleteInput.tsx'

export default function BookUpdateLanguagePage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const value = location.state?.value || ''
  const [language, setLanguage] = useState(value)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!location.state?.value) {
      navigate(`/books/${id}`)
    }
  }, [location.state?.value, id, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!language.trim()) {
      setMessage('Bahasa buku tidak boleh kosong!')
      return
    }

    try {
      await updateBook(id, { language: language })
      setMessage('Bahasa buku berhasil diperbarui!')
    } catch (err) {
      if (err instanceof ApiError) {
        setMessage(err.message)
      } else {
        setMessage('Terjadi kesalahan, coba lagi nanti.')
      }
    }
  }

  return (
    <PrivateRoute>
      <>
        <Navbar />
        <UpdateBookFieldForm onSubmit={handleSubmit} buttonText="Simpan" title="Bahasa">
          <AutocompleteInput
            label="Bahasa"
            name="language"
            value={language}
            onChange={setLanguage}
            fetchSuggestions={getLanguages}
            placeholder="Masukkan bahasa buku (misal: Indonesia)"
          />
        </UpdateBookFieldForm>
      </>
    </PrivateRoute>
  )
}
