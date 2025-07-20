import Navbar from '@/components/Navbar.tsx'
import PasswordInput from '@/components/PasswordInput.tsx'
import SubmitButton from '@/components/SubmitButton.tsx'
import PrivateRoute from '@/PrivateRoute.tsx'

function SettingsSecurityPasswordPage() {
  return (
    <PrivateRoute>
      <div>
        <Navbar/>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Ubah Kata Sandi</h1>
          <div className="max-w-md">
            <form className="space-y-4">
              <PasswordInput
                label="Kata sandi saat ini"
                name="currentPassword"
                placeholder="Masukkan kata sandi saat ini"
                onChange={() => {
                }}
                value=""
              />
              <PasswordInput
                label="Kata sandi baru"
                name="newPassword"
                placeholder="Masukkan kata sandi baru"
                onChange={() => {
                }}
                value=""
              />
              <PasswordInput
                label="Konfirmasi kata sandi baru"
                name="confirmPassword"
                placeholder="Konfirmasi kata sandi baru"
                onChange={() => {
                }}
                value=""
              />
              <SubmitButton type="submit">
                Ubah Password
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
