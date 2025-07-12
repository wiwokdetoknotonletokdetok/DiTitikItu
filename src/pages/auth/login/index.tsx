import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '@/api/loginUser.ts'
import type { WebResponse } from '@/dto/WebResponse.ts'
import type { LoginUserResponse } from '@/dto/LoginUserResponse.ts'
import { ApiError } from '@/exception/ApiError.ts'

function LoginUser() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res: WebResponse<LoginUserResponse> = await loginUser({ email, password })
      console.log('Login sukses:', res.data.token)
      navigate('/books')
    } catch (err) {
      console.error('Login error:', err)
      if (err instanceof ApiError) {
        setMessage(err.message)
      }
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Login</button>
      </form>
      
      <p>Belum punya akun? <a href="/auth/register"><strong>Register</strong></a> sekarang!</p>
      {message && <p>{message}</p>}
    </div>
  )
}

export default LoginUser
