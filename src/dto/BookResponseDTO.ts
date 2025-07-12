export interface BookResponseDTO {
  id: string
  isbn: string
  title: string
  synopsis: string
  rating: number
  bookPicture: string
  publisherName: string
  authorNames: string[]
  genreNames: string[]
}