import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getUserProfile } from '@/api/getUserProfile.ts'
import type { UserProfileResponse } from '@/dto/UserProfileResponse.ts'
import { ApiError } from '@/exception/ApiError.ts'
import { useAuth } from '@/context/AuthContext'
import Modal from '@/components/Modal'
import LoginPromptContent from '@/components/LoginPromptContent'
import SimpleUserList from '@/components/SimpleUserList'
import { getUserFollowers } from '@/api/getUserFollowers'
import { getUserFollowings } from '@/api/getUserFollowings'
import Navbar from '@/components/Navbar.tsx'
import FollowButton from '@/components/FollowButton.tsx'
import { followUser, getUsersIdFollowStatus, unfollowUser } from '@/api/followUser.ts'
import LinkButton from '@/components/LinkButton.tsx'

function UserProfilePage() {
  const navigate = useNavigate()
  const { token, isLoggedIn, user } = useAuth()
  const { userId } = useParams<{ userId: string }>()
  const [profile, setProfile] = useState<UserProfileResponse>()
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFollowed, setIsFollowed] = useState(false)

  useEffect(() => {
    async function fetchUserProfile(userId: string) {
      setLoading(true)
      setError(null)
      try {
        const response = await getUserProfile(userId)
        setProfile(response.data)
      } catch (error) {
        if (error instanceof ApiError) {
          setError(error.message)
        } else {
          setError('Terjadi kesalahan. Silakan coba lagi.')
        }
      } finally {
        setLoading(false)
      }
    }
    if (userId) fetchUserProfile(userId)
  }, [userId])

  useEffect(() => {
    async function updateFollowersCount(userId: string) {
      try {
        const response = await getUserProfile(userId)
        setProfile(response.data)
      } catch (error) {
        if (error instanceof ApiError) {
          setError(error.message)
        } else {
          setError('Terjadi kesalahan. Silakan coba lagi.')
        }
      }
    }

    if (token && userId) updateFollowersCount(userId)
  }, [isFollowed])

  useEffect(() => {
    async function fetchFollowStatus(userId: string, token: string) {
      try {
        const response = await getUsersIdFollowStatus(userId, token)
        setIsFollowed(response.data)
      } catch (error) {
        if (error instanceof ApiError) {
          setError(error.message)
        } else {
          setError('Terjadi kesalahan. Silakan coba lagi.')
        }
      }
    }

    if (token && userId) fetchFollowStatus(userId, token)
  }, [userId, token])

  async function handleFollowToggle() {
    if (!token || !userId) return

    setIsFollowLoading(true)

    try {
      if (!isFollowed) {
        await followUser(userId, token)
      } else {
        await unfollowUser(userId, token)
      }
      setIsFollowLoading(!isFollowed)
      setIsFollowed(!isFollowed)
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message)
      } else {
        setError('Terjadi kesalahan. Silakan coba lagi.')
      }
    } finally {
      setIsFollowLoading(false)
    }
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <UserProfilePageSkeleton />
      </div>
    )
  }

  if (error) return <p>Error: {error}</p>
  if (!profile || !userId) return <p>User profile tidak ditemukan.</p>

  return (
    <div>
      <Navbar/>
      <div className="flex h-screen w-screen p-8 gap-4 bg-gray-50">
        <div className="flex-1 p-8 bg-white rounded-3xl shadow-lg overflow-auto">
          <div className={`flex flex-col md:flex-row gap-8 items-center ${profile.bio ? 'md:items-start' : ''}`}>
            <img
              src={profile.profilePicture}
              alt={`${profile.name}'s profile`}
              className="rounded-full w-36 h-36 object-cover border-4 border-white shadow-md"
            />
            <div className="flex-1 text-center md:text-left space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">{profile.name}</h2>
              {profile.bio && (
                <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
              )}
              {userId !== user?.id ? (
                <FollowButton
                  onClick={isLoggedIn() ? handleFollowToggle : () => navigate('#follow')}
                  name={profile.name}
                  followed={isFollowed}
                  loading={isFollowLoading}
                />
              ) : (
                <LinkButton
                  name="Edit profil"
                  to="/settings/profile"
                />
              )}
            </div>
          </div>
          {!isLoggedIn() && (
            <Modal hash="#follow">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">Follow {profile.name}</h2>
                <LoginPromptContent/>
              </div>
            </Modal>
          )}

          <div className="mt-10 border-t pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div
              onClick={profile.followers > 0 ? () => navigate('#followers') : undefined}
              className={`cursor-pointer group ${profile.followers === 0 ? 'pointer-events-none opacity-50' : ''}`}
            >
              <p className="mb-2 text-sm text-gray-800 font-medium uppercase tracking-wide">Pengikut</p>
              <p className="text-xl text-gray-900 font-bold">{profile.followers}</p>
            </div>
            {profile.followers > 0 && (
              <Modal hash="#followers">
                <h2 className="text-xl font-semibold mb-4">Pengikut</h2>
                {isLoggedIn() && token !== null ? (
                  <SimpleUserList userId={userId} token={token} api={getUserFollowers}/>
                ) : (
                  <LoginPromptContent/>
                )}
              </Modal>
            )}

            <div
              onClick={profile.followings > 0 ? () => navigate('#followings') : undefined}
              className={`cursor-pointer group ${profile.followings === 0 ? 'pointer-events-none opacity-50' : ''}`}
            >
              <p className="mb-2 text-sm text-gray-800 font-medium uppercase tracking-wide">Mengikuti</p>
              <p className="text-xl text-gray-900 font-bold">{profile.followings}</p>
            </div>
            {profile.followings > 0 && (
              <Modal hash="#followings">
                <h2 className="text-xl font-semibold mb-4">Mengikuti</h2>
                {isLoggedIn() && token !== null ? (
                  <SimpleUserList userId={userId} token={token} api={getUserFollowings}/>
                ) : (
                  <LoginPromptContent/>
                )}
              </Modal>
            )}

            <div>
              <p className="mb-2 text-sm text-gray-800 font-medium uppercase tracking-wide">Poin</p>
              <p className="text-xl text-gray-900 font-bold">{profile.points}</p>
            </div>
          </div>
        </div>
        <div className="w-80 rounded-3xl shadow-lg overflow-y-auto">
        </div>
      </div>
    </div>
  )
}

