import Navbar from '@/components/Navbar.tsx'
import PasswordInput from '@/components/PasswordInput.tsx'
import SubmitButton from '@/components/SubmitButton.tsx'
import PrivateRoute from '@/PrivateRoute.tsx'
import ToolTip from '@/components/Tooltip.tsx'
import { Info } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { ApiError } from '@/exception/ApiError.ts'
import TextInputError from '@/components/TextInputError.tsx'
import Alert from '@/components/Alert.tsx'
import { authPassword } from '@/api/authPassword.ts'
import { useAuth } from '@/context/AuthContext.tsx'
import type { UpdatePasswordRequest } from '@/dto/UpdatePasswordRequest.ts'
import SettingsHeader from '@/components/SettingsHeader.tsx'

function SettingsSecurityPasswordPage() {
  const { token } = useAuth()
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [apiMessage, setApiMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [form, setForm] = useState<UpdatePasswordRequest>({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  })
  const [touched, setTouched] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false
  })

  const hasValidPassword = useCallback((pwd: string) => ({
    notEmpty: pwd.length > 0,
    length: pwd.length >= 8 && pwd.length <= 72,
    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@#$%^&+=!_-]+$/.test(pwd),
  }), [])

  const errors = useMemo(() => {
    const errs: Partial<Record<keyof typeof form, string>> = {}
    if ((touched.currentPassword || submitAttempted) && !form.currentPassword) errs.currentPassword = 'Anda belum mengisi kata sandi saat ini'
    if (touched.newPassword || submitAttempted) {
      const { notEmpty, length, pattern } = hasValidPassword(form.newPassword)
      if (!notEmpty) errs.newPassword = 'Kata sandi tidak boleh kosong'
      else if (!length) errs.newPassword = 'Kata sandi harus 8-72 karakter'
      else if (!pattern) errs.newPassword = 'Kata sandi harus mengandung huruf dan angka'
      else if (form.currentPassword === form.newPassword) errs.newPassword = 'Kata sandi baru harus berbeda dengan kata sandi saat ini'
    }
    if (touched.confirmNewPassword || submitAttempted) {
      if (!form.confirmNewPassword) errs.confirmNewPassword = 'Konfirmasi kata sandi tidak boleh kosong'
      else if (form.newPassword !== form.confirmNewPassword) errs.confirmNewPassword = 'Kata sandi dan konfirmasi tidak sama'
    }
    return errs
  }, [form, touched, submitAttempted, hasValidPassword])

  const { notEmpty, length, pattern } = hasValidPassword(form.newPassword)

  const isFormValid = useMemo(
    () => Object.keys(errors).length === 0 &&
      form.currentPassword !== form.newPassword &&
      form.currentPassword !== '' &&
      notEmpty &&
      length &&
      pattern &&
      form.newPassword === form.confirmNewPassword,
    [errors, form, notEmpty, length, pattern]
  )

  const handleChange = useCallback(
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [key]: e.target.value }))
      setTouched(prev => ({ ...prev, [key]: true }))
      setApiMessage('')
      setIsSuccess(false)
    }, []
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setSubmitAttempted(true)
      setTouched({ currentPassword: true, newPassword: true, confirmNewPassword: true })
      if (!isFormValid) return

      setIsLoading(true)

      try {
        await authPassword(form, token)
        setSubmitAttempted(false)
        setTouched({
          currentPassword: false,
          newPassword: false,
          confirmNewPassword: false
        })
        setForm({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        })
        setIsSuccess(true)
      } catch (err) {
        if (err instanceof ApiError) setApiMessage(err.message)
        else {
          setApiMessage('Terjadi kesalahan. Silakan coba lagi.')
        }
      } finally {
        setIsLoading(false)

      }
    }, [form, isFormValid]
  )

  const showPasswordRules = (touched.newPassword || submitAttempted)

  return (
    <PrivateRoute>
      <div>
        <Navbar/>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <SettingsHeader to="/settings/security">
            Ubah Kata Sandi
          </SettingsHeader>
          <div className="max-w-md">
            {apiMessage && (
              <Alert
                message={apiMessage}
                type="error"
                onClose={() => setApiMessage('')}
              />
            )}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <PasswordInput
                label="Kata sandi saat ini"
                name="currentPassword"
                placeholder="Masukkan kata sandi saat ini"
                value={form.currentPassword}
                onChange={handleChange('currentPassword')}
                hasError={!!errors.currentPassword}
                validation={errors.currentPassword && <TextInputError message={errors.currentPassword} />}
              />
              <PasswordInput
                label="Kata sandi baru"
                name="newPassword"
                placeholder="Minimal 8 karakter, kombinasi huruf & angka"
                value={form.newPassword}
                onChange={handleChange('newPassword')}
                hasError={!!errors.newPassword}
                validation={ showPasswordRules && (
                  <ul className="text-xs mt-3 space-y-1">
                    <li className="flex items-start gap-2">
                      <span
                        className={`mt-[7px] inline-block w-[3px] h-[3px] rounded-full ${form.currentPassword !== form.newPassword ? 'bg-green-600' : 'bg-red-500'}`}></span>
                      <span className={`${form.currentPassword !== form.newPassword ? 'text-green-600' : 'text-red-500'}`}>Kata sandi baru harus berbeda dengan kata sandi saat ini</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span
                        className={`mt-[7px] inline-block w-[3px] h-[3px] rounded-full ${form.newPassword ? 'bg-green-600' : 'bg-red-500'}`}></span>
                      <span className={`${form.newPassword ? 'text-green-600' : 'text-red-500'}`}>Kata sandi tidak boleh kosong</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span
                        className={`mt-[7px] inline-block w-[3px] h-[3px] rounded-full ${length ? 'bg-green-600' : 'bg-red-500'}`}></span>
                      <span
                        className={`${length ? 'text-green-600' : 'text-red-500'}`}>Kata sandi harus 8-72 karakter</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span
                        className={`mt-[7px] inline-block w-[3px] h-[3px] rounded-full ${pattern ? 'bg-green-600' : 'bg-red-500'}`}></span>
                      <div className="flex items-center">
                        <span className={`${pattern ? 'text-green-600' : 'text-red-500'}`}>Kata sandi harus mengandung huruf dan angka</span>
                        <ToolTip message="Dapat menggunakan simbol @#$%^&+=!_-"><Info size={12}
                                                                                      className={`ml-1 ${pattern ? 'text-green-600' : 'text-red-500'}`}/></ToolTip>
                      </div>
                    </li>
                  </ul>
                )}
              />

              <PasswordInput
                label="Konfirmasi kata sandi"
                name="confirmPassword"
                placeholder="Ulangi kata sandi yang sama"
                value={form.confirmNewPassword}
                onChange={handleChange('confirmNewPassword')}
                hasError={!!errors.confirmNewPassword}
                validation={errors.confirmNewPassword && <TextInputError message={errors.confirmNewPassword} />}
              />

              <SubmitButton type="submit" isLoading={isLoading} disabled={isLoading || isSuccess}>
                {!isSuccess ? 'Ubah kata sandi' : 'Tersimpan'}
              </SubmitButton>
            </form>

            <p className="mt-4 text-gray-600 text-sm italic">
              Dengan mengganti kata sandi, pastikan Anda mengingat kata sandi baru.
              Ganti kata sandi secara berkala untuk menjaga keamanan akun Anda.
            </p>
          </div>
        </div>
      </div>
    </PrivateRoute>
  )
}

export default SettingsSecurityPasswordPage
