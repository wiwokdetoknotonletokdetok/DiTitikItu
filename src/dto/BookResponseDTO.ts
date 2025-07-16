export interface BookResponseDTO {
  id: string
  isbn: string
  title: string
  synopsis: string
  totalPages: number
  publishedYear: number
  language: string
  totalRatings: number
  bookPicture: string
  publisherName: string
  authorNames: string[]
  genreNames: string[]
}