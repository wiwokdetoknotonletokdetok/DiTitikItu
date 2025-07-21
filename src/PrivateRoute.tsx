import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import type { JSX } from 'react'

export default function PrivateRoute({ children }: { children: JSX.Element }) {
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
