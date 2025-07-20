import Navbar from '@/components/Navbar.tsx'
import PrivateRoute from '@/PrivateRoute.tsx'

function SettingsProfilePage() {
  return (
    <PrivateRoute>
      <div>
        <Navbar/>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Profil</h1>

        </div>
      </div>
    </PrivateRoute>
  )
}

export default SettingsProfilePage
