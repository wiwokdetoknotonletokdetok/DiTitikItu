import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '@/api/registerUser.ts'
import type { WebResponse } from '@/dto/WebResponse.ts'
import { ApiError } from '@/exception/ApiError.ts'
import TextInput from '@/components/TextInput'
import PasswordInput from '@/components/PasswordInput'
import SubmitButton from '@/components/SubmitButton'
import FormRedirectLink from '@/components/FormRedirectLink'

function RegisterUser() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isPasswordTouched, setIsPasswordTouched] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res: WebResponse<string> = await registerUser({ name, email, password, confirmPassword })
      setMessage('Register berhasil: ' + res.data)
      navigate('/books')
    } catch (err) {
      if (err instanceof ApiError) {
        setMessage(err.message)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
      <div className="bg-white shadow-xl rounded-lg px-6 py-8 w-full max-w-md">
        <h1 className="mb-2 text-2xl font-bold text-[#1C2C4C]">Daftar</h1>
        <FormRedirectLink
          className="mb-5"
          question="Sudah punya akun?"
          linkText="Masuk"
          to="/auth/login"
        />
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Nama"
            name="name"
            placeholder="Masukkan nama lengkap Anda"
            value={name}
            className="mb-4"
            onChange={(e) => setName(e.target.value)}
          />
          <TextInput
            label="Alamat email"
            name="email"
            placeholder="Contoh: email@domain.com"
            value={email}
            className="mb-4"
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput
            label="Kata sandi"
            name="password"
            placeholder="Minimal 8 karakter, kombinasi huruf & angka"
            value={password}
            className="mb-4"
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setIsPasswordTouched(true)}
            validation={isPasswordTouched && (
              <ul className="text-xs text-gray-600 mt-3 space-y-1">
                <li className="flex items-start gap-2">
                  <span className="mt-[7px] inline-block w-[3px] h-[3px] bg-[#1E497C] rounded-full"></span>
                  Minimal 8 karakter
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[7px] inline-block w-[3px] h-[3px] bg-[#1E497C] rounded-full"></span>
                  Gunakan kombinasi huruf dan angka
                </li>
              </ul>
            )}
          />
          <PasswordInput
            label="Konfirmasi kata sandi"
            name="confirmPassword"
            placeholder="Ulangi kata sandi yang sama"
            value={confirmPassword}
            className="mb-4"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <SubmitButton
            type="submit"
          >
            Daftar
          </SubmitButton>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  )
}

export default RegisterUser
