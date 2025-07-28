import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return
  }

  if (!isLoggedIn()) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  return children
}
