export interface UpdateBookRequest {
  isbn?: string
  title?: string
  synopsis?: string
  totalPages?: number
  publishedYear?: number
  language?: string
  publisherName?: string
  authorNames?: string[]
  genreIds?: number[]
}
