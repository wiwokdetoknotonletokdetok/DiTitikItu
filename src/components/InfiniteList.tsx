import { type RefObject, useEffect, useRef, useState } from 'react'
import type { WebResponse } from '@/dto/WebResponse'

type InfiniteListProps<T> = {
  fetchFn: (page: number) => Promise<WebResponse<T[]>>
  children: React.ReactNode
  ref: RefObject<HTMLDivElement | null>
  setItems: React.Dispatch<React.SetStateAction<T[]>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  loading: boolean
}

export function InfiniteList<T>({ fetchFn, children, ref, setItems, loading, setLoading }: InfiniteListProps<T>) {
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const loadedPages = useRef<Set<number>>(new Set())

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
    const container = ref.current
    if (!container || loading || page >= totalPages) return

    const { scrollTop, scrollHeight, clientHeight } = container

    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setPage((prev) => prev + 1)
    }
  }

  useEffect(() => {
    const container = ref.current
    if (!container) return

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [loading, page, totalPages])

  return children
}
