import { fetchReviews } from './reviews'
import { getUserProfile } from './getUserProfile'
import type { ReviewWithUserDTO } from '@/dto/ReviewWithUserDTO'

export async function fetchReviewsWithUser(bookId: string): Promise<ReviewWithUserDTO[]> {
  const reviews = await fetchReviews(bookId)
  const uniqueUserIds = [...new Set(reviews.map(r => r.userId))]
  const profileMap: Record<string, {
    name: string
    profilePicture: string
    bio: string
    points: number
  }> = {}

  await Promise.all(
    uniqueUserIds.map(async (userId) => {
      const res = await getUserProfile(userId)
      profileMap[userId] = {
        name: res.data.name,
        profilePicture: res.data.profilePicture,
        bio: res.data.bio,
        points: res.data.points,
      }
    })
  )
  
  return reviews.map((review) => ({
    ...review,
    name: profileMap[review.userId]?.name || 'Unknown',
    profilePicture: profileMap[review.userId]?.profilePicture || '',
    bio: profileMap[review.userId]?.bio || '',
    points: profileMap[review.userId]?.points ?? 0,
  }))
}
