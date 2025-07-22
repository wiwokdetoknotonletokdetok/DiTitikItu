import { useLocation, useNavigate, useParams } from 'react-router-dom'
import PrivateRoute from '@/PrivateRoute.tsx'
import Navbar from '@/components/Navbar.tsx'
import { updateBook } from '@/api/books.ts'
import { ApiError } from '@/exception/ApiError.ts'
import { useEffect, useState } from 'react'
import UpdateFieldForm from '@/components/UpdateFieldForm.tsx'
import { getGenres } from '@/api/genres.ts'
import SelectGenre from '@/components/SelectGenre.tsx'
import type { GenreResponse } from '@/dto/GenreResponse.ts'

export default function BookUpdateGenresPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const value: GenreResponse = location.state?.value || ''
  const [genreIds, setGenreIds] = useState(value.id.toString())
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!location.state?.value) {
      navigate(`/books/${id}`)
    }
  }, [location.state?.value, id, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await updateBook(id, { genreIds: [parseInt(genreIds)] })
      setMessage('Genre berhasil diperbarui!')
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
        <UpdateFieldForm onSubmit={handleSubmit} buttonText="Simpan" title="Edit Genre">
          <SelectGenre
            label="Genre"
            name="genre"
            value={genreIds}
            onChange={e => setGenreIds(e.target.value)}
            placeholder="Pilih genre"
            fetchOptions={getGenres}
          />
        </UpdateFieldForm>
      </>
    </PrivateRoute>
  )
}
