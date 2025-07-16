import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { userProfile } from '@/api/userProfile.ts'
import type { UserProfileResponse } from '@/dto/UserProfileResponse.ts'
import { ApiError } from '@/exception/ApiError.ts'
import { logout } from '@/api/userProfile.ts'
import { useNavigate } from 'react-router-dom'

function UserProfile() {
  const { userId } = useParams<{ userId: string }>()
  const [profile, setProfile] = useState<UserProfileResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  useEffect(() => {
    if (!userId) return

    setLoading(true)
    setError(null)

    userProfile(userId)
    .then(res => {
      setProfile(res.data)
    })
    .catch((err: unknown) => {
      if (err instanceof ApiError) {
        setError(err.message || 'Gagal mengambil data user')
      } else {
        setError('Terjadi kesalahan tak terduga')
      }
    })
    .finally(() => setLoading(false))
  }, [userId])

  if (loading) return <p>Loading...</p>
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
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default UserProfile
