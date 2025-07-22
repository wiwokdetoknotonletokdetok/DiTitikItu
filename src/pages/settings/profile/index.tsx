import Navbar from '@/components/Navbar.tsx'
import PrivateRoute from '@/PrivateRoute.tsx'
import { FieldItemWithLoading } from '@/components/FieldItem.tsx'
import { useEffect, useState } from 'react'
import { ApiError } from '@/exception/ApiError.ts'
import { getUserProfile } from '@/api/getUserProfile.ts'
import { useAuth } from '@/context/AuthContext.tsx'
import type { WebResponse } from '@/dto/WebResponse.ts'
import type { UserProfileResponse } from '@/dto/UserProfileResponse.ts'

export default function SettingsProfilePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')


  useEffect(() => {
    if (!user?.id) return
    const fetchData  = async () => {
      try {
        const res: WebResponse<UserProfileResponse> = await getUserProfile(user.id)
        setEmail(res.data.email)
        setName(res.data.name)
        setBio(res.data.bio)
        setLoading(false)
      } catch (err) {
        console.error(err)
        if (err instanceof ApiError) {
          console.log(err.message)
        }
      }
    }

    fetchData()
  }, [user?.id])

  return (
    <PrivateRoute>
      <div>
        <Navbar/>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Profil</h1>
          <div className="rounded-lg overflow-hidden shadow mt-4">
            <FieldItemWithLoading
              label="Email"
              value={email}
              to={`/settings/profile/email`}
              state={{ value: email }}
              isLoading={loading}
            />
            <FieldItemWithLoading
              label="Nama"
              value={name}
              to={`/settings/profile/name`}
              state={{ value: name }}
              isLoading={loading}
            />
            <FieldItemWithLoading
              label="Bio"
              value={bio}
              to={`/settings/profile/bio`}
              state={{ value: bio }}
              isLoading={loading}
            />
          </div>
        </div>
      </div>
    </PrivateRoute>
  )
}
