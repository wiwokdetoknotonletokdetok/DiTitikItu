export interface BookSummaryDTO {
  id: string
  title: string
  isbn: string
  rating: number
  bookPicture: string
  publisherName: string
  authorNames: string[]
  genreNames: string[]
}