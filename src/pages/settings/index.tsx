import Navbar from '@/components/Navbar.tsx'
import {
  User,
  Lock,
  LogOut,
  SlidersHorizontal
} from 'lucide-react'
import SettingsItem from '@/components/SettingsItem.tsx'
import { useAuth } from '@/context/AuthContext.tsx'
import { logoutUser } from '@/api/logoutUser.ts'
import { ApiError } from '@/exception/ApiError.ts'
import { useNavigate } from 'react-router-dom'
import PrivateRoute from '@/PrivateRoute.tsx'
import SettingsHeader from '@/components/SettingsHeader.tsx'

function SettingsPage() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await logoutUser(token)
      logout()
      navigate('/auth/login')
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 401) {
        console.log(err.message)
      } else {
        console.log('Terjadi kesalahan. Silakan coba lagi.')
      }
    }
  }

  return (
    <PrivateRoute>
      <div className="px-4 bg-[#FAFAFA] min-h-screen">
        <div className="max-w-7xl mx-auto">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <SettingsHeader>
            Pengaturan
          </SettingsHeader>
          <div className="space-y-4">

            <SettingsItem
              title="Profil"
              description="Lihat dan ubah informasi profil kamu"
              icon={<User className="w-5 h-5 text-gray-500" />}
              to="/settings/profile"
            />

            <SettingsItem
              title="Keamanan"
              description="Ganti kata sandi dan keamanan akun"
              icon={<Lock className="w-5 h-5 text-gray-500" />}
              to="/settings/security"
            />

            <SettingsItem
              title="Preferensi"
              description="Atur preferensi dan pengaturan personalisasi akun"
              icon={<SlidersHorizontal className="w-5 h-5 text-gray-500" />}
              to="/settings/preferences"
            />

            <SettingsItem
              title="Keluar"
              description="Keluar dari akun kamu"
              icon={<LogOut className="w-5 h-5 text-red-500" />}
              danger={true}
              onClick={() => handleLogout()}
            />

          </div>
        </div>
        </div>
      </div>
    </PrivateRoute>
  )
}

export default SettingsPage
