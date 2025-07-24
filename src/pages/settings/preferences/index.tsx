import Navbar from '@/components/Navbar.tsx'
import SettingsItem from '@/components/SettingsItem.tsx'
import PrivateRoute from '@/PrivateRoute.tsx'
import SettingsHeader from '@/components/SettingsHeader.tsx'

function SettingPreferencesPage() {
  return (
    <PrivateRoute>
      <div className="px-4 bg-[#FAFAFA] min-h-screen">
        <div className="max-w-7xl mx-auto">
          <Navbar />
          <div className="max-w-4xl py-8">
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
      </div>
    </PrivateRoute>
  )
}

export default SettingPreferencesPage
