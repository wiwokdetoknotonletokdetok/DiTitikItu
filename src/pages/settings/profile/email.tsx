import Navbar from '@/components/Navbar.tsx'
import PrivateRoute from '@/PrivateRoute.tsx'
import { useAuth } from '@/context/AuthContext.tsx'
import TextInput from '@/components/TextInput.tsx'
import UpdateFieldForm from '@/components/UpdateFieldForm.tsx'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function SettingsProfileEmailPage() {
  const { token } = useAuth()
  const location = useLocation()
  const value = location.state?.value
  const [email, setEmail] = useState(value)

  return (
    <PrivateRoute>
      <>
        <Navbar />
        <UpdateFieldForm
          onSubmit={() => {}}
          buttonText="Simpan"
          title="Edit Email"
          info={
            <div className="text-xs text-gray-500 mt-1">
              <p>
                Email Anda digunakan untuk login ke akun ini. Setelah mengganti email, Anda akan menggunakan alamat baru
                untuk login ke akun.
              </p>
              <p className="mt-1">
                Pengguna lain tidak akan dapat melihat email Anda.
              </p>
            </div>
          }
        >
          <TextInput
            name="email"
            label="Email"
            placeholder=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </UpdateFieldForm>
      </>
    </PrivateRoute>
  )
}
