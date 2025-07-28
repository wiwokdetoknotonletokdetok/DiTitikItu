import Navbar from '@/components/Navbar.tsx'
import SettingsItem from '@/components/SettingsItem.tsx'
import PrivateRoute from '@/PrivateRoute.tsx'
import SettingsHeader from '@/components/SettingsHeader.tsx'
import InnerContainer from '@/components/InnerContainer.tsx'

function SettingPreferencesPage() {
  return (
    <PrivateRoute>
      <Navbar />
      <InnerContainer>
        <SettingsHeader to="/settings">
          Preferensi
        </SettingsHeader>
        <SettingsItem
          title="Rekomendasi"
          description="Reset rekomendasi buku kamu"
          to="/settings/preferences/recommendations"
        />
      </InnerContainer>
    </PrivateRoute>
  )
}

export default SettingPreferencesPage
