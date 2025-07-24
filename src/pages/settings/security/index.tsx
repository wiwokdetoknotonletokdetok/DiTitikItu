import Navbar from '@/components/Navbar.tsx'
import SettingsItem from '@/components/SettingsItem.tsx'
import PrivateRoute from '@/PrivateRoute.tsx'
import SettingsHeader from '@/components/SettingsHeader.tsx'

function SettingsSecurityPage() {
  return (
    <PrivateRoute>
      <div>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <SettingsHeader to="/settings">
            Keamanan
          </SettingsHeader>
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
