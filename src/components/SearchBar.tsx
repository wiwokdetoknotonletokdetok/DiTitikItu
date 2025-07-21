import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X, SlidersHorizontal } from 'lucide-react'

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
  const { register, handleSubmit, setValue, watch } = useForm<SearchFormInputs>()
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [searchParams] = useSearchParams()
  const titleWatch = watch("title")

  useEffect(() => {
    const advancedFields = ['isbn', 'author', 'genre', 'publisher']
    let found = false

    for (const field of advancedFields) {
      const value = searchParams.get(field)
      if (value) {
        setValue(field as keyof SearchFormInputs, value)
        found = true
      }
    }

    if (searchParams.get("title")) {
      setValue("title", searchParams.get("title") || "")
    }

    if (found) setShowAdvanced(true)
  }, [searchParams, setValue])

  const onSubmit = (data: SearchFormInputs) => {
    const sanitized = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== "")
    ) as SearchFormInputs
    onSearch(sanitized)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 bg-[#FAFAFA] border rounded-md shadow-sm">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1E497C] h-4 w-4" />

        <input
          {...register("title")}
          placeholder="Cari judul buku..."
          className="pl-9 pr-28 py-2 border border-[#1E497C] rounded w-full"
        />

        {titleWatch && (
          <X
            className="absolute right-20 top-1/2 -translate-y-1/2 text-black cursor-pointer h-4 w-4 hover:text-[#E53935]"
            onClick={() => {
              setValue("title", "")
              onSearch({})
            }}
          />
        )}

        <button
          type="submit"
          className="absolute right-12 top-1/2 -translate-y-1/2 text-[#1E497C] hover:text-white hover:bg-[#1E497C] p-1 h-9 w-9 flex items-center justify-center transition-colors rounded-full"
        >
          <Search className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => setShowAdvanced((prev) => !prev)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[#1E497C] hover:text-white hover:bg-[#1E497C] p-1 h-9 w-9 flex items-center justify-center transition-colors rounded-full"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input {...register("isbn")} placeholder="ISBN" className="border border-[#1E497C] p-2 rounded w-full" />
          <input {...register("author")} placeholder="Penulis" className="border border-[#1E497C] p-2 rounded w-full" />
          <input {...register("genre")} placeholder="Genre" className="border border-[#1E497C] p-2 rounded w-full" />
          <input {...register("publisher")} placeholder="Penerbit" className="border border-[#1E497C] p-2 rounded w-full" />
        </div>
      )}
    </form>
  )
}
