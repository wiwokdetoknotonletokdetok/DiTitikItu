import Navbar from '@/components/Navbar.tsx'
import PrivateRoute from '@/PrivateRoute.tsx'
import { useAuth } from '@/context/AuthContext.tsx'
import UpdateFieldForm from '@/components/UpdateFieldForm.tsx'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCallback, useEffect, useMemo, useState } from 'react'
import TextArea from '@/components/TextArea.tsx'
import { patchUsersMe } from '@/api/usersMe.ts'
import { ApiError } from '@/exception/ApiError.ts'
import TextInputError from '@/components/TextInputError.tsx'
import Alert from '@/components/Alert.tsx'

export default function SettingsProfileNamePage() {
  const { token } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const value = location.state?.value
  const [bio, setBio] = useState(value ?? '')
  const [touched, setTouched] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [apiMessage, setApiMessage] = useState<{message: string, type: 'error' | 'success'}>({message: '', type: 'error'})

  useEffect(() => {
    if (!location.state?.value) {
      navigate(`/settings/profile`)
    }
  }, [location.state?.value, navigate])

  const errorMessage = useMemo(() => {
    if (!touched && !submitAttempted) return ''
    if (bio.length > 150) return 'Bio tidak boleh lebih dari 150 karakter'
    return ''
  }, [bio, touched, submitAttempted])

  const isValid = useMemo(() => errorMessage === '', [errorMessage])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value)
    setTouched(true)
    setApiMessage({message: '', type: 'error'})
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitAttempted(true)

    if (!isValid) return

    setIsLoading(true)
    try {
      await patchUsersMe({ bio }, token)
      setApiMessage({message: 'Bio berhasil diubah.', type: 'success'})
    } catch (err) {
      if (err instanceof ApiError) {
        setApiMessage({message: err.message, type: 'error'})
      } else {
        setApiMessage({message: 'Terjadi kesalahan. Silakan coba lagi.', type: 'error'})
      }
    } finally {
      setIsLoading(false)
    }
  }, [bio, isValid])

  return (
    <PrivateRoute>
      <>
        <Navbar />
        <UpdateFieldForm
          onSubmit={handleSubmit}
          buttonText="Simpan"
          isLoading={isLoading}
          title="Edit Bio"
          info={
            <p className="text-xs text-gray-500 mt-1">
              Bio Anda akan terlihat oleh pengguna lain. Jangan memasukkan informasi yang tidak relevan atau tidak
              pantas.
            </p>
          }
        >
          {apiMessage && (
            <Alert
              type={apiMessage.type}
              message={apiMessage.message}
              onClose={() => setApiMessage({message: '', type: 'error'})}
            />
          )}
          <TextArea
            heightClassName="h-20"
            name="bio"
            label="Bio"
            placeholder=""
            value={bio}
            onChange={handleChange}
            hasError={!!errorMessage}
            validation={errorMessage && <TextInputError message={errorMessage} />}
          />
        </UpdateFieldForm>
      </>
    </PrivateRoute>
  )
}
