import { fetchReviews } from './reviews'
import { userProfile } from './userProfile'
import type { ReviewWithUserDTO } from '@/dto/ReviewWithUserDTO'

export async function fetchReviewsWithUser(bookId: string): Promise<ReviewWithUserDTO[]> {
  const reviews = await fetchReviews(bookId)
  const uniqueUserIds = [...new Set(reviews.map(r => r.userId))]
  const profileMap: Record<string, { name: string; profilePicture: string }> = {}

  await Promise.all(
    uniqueUserIds.map(async (userId) => {
      const res = await userProfile(userId)
      profileMap[userId] = {
        name: res.data.name,
        profilePicture: res.data.profilePicture,
      }
    })
  )
  
  return reviews.map((review) => ({
    ...review,
    name: profileMap[review.userId]?.name || 'Unknown',
    profilePicture: profileMap[review.userId]?.profilePicture || '',
  }))
}

