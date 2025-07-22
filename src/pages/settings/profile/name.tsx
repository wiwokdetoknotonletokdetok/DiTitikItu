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
  const [apiMessage, setApiMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

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
    setApiMessage('')
    setIsSuccess(false)
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitAttempted(true)

    if (!isValid) return

    setIsLoading(true)
    try {
      await patchUsersMe({ name }, token)
      setIsSuccess(true)
    } catch (err) {
      if (err instanceof ApiError) {
        setApiMessage(err.message)
      } else {
        setApiMessage('Terjadi kesalahan. Silakan coba lagi.')
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
          to="/settings/profile"
          isSuccess={isSuccess}
          onSubmit={handleSubmit}
          buttonText="Simpan"
          title="Edit Nama"
          isLoading={isLoading}
          isValid={isValid}
          info={
            <p className="text-xs text-gray-500 mt-1">
              Nama Anda akan terlihat oleh pengguna lain, pastikan sesuai dengan yang diinginkan.
            </p>
          }
        >
          {apiMessage && (
            <Alert
              type="error"
              message={apiMessage}
              onClose={() => setApiMessage('')}
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