export default UserProfilePage

function UserProfilePageSkeleton() {
  return (
    <div className="flex h-screen w-screen p-8 gap-4 bg-gray-50 animate-pulse">
      <div className="flex-1 p-8 bg-white rounded-3xl shadow-lg overflow-auto">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="rounded-full w-36 h-36 bg-gray-200"/>
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="h-6 w-2/3 bg-gray-200 mx-auto md:mx-0 rounded"/>
            <div className="h-4 w-full bg-gray-100 mx-auto md:mx-0 rounded"/>
            <div className="h-4 w-3/4 bg-gray-100 mx-auto md:mx-0 rounded"/>
            <div className="h-10 w-32 bg-gray-300 mx-auto md:mx-0 rounded-full"/>
          </div>
        </div>
        <div className="mt-10 border-t pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <div className="mb-2 h-4 w-20 bg-gray-200 mx-auto rounded"/>
            <div className="h-6 w-10 bg-gray-300 mx-auto rounded"/>
          </div>
          <div>
            <div className="mb-2 h-4 w-20 bg-gray-200 mx-auto rounded"/>
            <div className="h-6 w-10 bg-gray-300 mx-auto rounded"/>
          </div>
          <div>
            <div className="mb-2 h-4 w-20 bg-gray-200 mx-auto rounded"/>
            <div className="h-6 w-10 bg-gray-300 mx-auto rounded"/>
          </div>
        </div>
      </div>
      <div className="w-80 rounded-3xl shadow-lg overflow-y-auto bg-white p-6 space-y-4">
        <div className="h-6 w-3/4 bg-gray-200 rounded"/>
        <div className="h-4 w-full bg-gray-100 rounded"/>
        <div className="h-4 w-5/6 bg-gray-100 rounded"/>
        <div className="h-4 w-2/3 bg-gray-100 rounded"/>
      </div>
    </div>
  )
}
