import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getUserProfile } from '@/api/getUserProfile.ts'
import type { UserProfileResponse } from '@/dto/UserProfileResponse.ts'
import { ApiError } from '@/exception/ApiError.ts'
import { useNavigate } from 'react-router-dom'

function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>()
  const [profile, setProfile] = useState<UserProfileResponse>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!userId) return

    setLoading(true)
    setError(null)

    getUserProfile(userId)
    .then(res => {
      setProfile(res.data)
    })
    .catch((err: unknown) => {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Terjadi kesalahan tak terduga')
      }
    }).finally(() => setLoading(false))

  }, [userId])

  if (loading) {
    return (
      <div className="flex h-screen w-screen p-8 gap-4 bg-gray-50">
        <div className="flex-1 p-10 bg-white rounded-3xl shadow-lg animate-pulse">
          <div className="mx-auto rounded-full bg-gray-300 w-48 h-48" />
          <div className="mt-8 h-8 bg-gray-300 rounded w-3/4 mx-auto" />
          <div className="mt-4 h-4 bg-gray-200 rounded w-1/2 mx-auto" />

          <div className="mt-10 grid grid-cols-3 gap-x-12 gap-y-6 max-w-xl mx-auto text-center">
            <div className="flex flex-col items-center">
              <div className="h-4 w-16 bg-gray-300 rounded" />
              <div className="h-6 w-12 bg-gray-200 rounded mt-2" />
            </div>
            <div className="flex flex-col items-center">
              <div className="h-4 w-16 bg-gray-300 rounded" />
              <div className="h-6 w-12 bg-gray-200 rounded mt-2" />
            </div>
            <div className="flex flex-col items-center">
              <div className="h-4 w-16 bg-gray-300 rounded" />
              <div className="h-6 w-12 bg-gray-200 rounded mt-2" />
            </div>
          </div>
        </div>
        <div className="w-80 bg-white rounded-3xl shadow-lg overflow-y-auto animate-pulse" />
      </div>
    )
  }

  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>
  if (!profile) return <p>User profile tidak ditemukan.</p>

  return (
    <div>
      <h1>User Profile</h1>

      <img
        src={profile.profilePicture}
        alt={`${profile.name}'s profile`}
      />

      <h2>{profile.name}</h2>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Bio:</strong> {profile.bio}</p>
      <p><strong>Followers:</strong> {profile.followers}</p>
      <p><strong>Followings:</strong> {profile.followings}</p>
      <p><strong>Points:</strong> {profile.points}</p>

      <button
        onClick={() => navigate(`/users/${userId}/books`)}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Lihat Koleksi
      </button>

    </div>
  )
}

export default UserProfilePage
