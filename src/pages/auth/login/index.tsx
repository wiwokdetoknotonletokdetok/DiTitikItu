import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '@/api/loginUser.ts'
import type { WebResponse } from '@/dto/WebResponse.ts'
import type { LoginUserResponse } from '@/dto/LoginUserResponse.ts'
import { ApiError } from '@/exception/ApiError.ts'
import TextInput from '@/components/TextInput'
import PasswordInput from '@/components/PasswordInput'
import SubmitButton from '@/components/SubmitButton'
import FormRedirectLink from '@/components/FormRedirectLink'
import { useAuth } from '@/context/AuthContext'
import { X } from 'lucide-react'
import TextInputError from '@/components/TextInputError'

export default function LoginUser() {
  const { login } = useAuth()
  const navigate = useNavigate()

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

    try {
      const response: WebResponse<LoginUserResponse> = await loginUser(form)
      login(response.data.token)
      navigate('/')
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 401) {
        setApiError(err.message)
      } else {
        console.error(err)
        setApiError('Terjadi kesalahan. Silakan coba lagi.')
      }
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
          <div className="mb-4 relative bg-red-100 text-red-700 pl-3 pr-8 py-[11px] rounded text-sm">
            <span>{apiError}</span>
            <button
              type="button"
              onClick={() => setApiError('')}
              className="absolute right-3 inset-y-0 text-lg leading-none hover:text-red-900"
              aria-label="Tutup pesan kesalahan"
            >
              <X size={16} />
            </button>
          </div>
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

          <SubmitButton type="submit">
            Masuk
          </SubmitButton>
        </form>

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
