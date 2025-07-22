import Navbar from '@/components/Navbar.tsx'
import PrivateRoute from '@/PrivateRoute.tsx'
import { useAuth } from '@/context/AuthContext.tsx'
import UpdateFieldForm from '@/components/UpdateFieldForm.tsx'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import TextArea from '@/components/TextArea.tsx'

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
          title="Edit Bio"
          info={
            <div className="text-xs text-gray-500">
              <p>
                Bio Anda akan terlihat oleh pengguna lain. Jangan memasukkan informasi yang tidak relevan atau tidak pantas.
              </p>
            </div>
          }
        >
          <TextArea
            name="bio"
            label="Bio"
            placeholder=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </UpdateFieldForm>
      </>
    </PrivateRoute>
  )
}
