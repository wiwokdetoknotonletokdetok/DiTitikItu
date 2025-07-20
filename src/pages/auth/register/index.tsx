import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '@/api/registerUser.ts'
import type { WebResponse } from '@/dto/WebResponse.ts'
import { ApiError } from '@/exception/ApiError.ts'
import TextInput from '@/components/TextInput'
import PasswordInput from '@/components/PasswordInput'
import SubmitButton from '@/components/SubmitButton'
import FormRedirectLink from '@/components/FormRedirectLink'
import TextInputError from '@/components/TextInputError'
import { Info, X } from 'lucide-react'
import ToolTip from '@/components/Tooltip.tsx'

export default function RegisterUser() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  })
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [apiMessage, setApiMessage] = useState('')

  const isValidEmail = useCallback((email: string) => {
    const pattern = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/
    return pattern.test(email)
  }, [])

  const hasValidPassword = useCallback((pwd: string) => ({
    notEmpty: pwd.length > 0,
    length: pwd.length >= 8 && pwd.length <= 72,
    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@#$%^&+=!_-]+$/.test(pwd),
  }), [])

  const errors = useMemo(() => {
    const errs: Partial<Record<keyof typeof form, string>> = {}
    if ((touched.name || submitAttempted) && !form.name) errs.name = 'Anda belum mengisi nama lengkap'
    if ((touched.email || submitAttempted)) {
      if (!form.email) errs.email = 'Anda belum mengisi alamat email'
      else if (!isValidEmail(form.email)) errs.email = 'Alamat email yang Anda masukkan tidak valid'
    }
    if ((touched.password || submitAttempted)) {
      const { notEmpty, length, pattern } = hasValidPassword(form.password)
      if (!notEmpty) errs.password = 'Kata sandi tidak boleh kosong'
      else if (!length) errs.password = 'Kata sandi harus 8-72 karakter'
      else if (!pattern) errs.password = 'Kata sandi harus mengandung huruf dan angka'
    }
    if ((touched.confirmPassword || submitAttempted)) {
      if (!form.confirmPassword) errs.confirmPassword = 'Konfirmasi kata sandi tidak boleh kosong'
      else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Kata sandi dan konfirmasi tidak sama'
    }
    return errs
  }, [form, touched, submitAttempted, isValidEmail, hasValidPassword])

  const { notEmpty, length, pattern } = hasValidPassword(form.password)

  const isFormValid = useMemo(
    () => Object.keys(errors).length === 0 &&
      form.name !== '' &&
      form.email !== '' &&
      notEmpty &&
      length &&
      pattern &&
      form.password === form.confirmPassword,
    [errors, form, notEmpty, length, pattern]
  )

  const handleChange = useCallback(
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [key]: e.target.value }))
      setTouched(prev => ({ ...prev, [key]: true }))
      setApiMessage('')
    }, []
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setSubmitAttempted(true)
      setTouched({ name: true, email: true, password: true, confirmPassword: true })
      if (!isFormValid) return
      try {
        const res: WebResponse<string> = await registerUser(form)
        setApiMessage(`Register berhasil: ${res.data}`)
        navigate('/books')
      } catch (err) {
        if (err instanceof ApiError) setApiMessage(err.message)
        else {
          console.error(err)
          setApiMessage('Terjadi kesalahan. Silakan coba lagi.')
        }
      }
    }, [form, isFormValid, navigate]
  )

  const showPasswordRules = (touched.password || submitAttempted)

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

        {apiMessage && (
          <div className="mb-4 relative bg-red-100 text-red-700 pl-3 pr-8 py-[11px] rounded text-sm">
            <span>{apiMessage}</span>
            <button
              type="button"
              onClick={() => setApiMessage('')}
              className="absolute right-3 inset-y-0 hover:text-red-900"
              aria-label="Tutup pesan"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            label="Nama"
            name="name"
            placeholder="Masukkan nama lengkap Anda"
            value={form.name}
            onChange={handleChange('name')}
            hasError={!!errors.name}
            validation={errors.name && <TextInputError message={errors.name} />}
          />

          <TextInput
            label="Alamat email"
            name="email"
            placeholder="contoh: email@domain.com"
            value={form.email}
            onChange={handleChange('email')}
            hasError={!!errors.email}
            validation={errors.email && <TextInputError message={errors.email} />}
          />

          <PasswordInput
            label="Kata sandi"
            name="password"
            placeholder="Minimal 8 karakter, kombinasi huruf & angka"
            value={form.password}
            onChange={handleChange('password')}
            hasError={!!errors.password}
            validation={ showPasswordRules && (
              <ul className="text-xs mt-3 space-y-1">
                <li className="flex items-start gap-2">
                  <span className={`mt-[7px] inline-block w-[3px] h-[3px] rounded-full ${form.password ? 'bg-green-600' : 'bg-red-500'}`}></span>
                  <span className={`${form.password ? 'text-green-600' : 'text-red-500'}`}>Kata sandi tidak boleh kosong</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`mt-[7px] inline-block w-[3px] h-[3px] rounded-full ${length ? 'bg-green-600' : 'bg-gray-500'}`}></span>
                  <span className={`${length ? 'text-green-600' : 'text-gray-500'}`}>8-72 karakter</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`mt-[7px] inline-block w-[3px] h-[3px] rounded-full ${pattern ? 'bg-green-600' : 'bg-gray-500'}`}></span>
                  <div className="flex items-center">
                    <span className={`${pattern ? 'text-green-600' : 'text-gray-500'}`}>Huruf & angka</span>
                    <ToolTip message="Dapat menggunakan simbol @#$%^&+=!_-"><Info size={12} className="ml-1 text-gray-500"/></ToolTip>
                  </div>
                </li>
              </ul>
            )}
          />

          <PasswordInput
            label="Konfirmasi kata sandi"
            name="confirmPassword"
            placeholder="Ulangi kata sandi yang sama"
            value={form.confirmPassword}
            onChange={handleChange('confirmPassword')}
            hasError={!!errors.confirmPassword}
            validation={errors.confirmPassword && <TextInputError message={errors.confirmPassword} />}
          />

          <SubmitButton type="submit">Daftar</SubmitButton>
        </form>
      </div>
    </div>
  )
}
