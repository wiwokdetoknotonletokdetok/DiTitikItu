import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '@/api/registerUser.ts'
import type { WebResponse } from '@/dto/WebResponse.ts'
import { ApiError } from '@/exception/ApiError.ts'

function RegisterUser() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res: WebResponse<string> = await registerUser({ name, email, password, confirmPassword })
      setMessage('Register berhasil: ' + res.data)
      navigate('/login')
    } catch (err) {
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
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

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

        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button type="submit">Register</button>
      </form>
      <p>Sudah punya akun? <a href="/auth/login"><strong>Login</strong></a> sekarang!</p>
      {message && <p>{message}</p>}
    </div>
  )
}

export default RegisterUser
