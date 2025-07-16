export interface BookRequestDTO {
  isbn: string
  title: string
  synopsis: string
  bookPicture: string
  totalPages: number
  publishedYear: number
  language: string
  publisherName: string
  authorNames: string[]
  genreIds: number[] 
}