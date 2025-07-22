import Navbar from '@/components/Navbar.tsx'
import PrivateRoute from '@/PrivateRoute.tsx'
import { useAuth } from '@/context/AuthContext.tsx'
import TextInput from '@/components/TextInput.tsx'
import UpdateFieldForm from '@/components/UpdateFieldForm.tsx'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function SettingsProfileNamePage() {
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
          title="Edit Nama"
          info={
            <div className="text-xs text-gray-500 mt-1">
              <p>
                Nama Anda akan terlihat oleh pengguna lain, pastikan sesuai dengan yang diinginkan.
              </p>
            </div>
          }
        >
          <TextInput
            name="name"
            label="Nama"
            placeholder=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </UpdateFieldForm>
      </>
    </PrivateRoute>
  )
}
