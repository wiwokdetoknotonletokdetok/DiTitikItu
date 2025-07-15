import { useForm } from 'react-hook-form'

interface SearchFormInputs {
  title?: string
  isbn?: string
  author?: string
  genre?: string
  publisher?: string
}

interface BookSearchBarProps {
  onSearch: (params: SearchFormInputs) => void
}

export default function BookSearchBar({ onSearch }: BookSearchBarProps) {
  const { register, handleSubmit, reset } = useForm<SearchFormInputs>()

  const onSubmit = (data: SearchFormInputs) => {
    // Bersihkan nilai kosong ("" → undefined)
    const sanitized = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== "")
    ) as SearchFormInputs
    onSearch(sanitized)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 p-4 border rounded-md bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input {...register("title")} placeholder="Judul" className="border p-2 rounded w-full" />
        <input {...register("isbn")} placeholder="ISBN" className="border p-2 rounded w-full" />
        <input {...register("author")} placeholder="Penulis" className="border p-2 rounded w-full" />
        <input {...register("genre")} placeholder="Genre" className="border p-2 rounded w-full" />
        <input {...register("publisher")} placeholder="Penerbit" className="border p-2 rounded w-full" />
      </div>

      <div className="flex gap-2 pt-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Cari
        </button>
        <button type="button" className="bg-gray-300 text-black px-4 py-2 rounded"
          onClick={() => {
            reset()
            onSearch({})
          }}>
          Reset
        </button>
      </div>
    </form>
  )
}
