import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '@/api/registerUser.ts'
import type { WebResponse } from '@/dto/WebResponse.ts'
import { ApiError } from '@/exception/ApiError.ts'
import { Eye, EyeOff } from 'lucide-react'

function RegisterUser() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <img src="/logo.png" alt="Logo DiTitikItu" className="mx-auto mb-6 w-32 h-auto" />
        <h2 className="text-2xl font-bold text-[#1C2C4C] text-center mb-4">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
              placeholder="Nama Lengkap"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
              placeholder="example@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password:</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md p-2 pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Konfirmasi Password:</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md p-2 pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1E497C] text-white py-2 rounded-md hover:bg-[#5C8BC1]"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Sudah punya akun?{' '}
          <a href="/auth/login" className="text-[#1E497C] font-medium hover:underline">
            Login sekarang!
          </a>
        </p>

        {message && <p className="mt-2 text-sm text-red-500 text-center">{message}</p>}
      </div>
    </div>
  )
}

export default RegisterUser
