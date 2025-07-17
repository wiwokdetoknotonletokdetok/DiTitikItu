import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '@/api/registerUser.ts'
import type { WebResponse } from '@/dto/WebResponse.ts'
import { ApiError } from '@/exception/ApiError.ts'
import TextInput from '@/components/TextInput'
import PasswordInput from '@/components/PasswordInput'
import SubmitButton from '@/components/SubmitButton'
import FormRedirectLink from '@/components/FormRedirectLink'
import TextInputValidation from '@/components/TextInputError'
import { Info, X } from 'lucide-react'
import ToolTip from '@/components/ToolTip'

function RegisterUser() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [registerFailedMessage, setRegisterFailedMessage] = useState('')
  const [isPasswordTouched, setIsPasswordTouched] = useState(false)
  const [isValidPasswordPattern, setIsValidPasswordPattern] = useState(false)
  const [isValidPasswordLength, setIsValidPasswordLength] = useState(false)
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState('')
  const [showErrors, setShowErrors] = useState(false)
  const [emailError, setEmailError] = useState('')

  function isValidEmail(email: string): boolean {
    const pattern = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/
    return pattern.test(email)
  }

  function validatePasswordPattern(password: string): boolean {
    const pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@#$%^&+=!_-]+$/
    return pattern.test(password)
  }

  function validatePasswordLength(password: string): boolean {
    return password.length >= 8 && password.length <= 72
  }

  function validateConfirmPassword(password: string, confirmPassword: string): boolean {
    return password == confirmPassword;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setShowErrors(true)
    setIsPasswordTouched(true)

    if (!email) {
      setEmailError('Anda belum mengisi alamat email')
    }

    if (!confirmPassword) {
      setConfirmPasswordMessage('Konfirmasi kata sandi tidak boleh kosong')
    }

    if (!validateConfirmPassword(password, confirmPassword)) {
      setConfirmPasswordMessage('Kata sandi dan konfirmasi tidak sama')
    }

    try {
      const res: WebResponse<string> = await registerUser({ name, email, password, confirmPassword })
      setRegisterFailedMessage('Register berhasil: ' + res.data)
      navigate('/books')
    } catch (err) {
      if (err instanceof ApiError) {
        setRegisterFailedMessage(err.message)
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
          {registerFailedMessage && (
            <div
              className="mb-4 relative bg-red-100 text-red-700 pl-3 pr-8 py-[11px] rounded text-sm">
              <span>{registerFailedMessage}</span>
              <button
                type="button"
                onClick={() => setRegisterFailedMessage('')}
                className="text-red-700 hover:text-red-900 font-bold text-lg leading-none absolute right-3 inset-y-0 transform text-gray-500"
                aria-label="Tutup pesan kesalahan"
              >
                <X size={16} />
              </button>
            </div>
          )}
          <TextInput
            label="Nama"
            name="name"
            placeholder="Masukkan nama lengkap Anda"
            value={name}
            className="mb-4"
            onChange={(e) => setName(e.target.value)}
            hasError={!name && showErrors}
            validation={!name && showErrors ? (
              <TextInputValidation message="Anda belum mengisi nama lengkap" />
            ) : null}
          />
          <TextInput
            label="Alamat email"
            name="email"
            placeholder="contoh: email@domain.com"
            value={email}
            className="mb-4"
            onChange={(e) => {
              setEmail(e.target.value)
              if (emailError) setEmailError('')
            }}
            onBlur={() => {
              if (!email && showErrors) {
                setEmailError('Anda belum mengisi alamat email')
              } else if (!isValidEmail(email) && !!email) {
                setEmailError('Alamat email yang Anda masukkan tidak valid')
              } else {
                setEmailError('')
              }
            }}
            hasError={!!emailError}
            validation={ emailError ? (
                <TextInputValidation message={emailError} />
            ) : null}
          />
          <PasswordInput
            label="Kata sandi"
            name="password"
            placeholder="Minimal 8 karakter, kombinasi huruf & angka"
            value={password}
            className="mb-4"
            onChange={(e) => {
              const newPassword = e.target.value
              setPassword(newPassword)

              if (validatePasswordPattern(newPassword)) {
                setIsValidPasswordPattern(true)
              } else {
                setIsValidPasswordPattern(false)
              }

              if (validatePasswordLength(newPassword)) {
                setIsValidPasswordLength(true)
              } else {
                setIsValidPasswordLength(false)
              }
            }}
            onFocus={() => setIsPasswordTouched(true)}
            hasError={!password && showErrors}
            validation={isPasswordTouched && (
              <ul className={`text-xs mt-3 space-y-1
                ${!password && showErrors ? 'text-red-500' : 'text-gray-600'}`}>
                <li className={`flex items-start gap-2
                    ${isValidPasswordLength ? 'text-green-600' : ''}`}>
                    <span className={`mt-[7px] inline-block w-[3px] h-[3px] rounded-full
                      ${isValidPasswordLength ? 'bg-green-600' : !password && showErrors ? 'bg-red-500' : 'bg-[#1E497C]'}`}>
                    </span>
                    Harus 8-72 karakter
                </li>
                <li className={`flex items-start gap-2
                  ${isValidPasswordPattern ? 'text-green-600' : ''}`}>
                  <span className={`mt-[7px] inline-block w-[3px] h-[3px] rounded-full
                    ${isValidPasswordPattern ? 'bg-green-600' : !password && showErrors ? 'bg-red-500' : 'bg-[#1E497C]'}`}>
                  </span>
                  <div className="flex items-center">
                    Harus mengandung huruf dan angka
                    <span className="ml-1 flex items-center">
                      <ToolTip message="Dapat menggunakan simbol @#$%^&+=!_-">
                        <Info size={12}/>
                      </ToolTip>
                    </span>
                  </div>
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
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              if (confirmPasswordMessage) setConfirmPasswordMessage('')
            }}
            onBlur={() => {
              if (!confirmPassword && showErrors) {
                setConfirmPasswordMessage('Konfirmasi kata sandi tidak boleh kosong')
              } else if (!validateConfirmPassword(password, confirmPassword) && !!confirmPassword) {
                setConfirmPasswordMessage('Kata sandi dan konfirmasi tidak sama')
              } else {
                setConfirmPasswordMessage('')
              }
            }}
            hasError={!!confirmPasswordMessage}
            validation={ confirmPasswordMessage ? (
              <TextInputValidation message={confirmPasswordMessage} />
            ) : null}
          />
          <SubmitButton
            type="submit"
          >
            Daftar
          </SubmitButton>
        </form>
      </div>
    </div>
  )
}

export default RegisterUser
