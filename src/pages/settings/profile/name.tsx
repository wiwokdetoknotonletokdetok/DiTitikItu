import Navbar from '@/components/Navbar.tsx'
import PrivateRoute from '@/PrivateRoute.tsx'
import { useAuth } from '@/context/AuthContext.tsx'
import TextInput from '@/components/TextInput.tsx'
import UpdateFieldForm from '@/components/UpdateFieldForm.tsx'
import TextInputError from '@/components/TextInputError.tsx'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useMemo, useCallback, useEffect } from 'react'
import Alert from '@/components/Alert.tsx'
import { patchUsersMe } from '@/api/usersMe.ts'
import { ApiError } from '@/exception/ApiError.ts'

export default function SettingsProfileNamePage() {
  const { token } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const value = location.state?.value
  const [name, setName] = useState(value ?? '')
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
    if (!name) return 'Nama tidak boleh kosong'
    if (name.length > 50) return 'Nama tidak boleh lebih dari 50 karakter'
    return ''
  }, [name, touched, submitAttempted])

  const isValid = useMemo(() => errorMessage === '', [errorMessage])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    setTouched(true)
    setApiMessage({message: '', type: 'error'})
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitAttempted(true)

    if (!isValid) return

    setIsLoading(true)
    try {
      await patchUsersMe({ name }, token)
      setApiMessage({message: 'Nama berhasil diubah.', type: 'success'})
    } catch (err) {
      if (err instanceof ApiError) {
        setApiMessage({message: err.message, type: 'error'})
      } else {
        setApiMessage({message: 'Terjadi kesalahan. Silakan coba lagi.', type: 'error'})
      }
    } finally {
      setIsLoading(false)
    }
  }, [name, isValid])

  return (
    <PrivateRoute>
      <>
        <Navbar />
        <UpdateFieldForm
          onSubmit={handleSubmit}
          buttonText="Simpan"
          title="Edit Nama"
          isLoading={isLoading}
          info={
            <p className="text-xs text-gray-500 mt-1">
              Nama Anda akan terlihat oleh pengguna lain, pastikan sesuai dengan yang diinginkan.
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
          <TextInput
            name="name"
            label="Nama"
            placeholder=""
            value={name}
            onChange={handleChange}
            hasError={!!errorMessage}
            validation={errorMessage && <TextInputError message={errorMessage} />}
          />
        </UpdateFieldForm>
      </>
    </PrivateRoute>
  )
}
