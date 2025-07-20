import Navbar from '@/components/Navbar.tsx'
import { useState } from 'react'
import PrivateRoute from '@/PrivateRoute.tsx'

function SettingsPreferencesRecommendationsPage() {
  const [isReset, setIsReset] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleReset = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200))
      setIsReset(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PrivateRoute>
      <div>
        <Navbar/>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Reset Rekomendasi</h1>
          <p className="text-gray-700 mb-4 text-base">
            Dengan mereset rekomendasi, kami akan menghapus data preferensi dan riwayat aktivitas Anda yang digunakan
            untuk memberikan rekomendasi buku.
          </p>
          <ul className="list-disc list-inside space-y-2 mb-6 text-gray-600 text-sm">
            <li>Semua rekomendasi personal Anda akan hilang dan diganti dengan rekomendasi default.</li>
            <li>Anda mungkin membutuhkan beberapa waktu untuk mendapatkan rekomendasi yang relevan kembali.</li>
            <li>Data ini tidak dapat dikembalikan setelah reset dilakukan.</li>
          </ul>

          <button
            onClick={handleReset}
            disabled={loading || isReset}
            className={`w-full max-w-xs py-3 text-white text-base font-semibold rounded-full transition ${
              loading || isReset ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {loading ? 'Mereset...' : isReset ? 'Rekomendasi berhasil direset' : 'Reset Rekomendasi'}
          </button>

          <p className="mt-3 text-gray-500 italic text-xs">
            Reset rekomendasi tidak akan menghapus koleksi buku Anda.
          </p>
        </div>
      </div>
    </PrivateRoute>
  )
}

export default SettingsPreferencesRecommendationsPage
