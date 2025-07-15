export interface BookSummaryDTO {
  id: string
  title: string
  isbn: string
  totalRatings: number
  bookPicture: string
  publisherName: string
  authorNames: string[]
  genreNames: string[]
}