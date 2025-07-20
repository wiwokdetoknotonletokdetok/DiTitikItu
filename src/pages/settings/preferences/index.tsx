import Navbar from '@/components/Navbar.tsx'
import SettingsItem from '@/components/SettingsItem.tsx'
import PrivateRoute from '@/PrivateRoute.tsx'

function SettingPreferencesPage() {
  return (
    <PrivateRoute>
      <div>
        <Navbar/>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Preferensi</h1>
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
