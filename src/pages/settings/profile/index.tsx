import Navbar from '@/components/Navbar.tsx'
import PrivateRoute from '@/PrivateRoute.tsx'
import { FieldItemWithLoading } from '@/components/FieldItem.tsx'
import { useEffect, useState } from 'react'
import { ApiError } from '@/exception/ApiError.ts'
import { getUserProfile } from '@/api/getUserProfile.ts'
import { useAuth } from '@/context/AuthContext.tsx'
import type { WebResponse } from '@/dto/WebResponse.ts'
import type { UserProfileResponse } from '@/dto/UserProfileResponse.ts'
import SettingsHeader from '@/components/SettingsHeader.tsx'
import PhotoProfileUploader from '@/components/PhotoProfileUploader'
import { deleteProfilePicture, uploadProfilePicture } from '@/api/profilePicture'
import InnerContainer from '@/components/InnerContainer.tsx'

export default function SettingsProfilePage() {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [, setPhotoUrl] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [isUploading, setUploading] = useState(false)
  const [newImage, setNewImage] = useState<File | null>(null)
  const { updateUser } = useAuth()
  const [isUploaded, setIsUploaded] = useState(false)

  useEffect(() => {
    if (!user?.id) return
    const fetchData  = async () => {
      try {
        const res: WebResponse<UserProfileResponse> = await getUserProfile(user.id)
        setEmail(res.data.email)
        setName(res.data.name)
        setBio(res.data.bio)
        setPhotoUrl(res.data.profilePicture)
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

  useEffect(() => {
  if (!newImage) return

  const upload = async () => {
    setUploading(true)
    setIsUploaded(false)
    try {
      await uploadProfilePicture(newImage, token)
      setIsUploaded(true)
      if (user?.id) {
        const res: WebResponse<UserProfileResponse> = await getUserProfile(user.id)
        setPhotoUrl(res.data.profilePicture)
        updateUser({
          ...user,
          profilePicture: res.data.profilePicture
        })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

    upload()
  }, [newImage])

  
  const handleDeletePicture = async () => {
    try {
      await deleteProfilePicture(token)

      if (user?.id) {
        const res: WebResponse<UserProfileResponse> = await getUserProfile(user.id)
        setPhotoUrl(res.data.profilePicture)
        updateUser({ ...user, profilePicture: res.data.profilePicture })
      }
    } catch (e) {
      console.error("Gagal menghapus foto:", e)
    }
  }


  return (
    <PrivateRoute>
      <Navbar/>
      <InnerContainer>
        <SettingsHeader to="/settings">
          Profil
        </SettingsHeader>
        <PhotoProfileUploader
          initialUrl={user?.profilePicture}
          onUpload={(file) => setNewImage(file)}
          onDelete={handleDeletePicture}
          isUploading={isUploading}
          isUploaded={isUploaded}
        />
        <div className="rounded-lg overflow-hidden shadow mt-4">
          <FieldItemWithLoading
            label="Nama"
            value={name}
            to={`/settings/profile/name`}
            state={{ value: name }}
            isLoading={loading}
          />
          <FieldItemWithLoading
            label="Email"
            value={email}
            to={`/settings/profile/email`}
            state={{ value: email }}
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
      </InnerContainer>
    </PrivateRoute>
  )
}
