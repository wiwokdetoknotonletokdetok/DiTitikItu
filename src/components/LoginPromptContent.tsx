import { useNavigate } from 'react-router-dom'
import SubmitButton from '@/components/SubmitButton'

export default function LoginPromptContent() {
  const navigate = useNavigate()

  return (
    <div>
      <p className="mb-5">
        Silakan masuk terlebih dahulu untuk mengakses fitur ini.
      </p>
      <SubmitButton
        onClick={() => navigate('/auth/login')}
        type="button"
      >
        Masuk
      </SubmitButton>
    </div>
  )
}
