import { useEffect, useRef, useState } from 'react'
import { getBooksSemantic } from '@/api/BooksSemantic.ts'
import type { BookSummaryDTO } from '@/dto/BookSummaryDTO.ts'
import Tooltip from '@/components/Tooltip.tsx'
import { Search, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getBooksKeyword } from '@/api/BooksKeyword.ts'

interface LiveSearchProps {
  onSelectBook: (bookId: string) => void
}

export default function LiveSearch({ onSelectBook }: LiveSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<BookSummaryDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    let typingTimeout: NodeJS.Timeout

    if (query.length > 2) {
      setLoading(true)
      setIsTyping(true)
      setIsOpen(true)

      typingTimeout = setTimeout(() => {
        const fetchData = async () => {
          const result: BookSummaryDTO[] = []

          const addUniqueBooks = (books: BookSummaryDTO[]) => {
            const seenIds = new Set(result.map(b => b.id))
            for (const book of books) {
              if (!seenIds.has(book.id)) {
                result.push(book)
                seenIds.add(book.id)
                if (result.length >= 5) break
              }
            }
          }

          try {
            const semanticResponse = await getBooksSemantic(query)
            addUniqueBooks(semanticResponse.data)
          } catch { /* silently fail */ }

          if (result.length < 5) {
            try {
              const keywordResponse = await getBooksKeyword(query)
              addUniqueBooks(keywordResponse.data)
            } catch { /* silently fail */ }
          }

          setResults(result)
          setLoading(false)
          setIsTyping(false)
        }

        fetchData()
      }, 300)
    } else {
      setResults([])
      setIsOpen(false)
      setLoading(false)
      setIsTyping(false)
    }

    return () => clearTimeout(typingTimeout)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <button
          type="button"
          onClick={() => inputRef.current?.focus()}
          className="absolute left-4 translate-y-1/2 text-gray-500 focus:outline-none"
          aria-label="Fokus ke input pencarian"
        >
          <Tooltip message="Cari buku">
            <Search size={20}/>
          </Tooltip>
        </button>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Apa yang ingin kamu baca hari ini?"
          className="py-3 px-11 w-full text-sm border border-gray-300 shadow-md rounded-full focus:outline-none pr-10"
          onFocus={() => {
            if (results.length > 0) setIsOpen(true)
          }}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setResults([])
              setIsOpen(false)
            }}
            className="absolute right-4 translate-y-1/2 transform text-gray-600 focus:outline-none"
            aria-label="Hapus pencarian"
          >
            <Tooltip message="Hapus pencarian">
              <X size={20}/>
            </Tooltip>
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-1 max-h-96 overflow-auto border border-gray-200 bg-white rounded-3xl shadow-lg z-[1000]">
          {(loading || isTyping) && (
            <SkeletonItem/>
          )}

          {!loading && !isTyping && query.length > 2 && results.length === 0 && (
            <Link to="/books">
              <p className="py-4 px-8 text-center text-sm text-gray-500 hover:bg-gray-100">
                Judul belum tersedia. Mau tambahkan?
              </p>
            </Link>
          )}

          {!loading && !isTyping && results.length > 0 && (
            <ul className="divide-y divide-gray-200">
              {results.map((book, i) => (
                <li
                  key={i}
                  className="flex items-center space-x-4 p-3 hover:bg-gray-100 cursor-pointer transition"
                  onClick={() => onSelectBook(book.id)}
                >
                  <img
                    src={book.bookPicture}
                    alt={book.title}
                    className="w-24 h-36 object-cover rounded-md flex-shrink-0"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{book.title}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

function SkeletonItem(){
  return (
    <div className="flex items-center space-x-4 p-3 animate-pulse bg-white">
      <div className="w-24 h-36 bg-gray-300 rounded-md" />
      <div className="flex-1 space-y-3 py-1">
        <div className="h-5 bg-gray-300 rounded w-3/4" />
        <div className="h-4 bg-gray-300 rounded w-1/2" />
      </div>
    </div>
  )
}
