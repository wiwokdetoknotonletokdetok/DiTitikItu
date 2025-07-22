import Navbar from '@/components/Navbar.tsx'
import SettingsItem from '@/components/SettingsItem.tsx'
import PrivateRoute from '@/PrivateRoute.tsx'
import SettingsHeader from '@/components/SettingsHeader.tsx'

function SettingPreferencesPage() {
  return (
    <PrivateRoute>
      <div>
        <Navbar/>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <SettingsHeader to="/settings">
            Preferensi
          </SettingsHeader>
          <SettingsItem
            title="Rekomendasi"
            description="Reset rekomendasi buku kamu"
            to="/settings/preferences/recommendations"
          />
        </div>
      </div>
    </PrivateRoute>
  )
}

export default SettingPreferencesPage
