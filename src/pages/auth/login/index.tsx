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

function LoginUser() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.MouseEvent | React.FormEvent) => {
    e.preventDefault()

    try {
      const res: WebResponse<LoginUserResponse> = await loginUser({ email, password })
      login(res.data.token)
      navigate('/books')
    } catch (err) {
      console.error('Login error:', err)
      if (err instanceof ApiError) {
        setMessage(err.message)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
      <div className="bg-white shadow-xl rounded-lg px-6 py-8 w-full max-w-md">
        <img src="/logo.png" alt="Logo DiTitikItu" className="mx-auto mb-6 w-32 h-auto"/>
        <h2 className="text-2xl font-bold text-[#1C2C4C] text-center mb-4">Masuk</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            label="Alamat email"
            name="email"
            placeholder="Masukkan email Anda"
            value={email}
            className="mb-4"
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput
            label="Kata sandi"
            name="password"
            placeholder="Masukkan kata sandi Anda"
            value={password}
            className="mb-4"
            onChange={(e) => setPassword(e.target.value)}
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

        {message && <p className="mt-2 text-sm text-red-500 text-center">{message}</p>}
      </div>
    </div>
  )
}

export default LoginUser