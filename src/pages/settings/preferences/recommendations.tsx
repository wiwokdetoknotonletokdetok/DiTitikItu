import Navbar from '@/components/Navbar.tsx'
import { useState } from 'react'
import PrivateRoute from '@/PrivateRoute.tsx'
import { deleteRecommendationsBooks } from '@/api/recommendationsBooks.ts'
import { useAuth } from '@/context/AuthContext.tsx'
import { ApiError } from '@/exception/ApiError.ts'
import TextInputError from '@/components/TextInputError.tsx'
import SettingsHeader from '@/components/SettingsHeader.tsx'
import InnerContainer from '@/components/InnerContainer.tsx'

function SettingsPreferencesRecommendationsPage() {
  const { token } = useAuth()
  const [isReset, setIsReset] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiMessage, setApiMessage] = useState('')

  const handleReset = async () => {
    setLoading(true)
    setApiMessage('')

    if (!token) return

    try {
      await deleteRecommendationsBooks(token)
      setIsReset(true)
    } catch (err) {
      if (err instanceof ApiError) {
        setApiMessage(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <PrivateRoute>
      <Navbar />
      <InnerContainer>
        <SettingsHeader to="/settings/preferences">
          Reset Rekomendasi
        </SettingsHeader>
        <div>
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
            {loading ? 'Memproses...' : isReset ? 'Rekomendasi berhasil direset' : 'Reset Rekomendasi'}
          </button>
          <p className="mt-3 text-gray-500 italic text-xs">
            Reset rekomendasi tidak akan menghapus koleksi buku Anda.
          </p>
        </div>
        <TextInputError message={apiMessage}/>
      </InnerContainer>
    </PrivateRoute>
  )
}

export default SettingsPreferencesRecommendationsPage
