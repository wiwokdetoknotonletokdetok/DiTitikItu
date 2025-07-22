import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBook } from '@/api/books'
import { ApiError } from '@/exception/ApiError'
import PrivateRoute from '@/PrivateRoute.tsx'
import TextInput from '@/components/TextInput.tsx'
import TextArea from '@/components/TextArea.tsx'
import AutocompleteInput from '@/components/AutocompleteInput.tsx'
import SelectGenre from '@/components/SelectGenre.tsx'
import SubmitButton from '@/components/SubmitButton.tsx'
import Alert from '@/components/Alert.tsx'
import Tooltip from '@/components/Tooltip.tsx'
import { Info } from 'lucide-react'
import { getAuthors } from '@/api/authors.ts'
import { getLanguages } from '@/api/languages.ts'
import { getPublishers } from '@/api/publishers.ts'
import { getGenres } from '@/api/genres.ts'
import Navbar from '@/components/Navbar.tsx'
import TextInputError from '@/components/TextInputError.tsx'

type FormState = {
  title: string
  isbn: string
  synopsis: string
  totalPages: string
  publishedYear: string
  language: string
  publisherName: string
  authorNames: string
  genreId: string
}

type TouchedState = Record<keyof FormState, boolean>

export default function NewBookPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>({
    title: '', isbn: '', synopsis: '', totalPages: '', publishedYear: '',
    language: '', publisherName: '', authorNames: '', genreId: ''
  })
  const [touched, setTouched] = useState<TouchedState>({
    title: false, isbn: false, synopsis: false, totalPages: false, publishedYear: false,
    language: false, publisherName: false, authorNames: false, genreId: false
  })
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [apiMessage, setApiMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const MAX_ISBN_LENGTH = 17
  const MAX_TITLE_LENGTH = 50
  const MAX_PUBLISHER_NAME = 50
  const MAX_AUTHOR_NAME = 50
  const MAX_LANGUAGE_LENGTH = 50
  const SYNOPSIS_MAX_LENGTH = 400

  function formatISBN(value: string) {
    const cleaned = value.replace(/[^0-9Xx]/g, '')
    if (cleaned.length <= 3) return cleaned
    if (cleaned.length <= 4) return `${cleaned.slice(0,3)}-${cleaned.slice(3)}`
    if (cleaned.length <= 6) return `${cleaned.slice(0,3)}-${cleaned.slice(3,4)}-${cleaned.slice(4)}`
    if (cleaned.length <= 12) return `${cleaned.slice(0,3)}-${cleaned.slice(3,4)}-${cleaned.slice(4,6)}-${cleaned.slice(6)}`
    if (cleaned.length <= 13) return `${cleaned.slice(0,3)}-${cleaned.slice(3,4)}-${cleaned.slice(4,6)}-${cleaned.slice(6,12)}-${cleaned.slice(12)}`
    return cleaned
  }

  const handleIsbnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value
    if (val.length > MAX_ISBN_LENGTH) val = val.slice(0, MAX_ISBN_LENGTH)
    setForm(prev => ({ ...prev, isbn: formatISBN(val) }))
    setTouched(prev => ({ ...prev, isbn: true }))
    setApiMessage('')
  }, [])

  function isValidISBN10(isbn: string): boolean {
    if (isbn.length !== 10) return false
    let sum = 0
    for (let i = 0; i < 9; i++) {
      const digit = parseInt(isbn[i], 10)
      if (isNaN(digit)) return false
      sum += digit * (10 - i)
    }
    const lastChar = isbn[9].toUpperCase()
    if (lastChar !== 'X' && isNaN(Number(lastChar))) return false
    sum += lastChar === 'X' ? 10 : Number(lastChar)
    return sum % 11 === 0
  }

  function isValidISBN13(isbn: string): boolean {
    if (isbn.length !== 13) return false
    let sum = 0
    for (let i = 0; i < 13; i++) {
      const digit = parseInt(isbn[i], 10)
      if (isNaN(digit)) return false
      sum += i % 2 === 0 ? digit : digit * 3
    }
    return sum % 10 === 0
  }

  const isValidISBN = useCallback((value: string) => {
    const cleaned = value.replace(/[^0-9Xx]/g, '')
    return cleaned.length === 10
      ? isValidISBN10(cleaned)
      : cleaned.length === 13
        ? isValidISBN13(cleaned)
        : false
  }, [])

  const isNotEmpty = useCallback((value: string) => value.trim() !== '', [])
  const maxLength = useCallback((value: string, len: number) => value.length <= len, [])
  const validateAuthors = useCallback((value: string) => {
    const arr = value.split(',').map(v => v.trim())
    return (
      arr.length > 0 &&
      arr.every(v => v !== '' && v.length <= MAX_AUTHOR_NAME)
    )
  }, [])

  const errors = useMemo(() => {
    const errs: Partial<Record<keyof FormState, string>> = {}

    if ((touched.title || submitAttempted)) {
      if (!isNotEmpty(form.title)) errs.title = 'Judul buku tidak boleh kosong'
      else if (form.title.length > MAX_TITLE_LENGTH) errs.title = `Judul buku tidak boleh lebih dari ${MAX_TITLE_LENGTH} karakter`
    }

    if ((touched.isbn || submitAttempted)) {
      if (!isNotEmpty(form.isbn)) errs.isbn = 'ISBN tidak boleh kosong'
      else if (!isValidISBN(form.isbn)) errs.isbn = 'ISBN tidak valid'
    }

    if ((touched.synopsis || submitAttempted)) {
      if (!isNotEmpty(form.synopsis)) errs.synopsis = 'Sinopsis tidak boleh kosong'
      else if(!maxLength(form.synopsis, SYNOPSIS_MAX_LENGTH)) errs.synopsis = `Sinopsis tidak boleh lebih dari ${SYNOPSIS_MAX_LENGTH} karakter`
    }

    const positifNumber = /^[1-9][0-9]*$/
    if ((touched.totalPages || submitAttempted)) {
      if (!isNotEmpty(form.totalPages)) errs.totalPages = 'Jumlah halaman tidak boleh kosong'
      else if (!positifNumber.test(form.totalPages)) errs.totalPages = 'Jumlah halaman harus lebih dari 0'
    }

    const validYear = /^[1-9][0-9]{3}$/
    const currentYear = new Date().getFullYear()
    if ((touched.publishedYear || submitAttempted)) {
      if (!isNotEmpty(form.publishedYear)) errs.publishedYear = 'Tahun terbit tidak boleh kosong'
      else if (!validYear.test(form.publishedYear)) errs.publishedYear = 'Tahun terbit harus berupa angka 4 digit yang valid!'
      else if (parseInt(form.publishedYear) > currentYear) errs.publishedYear = `Tahun terbit tidak boleh lebih dari tahun ${currentYear}!`
    }

    if ((touched.language || submitAttempted)) {
      if (!isNotEmpty(form.language)) errs.language = 'Bahasa tidak boleh kosong'
      else if (!maxLength(form.language, MAX_LANGUAGE_LENGTH)) errs.language = `Bahasa tidak boleh lebih dari ${MAX_LANGUAGE_LENGTH} karakter`
    }

    if ((touched.publisherName || submitAttempted)) {
      if (!isNotEmpty(form.publisherName)) errs.publisherName = 'Nama penerbit tidak boleh kosong'
      else if (!maxLength(form.publisherName, MAX_PUBLISHER_NAME)) errs.publisherName = `Nama penerbit tidak boleh lebih dari ${MAX_PUBLISHER_NAME} karakter`
    }

    if ((touched.authorNames || submitAttempted)) {
      if (!isNotEmpty(form.authorNames)) errs.authorNames = 'Nama penulis tidak boleh kosong'
      else if (!validateAuthors(form.authorNames)) errs.authorNames = `Setiap nama penulis harus terisi dan tidak lebih dari ${MAX_AUTHOR_NAME} karakter`
    }

    if ((touched.genreId || submitAttempted) && !isNotEmpty(form.genreId)) errs.genreId = 'Genre tidak boleh kosong'

    return errs
  }, [form, touched, submitAttempted, isNotEmpty, maxLength, validateAuthors, isValidISBN])

  const isFormValid = useMemo(() => Object.keys(errors).length === 0, [errors])

  const handleChange = useCallback(
    (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm(prev => ({ ...prev, [key]: e.target.value }))
      setTouched(prev => ({ ...prev, [key]: true }))
      setApiMessage('')
    }, []
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setSubmitAttempted(true)
      setTouched(Object.keys(touched).reduce((acc, k) => ({ ...acc, [k]: true }), {} as TouchedState))
      if (!isFormValid) return

      setIsLoading(true)
      try {
        await createBook({
          title: form.title,
          isbn: form.isbn.replace(/-/g, ''),
          synopsis: form.synopsis,
          totalPages: parseInt(form.totalPages),
          publishedYear: parseInt(form.publishedYear),
          language: form.language,
          publisherName: form.publisherName,
          authorNames: form.authorNames.split(',').map(a => a.trim()),
          genreIds: [parseInt(form.genreId)],
          bookPicture: 'https://placehold.co/300x450?text=Book'
        })
        navigate('/')
      } catch (err) {
        if (err instanceof ApiError) setApiMessage(err.message)
        else setApiMessage('Terjadi kesalahan. Silakan coba lagi.')
      } finally {
        setIsLoading(false)
      }
    }, [form, isFormValid, navigate]
  )


  return (
    <PrivateRoute>
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Tambah Buku Baru</h1>

          {apiMessage && <Alert message={apiMessage} onClose={() => setApiMessage('')} />}
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <TextInput
              label="Judul"
              name="title"
              value={form.title}
              onChange={handleChange('title')}
              placeholder="Masukkan judul buku"
              hasError={!!errors.title}
              validation={errors.title && <TextInputError message={errors.title} />}
            />

            <TextInput
              label="ISBN"
              name="isbn"
              value={form.isbn}
              onChange={handleIsbnChange}
              placeholder="Masukkan ISBN buku (contoh: 978-1-23-456789-7)"
              hasError={!!errors.isbn}
              validation={errors.isbn && <TextInputError message={errors.isbn} />}
            />

            <TextArea
              label="Sinopsis"
              name="synopsis"
              value={form.synopsis}
              onChange={handleChange('synopsis')}
              placeholder="Ringkas sinopsis buku"
              hasError={!!errors.synopsis}
              validation={errors.synopsis && <TextInputError message={errors.synopsis} />}
            />

            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="Jumlah halaman"
                name="totalPages"
                value={form.totalPages}
                onChange={handleChange('totalPages')}
                placeholder="(misal: 100)"
                hasError={!!errors.totalPages}
                validation={errors.totalPages && <TextInputError message={errors.totalPages} />}
              />
              <TextInput
                label="Tahun terbit"
                name="publishedYear"
                value={form.publishedYear}
                onChange={handleChange('publishedYear')}
                placeholder="(misal: 2025)"
                hasError={!!errors.publishedYear}
                validation={errors.publishedYear && <TextInputError message={errors.publishedYear} />}
              />
            </div>

            <AutocompleteInput
              label="Bahasa"
              name="language"
              value={form.language}
              onChange={value => handleChange('language')({ target: { name: 'language', value } } as React.ChangeEvent<HTMLInputElement>)}
              fetchSuggestions={getLanguages}
              placeholder="Masukkan bahasa buku (misal: Indonesia)"
              hasError={!!errors.language}
              validation={errors.language && <TextInputError message={errors.language} />}
            />

            <AutocompleteInput
              label="Penerbit"
              name="publisherName"
              value={form.publisherName}
              onChange={value => handleChange('publisherName')({ target: { name: 'publisherName', value } } as React.ChangeEvent<HTMLInputElement>)}
              fetchSuggestions={getPublishers}
              placeholder="Masukkan nama penerbit"
              hasError={!!errors.publisherName}
              validation={errors.publisherName && <TextInputError message={errors.publisherName} />}
            />

            <AutocompleteInput
              label={<div className="flex items-center"><span>Penulis</span><Tooltip message="Jika lebih dari satu, pisahkan dengan koma"><Info size={12} className="ml-1 text-gray-500"/></Tooltip></div>}
              name="authorNames"
              multi
              value={form.authorNames}
              onChange={value => handleChange('authorNames')({ target: { name: 'authorNames', value } } as React.ChangeEvent<HTMLInputElement>)}
              fetchSuggestions={getAuthors}
              placeholder="Masukkan nama penulis, pisahkan dengan koma"
              hasError={!!errors.authorNames}
              validation={errors.authorNames && <TextInputError message={errors.authorNames} />}
            />

            <SelectGenre
              label="Genre"
              name="genreId"
              value={form.genreId}
              onChange={handleChange('genreId')}
              placeholder="Pilih genre"
              fetchOptions={getGenres}
              hasError={!!errors.genreId}
              validation={errors.genreId && <TextInputError message={errors.genreId} />}
            />

            <SubmitButton type="submit" isLoading={isLoading} disabled={!isFormValid || isLoading}>
              Simpan buku
            </SubmitButton>
          </form>
        </div>
      </>
    </PrivateRoute>
  )
}
