import { useLocation, useNavigate, useParams } from 'react-router-dom'
import PrivateRoute from '@/PrivateRoute.tsx'
import Navbar from '@/components/Navbar.tsx'
import { updateBook } from '@/api/books.ts'
import { ApiError } from '@/exception/ApiError.ts'
import { useEffect, useState } from 'react'
import UpdateFieldForm from '@/components/UpdateFieldForm.tsx'
import { getGenres } from '@/api/genres.ts'
import SelectGenre from '@/components/SelectGenre.tsx'
import type { BookRequestDTO } from '@/dto/BookRequestDTO'

export default function BookUpdateGenresPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const book = (location.state?.value || null) as BookRequestDTO | null
  const [genreId, setGenreId] = useState<string>(book?.genreIds[0]?.toString() || '')
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

    try {
      console.log("The Moment of thruth")
      await updateBook(id, {
        ...book,
        genreIds: [parseInt(genreId)],
      })
      console.log('Genre buku berhasil diperbarui!')
      setMessage('Genre berhasil diperbarui!')
      navigate(`/books/${id}`)
    } catch (err) {
      console.error(err)
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
            value={genreId}
            onChange={e => setGenreId(e.target.value)}
            placeholder="Pilih genre"
            fetchOptions={getGenres}
          />
        </UpdateFieldForm>
      </>
    </PrivateRoute>
  )
}
