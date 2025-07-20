import Navbar from '@/components/Navbar.tsx'
import SettingsItem from '@/components/SettingsItem.tsx'
import PrivateRoute from '@/PrivateRoute.tsx'

function SettingsSecurityPage() {
  return (
    <PrivateRoute>
      <div>
        <Navbar/>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Keamanan</h1>
          <SettingsItem
            title="Ubah kata sandi"
            description="Mengubah kata sandi akun"
            to="/settings/security/password"
          />
        </div>
      </div>
    </PrivateRoute>
  )
}

export default SettingsSecurityPage
