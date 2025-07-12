import { useState } from 'react'
import { createBook } from '@/api/books'

export default function NewBookPage() {
  const [form, setForm] = useState({
    isbn: '',
    title: '',
    synopsis: '',
    bookPicture: '',
    totalPages: 0,
    publishedYear: 0,
    language: '',
    rating: 0,
    publisherName: '',
    authorNames: '',
    genreIds: [] as number[],
  })

  const GENRE_OPTIONS = [
    'Horor',
    'Fiksi',
    'Non-Fiksi',
    'Fantasi',
    'Sejarah',
    'Romansa',
    'Sains',
    'Biografi',
  ]
  
  const [message, setMessage] = useState('')
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createBook({
        ...form,
        authorNames: form.authorNames.split(',').map(name => name.trim()),
        genreIds: form.genreIds, 
        totalPages: Number(form.totalPages),
        publishedYear: Number(form.publishedYear),
        rating: Number(form.rating)
      })
      setMessage('Buku berhasil ditambahkan!')
    } catch (err) {
      console.error(err)
      setMessage('Gagal menambahkan buku.')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Tambah Buku Baru</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <p>ISBN: </p>
          <input name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>

        <div>
          <p>Judul: </p>
          <input name="title" placeholder="Judul" value={form.title} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>

        <div>
          <p>Sinopsis: </p>
          <textarea name="synopsis" placeholder="Sinopsis" value={form.synopsis} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>

        <div>
          <p>URL Gambar: </p>
          <input name="bookPicture" placeholder="URL Gambar" value={form.bookPicture} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>

        <div>
          <p>Jumlah Halaman: </p>
          <input name="totalPages" type="number" placeholder="Jumlah Halaman" value={form.totalPages} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>

        <div>
          <p>Tahun Terbit: </p>
          <input name="publishedYear" type="number" placeholder="Tahun Terbit" value={form.publishedYear} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>

        <div>
          <p>Bahasa: </p>
          <input name="language" placeholder="Bahasa" value={form.language} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>

        <div>
          <p>Rating: </p>
          <input name="rating" type="number" min={0} max={5} placeholder="Rating" value={form.rating} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>

        <div>
          <p>Nama Penerbit: </p>
          <input name="publisherName" placeholder="Nama Penerbit" value={form.publisherName} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>

        <div>
          <p>Penulis: </p>
          <input name="authorNames" placeholder="Penulis (pisahkan dengan koma)" value={form.authorNames} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        
        <div>
          <p>Genre: </p>
          <select
            multiple
            value={form.genreIds.map(String)}
            onChange={(e) => {
              const selectedIds = Array.from(e.target.selectedOptions, (opt) => Number(opt.value))
              setForm({ ...form, genreIds: selectedIds })
            }}
          >
            {GENRE_OPTIONS.map((genre, index) => (
              <option key={index} value={index + 1}>{genre}</option>
            ))}
          </select>
        </div>
        
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Tambah Buku</button>
      </form>

      {message && <p className="mt-2">{message}</p>}
    </div>
  )
}
