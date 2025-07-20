import { useEffect, useRef, useState } from 'react'
import type { WebResponse } from '@/dto/WebResponse'

type InfiniteListProps<T> = {
  fetchFn: (page: number) => Promise<WebResponse<T[]>>
  renderItem: (item: T) => React.ReactNode
}

export function InfiniteList<T>({ fetchFn, renderItem }: InfiniteListProps<T>) {
  const [items, setItems] = useState<T[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const loadedPages = useRef<Set<number>>(new Set())

  const containerRef = useRef<HTMLDivElement>(null)

  const load = async (p: number) => {
    if (loadedPages.current.has(p)) return
    loadedPages.current.add(p)

    setLoading(true)
    try {
      const res = await fetchFn(p)
      setItems((prev) => [...prev, ...res.data])
      setTotalPages(res.pageInfo.totalPages)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(page)
  }, [page])

  const handleScroll = () => {
    const container = containerRef.current
    if (!container || loading || page >= totalPages) return

    const { scrollTop, scrollHeight, clientHeight } = container

    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setPage((prev) => prev + 1)
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [loading, page, totalPages])

  return (
    <div
      ref={containerRef}
      className="h-96 overflow-y-auto"
    >
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li key={(item as any).id ?? index}>{renderItem(item)}</li>
        ))}
      </ul>

      <div className="pt-4 flex justify-center">
        {loading && (
          <p className="text-sm text-gray-600">Memuat...</p>
        )}
        {!loading && page >= totalPages && (
          <div className="w-4 h-1 rounded-full bg-gray-300"/>
        )}
      </div>
    </div>
  )
}
