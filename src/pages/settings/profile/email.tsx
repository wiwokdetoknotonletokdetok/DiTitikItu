import Navbar from '@/components/Navbar.tsx'
import PrivateRoute from '@/PrivateRoute.tsx'
import { useAuth } from '@/context/AuthContext.tsx'
import TextInput from '@/components/TextInput.tsx'
import UpdateFieldForm from '@/components/UpdateFieldForm.tsx'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCallback, useEffect, useMemo, useState } from 'react'
import TextInputError from '@/components/TextInputError.tsx'
import { ApiError } from '@/exception/ApiError.ts'
import { patchUsersMe } from '@/api/usersMe.ts'
import Alert from '@/components/Alert.tsx'
import InnerContainer from '@/components/InnerContainer.tsx'

export default function SettingsProfileEmailPage() {
  const { token } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const value = location.state?.value
  const [email, setEmail] = useState(value ?? null)
  const [touched, setTouched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [apiMessage, setApiMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (!(typeof email == 'string')) {
      navigate(`/settings/profile`)
    }
  }, [location.state?.value, navigate])

  const isValidEmail = useCallback((email: string) => {
    const pattern = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/
    return pattern.test(email)
  }, [])

  const errorMessage = useMemo(() => {
    if (!touched && !submitAttempted) return ''
    if (!email) return 'Anda belum mengisi alamat email'
    if (!isValidEmail(email)) return 'Alamat email yang Anda masukkan tidak valid'
    return ''
  }, [email, touched, submitAttempted, isValidEmail])

  const isValid = useMemo(() => {
    return errorMessage === '' && isValidEmail(email)
  }, [email, isValidEmail])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
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
      await patchUsersMe({ email }, token)
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
  }, [email, isValid])

  return (
    <PrivateRoute>
      <Navbar />
      <InnerContainer>
        <UpdateFieldForm
          to="/settings/profile"
          isSuccess={isSuccess}
          onSubmit={handleSubmit}
          buttonText="Simpan"
          isLoading={isLoading}
          isValid={isValid}
          title="Edit Email"
          info={
            <div className="text-xs text-gray-500 mt-1">
              <p>
                Email Anda digunakan untuk login ke akun ini. Setelah mengganti email, Anda akan menggunakan alamat baru
                untuk login ke akun.
              </p>
              <p className="mt-1">
                Pengguna lain tidak akan dapat melihat email Anda.
              </p>
            </div>
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
            label="Alamat email"
            name="email"
            placeholder="contoh: email@domain.com"
            value={email}
            onChange={handleChange}
            hasError={!!errorMessage}
            validation={errorMessage && <TextInputError message={errorMessage} />}
          />
        </UpdateFieldForm>
      </InnerContainer>
    </PrivateRoute>
  )
}
