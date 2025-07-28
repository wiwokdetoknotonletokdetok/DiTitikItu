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
import { fetchUserBooks } from '@/api/collections'
import BookCard from '@/components/BookCard'
import type { BookSummaryDTO } from '@/dto/BookSummaryDTO'
import toast from 'react-hot-toast'
import ConfirmDialog from '@/components/ConfirmDialog'
import { removeBookFromUser } from '@/api/collections'
import { fetchUserRanking } from '@/api/ranking'
import type { UserRankingDTO } from '@/dto/UserRankingDTO'
import type { PageInfo } from '@/dto/PageInfo'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function UserProfilePage() {
  const navigate = useNavigate()
  const { token, isLoggedIn, user } = useAuth()
  const { userId } = useParams<{ userId: string }>()
  const [profile, setProfile] = useState<UserProfileResponse>()
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFollowed, setIsFollowed] = useState(false)
  const [books, setBooks] = useState<BookSummaryDTO[]>([])
  const [pendingDelete, setPendingDelete] = useState<{ id: string; title: string } | null>(null)
  const [ranking, setRanking] = useState<UserRankingDTO[]>([])
  const [pageInfo, setPageInfo] = useState<PageInfo>()
  const [currentPage, setCurrentPage] = useState(1)

  const handleRemove = async () => {
  if (!pendingDelete) return
    const toastId = toast.loading('Menghapus buku...')
    try {
      await removeBookFromUser(pendingDelete.id)
      setBooks(prev => prev.filter(b => b.id !== pendingDelete.id))
      toast.success('Buku berhasil dihapus.', { id: toastId })
    } catch (err) {
      toast.error('Gagal menghapus buku.', { id: toastId })
    } finally {
      setPendingDelete(null)
    }
  }

  useEffect(() => {
    fetchUserRanking(currentPage, 8)
      .then((res) => {
        setRanking(res.data)
        setPageInfo(res.pageInfo)
      })
      .catch((err) => {
        console.error('Gagal fetch ranking:', err)
      })
  }, [currentPage])

  useEffect(() => {
    async function fetchBooks() {
      if (!userId) return
      try {
        const books = await fetchUserBooks(userId)
        setBooks(books)
      } catch (e) {
        console.error('Gagal mengambil koleksi user:', e)
      }
    }
    fetchBooks()
  }, [userId])

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
      <>
        <Navbar />
        <UserProfilePageSkeleton />
      </>
    )
  }

  if (error) return <p>Error: {error}</p>
  if (!profile || !userId) return <p>User profile tidak ditemukan.</p>

  return (
    <>
      <Navbar/>
      <div className="flex flex-col lg:flex-row gap-4 max-w-7xl w-full mx-auto mb-6 min-h-[85vh]">
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

          <div className="mt-10 border-t pt-6">
          <div className="flex flex-row flex-wrap justify-around text-center gap-6 mb-8">
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

          <div className="mt-16">
            <h3 className="text-lg font-semibold mb-4 text-left px-1">Koleksi</h3>
            {books.length === 0 ? (
              <p className="text-gray-500 px-1">Belum ada buku.</p>
            ) : (
              <div className="overflow-x-auto px-1">
                <div className="inline-flex gap-4 w-max">
                  {books.map((book) => (
                    <div key={book.id} className="w-32 sm:w-40 flex-shrink-0 relative">
                      <BookCard
                        showTitle={false}
                        book={book}
                        onClick={() => navigate(`/${book.id}`)}
                        showRemoveButton={user?.id === userId}
                        onRemove={() => setPendingDelete({ id: book.id, title: book.title })}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
        <ConfirmDialog
          open={!!pendingDelete}
          message={`Apakah Anda yakin ingin menghapus "${pendingDelete?.title}" dari koleksi?`}
          onConfirm={handleRemove}
          onCancel={() => setPendingDelete(null)}
        />
        <div className="w-full lg:w-80 mt-4 lg:mt-0 rounded-3xl shadow-lg overflow-y-auto bg-white">
          <div className="sticky top-0 bg-white z-10 p-6 border-b">
            <div className="flex items-center justify-between">
              <button
                className="p-2 rounded bg-gray-100 hover:bg-gray-200 hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:bg-gray-100 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>

              <div className="text-center flex-1">
                <h2 className="text-xl font-semibold">Peringkat</h2>
                <p className="text-gray-500 text-sm">
                  Halaman {pageInfo?.currentPage} dari {pageInfo?.totalPages}
                </p>
              </div>

              <button
                className="p-2 rounded bg-gray-100 hover:bg-gray-200 hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:bg-gray-100 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={pageInfo && currentPage >= pageInfo.totalPages}
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
          <div className="p-6 pt-4">
            <ul className="space-y-4">
              {ranking.map((user, index) => (
                <li
                  key={user.id}
                  className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 hover:scale-[1.02] transition-transform"
                  onClick={() => navigate(`/profile/${user.id}`)}
                >
                  <span className="text-gray-500 w-5 text-right">
                    {(pageInfo?.size || 10) * (currentPage - 1) + index + 1}.
                  </span>
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.points} poin</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserProfilePage

function UserProfilePageSkeleton() {
  return (
    <div className="flex max-h-[85vh] w-screen gap-4 max-w-7xl mx-auto bg-gray-50 animate-pulse">
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
