import type { ReviewResponseDTO } from './ReviewResponseDTO'

export interface ReviewWithUserDTO extends ReviewResponseDTO {
  name: string
  profilePicture: string
}
