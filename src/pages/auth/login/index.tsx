import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '@/api/loginUser.ts'
import type { WebResponse } from '@/dto/WebResponse.ts'
import type { LoginUserResponse } from '@/dto/LoginUserResponse.ts'
import { ApiError } from '@/exception/ApiError.ts'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { jwtDecode } from 'jwt-decode'
import { userProfile } from '@/api/userProfile.ts'

function LoginUser() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { setUserId, setName } = useAuth()


  const handleSubmit = async (e: React.MouseEvent | React.FormEvent) => {
    e.preventDefault()

    try {
      const res: WebResponse<LoginUserResponse> = await loginUser({ email, password })

      const token = res.data.token
      localStorage.setItem('token', token)

      const decoded = jwtDecode<{ sub: string }>(token)
      setUserId(decoded.sub)

      const profile = await userProfile(decoded.sub);
      setName(profile.data.name);

      console.log('Login sukses:', token)

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
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <img src="/logo.png" alt="Logo DiTitikItu" className="mx-auto mb-6 w-32 h-auto"/>
        <h2 className="text-2xl font-bold text-[#1C2C4C] text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full border border-gray-300 rounded-md p-2" placeholder='example@example.com' required/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password:</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full border border-gray-300 rounded-md p-2 pr-10" placeholder="••••••••" required/>
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500" tabIndex={-1}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full bg-[#1E497C] text-white py-2 rounded-md hover:bg-[#5C8BC1]">
            Login
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Belum punya akun?{' '}
          <a href="/auth/register" className="text-[#1E497C] font-medium hover:underline">
            Register sekarang!
          </a>
        </p>

        {message && <p className="mt-2 text-sm text-red-500 text-center">{message}</p>}
      </div>
    </div>
  )
}

export default LoginUser