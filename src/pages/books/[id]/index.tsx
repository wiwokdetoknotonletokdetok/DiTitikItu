import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchBookById } from '@/api/books'
import { ApiError } from '@/exception/ApiError'
import type { BookResponseDTO } from '@/dto/BookResponseDTO'
import BookImageUploader from '@/components/BookImageUploader'
import Navbar from '@/components/Navbar.tsx'
import PrivateRoute from '@/PrivateRoute.tsx'
import { FieldItemWithLoading } from '@/components/FieldItem.tsx'
import type { GenreResponse } from '@/dto/GenreResponse.ts'
import { uploadBookPicture } from '@/api/uploadBookPicture.ts'

export default function BookUpdatePage() {
  const { id: id } = useParams()
  const [form, setForm] = useState({
    title: '',
    synopsis: '',
    bookPicture: '',
    totalPages: 0,
    publishedYear: 0,
  })

  const [isbn, setIsbn] = useState('')
  const [language, setLanguage] = useState('')
  const [publisherName, setPublisherName] = useState('')
  const [authorNames, setAuthorNames] = useState('')
  const [genre, setGenre] = useState<GenreResponse>()
  const [newImage, setNewImage] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [loading, setLoading] = useState(true)

  const bookRequest = {
    isbn,
    title: form.title,
    synopsis: form.synopsis,
    bookPicture: form.bookPicture,
    totalPages: form.totalPages,
    publishedYear: form.publishedYear,
    language,
    publisherName,
    authorNames: authorNames.split(',').map((name) => name.trim()),
    genreIds: genre ? [genre.id] : [],
  }

  useEffect(() => {
    if (!id) return
    const fetchData  = async () => {
      try {
        const data: BookResponseDTO = await fetchBookById(id)
        setForm({
          title: data.title,
          synopsis: data.synopsis,
          bookPicture: data.bookPicture,
          totalPages: data.totalPages,
          publishedYear: data.publishedYear,
        })
        setIsbn(data.isbn)
        setAuthorNames(data.authorNames.join(', '))
        setPublisherName(data.publisherName)
        setLanguage(data.language)
        setGenre(data.genres[0])
        setLoading(false)
      } catch (err) {
        console.error(err)
        if (err instanceof ApiError) {
          console.log(err.message)
        }
      }
    }

    fetchData()
  }, [id])

  useEffect(() => {
    if (!newImage || !id) return

    const uploadImage = async () => {
      setIsUploading(true)

      try {
        await uploadBookPicture(id, newImage)
        console.log('Gambar berhasil diunggah.')
      } catch (error) {
        console.error(error)
        if (error instanceof ApiError) {
          console.log((`Gagal mengunggah gambar: ${error.message}`))
        } else {
          console.log('Terjadi kesalahan saat mengunggah gambar.')
        }
      } finally {
        setIsUploading(false)
      }
    }

    uploadImage()
  }, [newImage, id])

  return (
    <PrivateRoute>
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Buku</h1>
          {!loading && (
            <BookImageUploader
              onUpload={(file) => setNewImage(file)}
              initialUrl={form.bookPicture}
              isUploading={isUploading}
            />
          )}
          <div className="rounded-lg overflow-hidden shadow mt-4">
            <FieldItemWithLoading
              label="Judul buku"
              value={form.title}
              to={`/books/${id}/title`}
              state={{ value: bookRequest }}
              isLoading={loading}
            />
            <FieldItemWithLoading
              label="ISBN"
              value={formatISBN(isbn)}
              to={`/books/${id}/isbn`}
              state={{ value: bookRequest }}
              isLoading={loading}
            />
            <FieldItemWithLoading
              label="Sinopsis"
              value={form.synopsis}
              to={`/books/${id}/synopsis`}
              state={{ value: bookRequest }}
              isLoading={loading}
            />
            <FieldItemWithLoading
              label="Jumlah halaman"
              value={form.totalPages.toString()}
              to={`/books/${id}/total-pages`}
              state={{ value: bookRequest }}
              isLoading={loading}
            />
            <FieldItemWithLoading
              label="Tahun terbit"
              value={form.publishedYear.toString()}
              to={`/books/${id}/published-year`}
              state={{ value: bookRequest }}
              isLoading={loading}
            />
            <FieldItemWithLoading
              label="Bahasa"
              value={language}
              to={`/books/${id}/language`}
              state={{ value: bookRequest }}
              isLoading={loading}
            />
            <FieldItemWithLoading
              label="Penerbit"
              value={publisherName}
              to={`/books/${id}/publisher`}
              state={{ value: bookRequest }}
              isLoading={loading}
            />
            <FieldItemWithLoading
              label="Penulis"
              value={authorNames}
              to={`/books/${id}/authors`}
              state={{ value: bookRequest }}
              isLoading={loading}

            />
            <FieldItemWithLoading
              label="Genre"
              value={genre?.genreName || ''}
              to={`/books/${id}/genres`}
              state={{ value: bookRequest }}
              isLoading={loading}
            />
          </div>
        </div>
      </>
    </PrivateRoute>
  )
}

function formatISBN(isbn: string) {
  const cleanIsbn = isbn.replace(/[^0-9Xx]/g, '')

  if (cleanIsbn.length === 13) {
    return (
      cleanIsbn.slice(0, 3) + '-' +
      cleanIsbn.slice(3, 6) + '-' +
      cleanIsbn.slice(6, 9) + '-' +
      cleanIsbn.slice(9, 12) + '-' +
      cleanIsbn.slice(12)
    )
  } else if (cleanIsbn.length === 10) {
    return (
      cleanIsbn.slice(0, 1) + '-' +
      cleanIsbn.slice(1, 4) + '-' +
      cleanIsbn.slice(4, 9) + '-' +
      cleanIsbn.slice(9)
    )
  } else {
    return isbn
  }
}
