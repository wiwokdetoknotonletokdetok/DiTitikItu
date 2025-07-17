import { useState } from 'react'
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
import TextInputValidation from '@/components/TextInputError'

function LoginUser() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginFailedMessage, setloginFailedMessage] = useState('')
  const [showErrors, setShowErrors] = useState(false)

  const handleSubmit = async (e: React.MouseEvent | React.FormEvent) => {
    e.preventDefault()
    setloginFailedMessage('')
    setShowErrors(true)

    if (email && password) {
      try {
        const res: WebResponse<LoginUserResponse> = await loginUser({ email, password })
        login(res.data.token)
        navigate('/books')
      } catch (err) {
        if (err instanceof ApiError && err.statusCode == 401) {
          setloginFailedMessage(err.message)
        }
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
      <div className="bg-white shadow-xl rounded-lg px-6 py-8 w-full max-w-md">
        <img src="/logo.png" alt="Logo DiTitikItu" className="mx-auto mb-6 w-32 h-auto"/>
        <h2 className="text-2xl font-bold text-[#1C2C4C] text-center mb-4">Masuk</h2>
        {loginFailedMessage && (
          <div
            className="mb-4 relative bg-red-100 text-red-700 pl-3 pr-8 py-[11px] rounded text-sm">
            <span>{loginFailedMessage}</span>
            <button
              type="button"
              onClick={() => setloginFailedMessage('')}
              className="text-red-700 hover:text-red-900 font-bold text-lg leading-none absolute right-3 inset-y-0 transform text-gray-500"
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
            value={email}
            className="mb-4"
            onChange={(e) => setEmail(e.target.value)}
            hasError={!email && showErrors}
            validation={!email && showErrors ? (
              <TextInputValidation message="Anda belum mengisi alamat email" />
            ) : null}
          />
          <PasswordInput
            label="Kata sandi"
            name="password"
            placeholder="Masukkan kata sandi Anda"
            value={password}
            className="mb-4"
            onChange={(e) => setPassword(e.target.value)}
            hasError={!password && showErrors}
            validation={!password && showErrors ? (
              <TextInputValidation message="Anda belum mengisi kata sandi" />
            ) : null}
          />
          <SubmitButton
            type="submit"
          >
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

export default LoginUser