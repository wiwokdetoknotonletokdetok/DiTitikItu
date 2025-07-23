import { useCallback, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { loginUser } from '@/api/loginUser.ts'
import type { WebResponse } from '@/dto/WebResponse.ts'
import type { LoginUserResponse } from '@/dto/LoginUserResponse.ts'
import { ApiError } from '@/exception/ApiError.ts'
import TextInput from '@/components/TextInput.tsx'
import PasswordInput from '@/components/PasswordInput.tsx'
import SubmitButton from '@/components/SubmitButton.tsx'
import FormRedirectLink from '@/components/FormRedirectLink.tsx'
import { useAuth } from '@/context/AuthContext.tsx'
import TextInputError from '@/components/TextInputError.tsx'
import Alert from '@/components/Alert.tsx'

export default function LoginUser() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)

  const [form, setForm] = useState({ email: '', password: '' })
  const [touched, setTouched] = useState({ email: false, password: false })
  const [apiError, setApiError] = useState('')

  const errors = useMemo(() => ({
    email: !form.email && touched.email ? 'Anda belum mengisi alamat email' : '',
    password: !form.password && touched.password ? 'Anda belum mengisi kata sandi' : '',
  }), [form, touched])

  const isValid = useMemo(
    () => Boolean(form.email && form.password),
    [form]
  )

  const handleChange = useCallback((key: 'email' | 'password') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }))
    setTouched(prev => ({ ...prev, [key]: true }))
    setApiError('')
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    setTouched({ email: true, password: true })

    if (!isValid) return

    setIsLoading(true)

    try {
      const response: WebResponse<LoginUserResponse> = await loginUser(form)
      await login(response.data.token)
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 401) {
        setApiError(err.message)
      } else {
        setApiError('Terjadi kesalahan. Silakan coba lagi.')
      }
    } finally {
      setIsLoading(false)
    }
  }, [form, isValid, login, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
      <div className="bg-white shadow-xl rounded-lg px-6 py-8 w-full max-w-md">
        <img
          src="/logo.png"
          alt="Logo DiTitikItu"
          className="mx-auto mb-6 w-32 h-auto"
        />
        <h1 className="text-2xl font-bold text-[#1C2C4C] text-center mb-4">
          Masuk
        </h1>

        {apiError && (
          <Alert
            message={apiError}
            onClose={() => setApiError('')}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            label="Alamat email"
            name="email"
            placeholder="Masukkan email Anda"
            value={form.email}
            onChange={handleChange('email')}
            hasError={!!errors.email}
            validation={errors.email ? <TextInputError message={errors.email} /> : null}
          />

          <PasswordInput
            label="Kata sandi"
            name="password"
            placeholder="Masukkan kata sandi Anda"
            value={form.password}
            onChange={handleChange('password')}
            hasError={!!errors.password}
            validation={errors.password ? <TextInputError message={errors.password} /> : null}
          />

          <SubmitButton type="submit" isLoading={isLoading} disabled={isLoading}>
            Masuk
          </SubmitButton>
        </form>
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"/>
          <span className="mx-4 text-sm text-gray-500 uppercase">atau</span>
          <div className="flex-grow border-t border-gray-300"/>
        </div>
        <Link
          to="/"
          className="flex items-center justify-center w-full h-[42px] text-gray-500 rounded-md border border-gray-300 hover:bg-gray-100 shadow
            font-semibold transition duration-200 ease-in-out"
        >
          Gunakan sebagai tamu
        </Link>

        <FormRedirectLink
          className="mt-4 text-center"
          question="Belum punya akun?"
          linkText="Daftar"
          to="/auth/register"
        />
      </div>
    </div>
  )
}
