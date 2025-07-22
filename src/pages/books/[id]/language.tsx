import { useLocation, useNavigate, useParams } from 'react-router-dom'
import PrivateRoute from '@/PrivateRoute.tsx'
import Navbar from '@/components/Navbar.tsx'
import { updateBook } from '@/api/books.ts'
import { ApiError } from '@/exception/ApiError.ts'
import { useEffect, useState } from 'react'
import UpdateFieldForm from '@/components/UpdateFieldForm.tsx'
import { getLanguages } from '@/api/languages.ts'
import AutocompleteInput from '@/components/AutocompleteInput.tsx'
import type { BookRequestDTO } from '@/dto/BookRequestDTO'

export default function BookUpdateLanguagePage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const book = (location.state?.value || null) as BookRequestDTO | null
  const [language, setLanguage] = useState(book?.language || '')
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!book) {
      navigate(`/books/${id}`)
    }
  }, [book, id, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!id || !book) {
      setMessage("Data buku tidak tersedia.")
      return
    }

    if (!language.trim()) {
      setMessage('Bahasa buku tidak boleh kosong!')
      return
    }

    try {

      await updateBook(id, {
        ...book,
        language: language.trim(),
      })

      setMessage('Bahasa buku berhasil diperbarui!')
      navigate(`/books/${id}`)
    } catch (err) {
      console.log(err)
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
        <UpdateFieldForm onSubmit={handleSubmit} buttonText="Simpan" title="Edit Bahasa">
          <AutocompleteInput
            label="Bahasa"
            name="language"
            value={language}
            onChange={setLanguage}
            fetchSuggestions={getLanguages}
            placeholder="Masukkan bahasa buku (misal: Indonesia)"
          />
        </UpdateFieldForm>
      </>
    </PrivateRoute>
  )
}
