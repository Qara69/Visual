import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuth = useAppSelector((state) => state.auth.isAuthenticated)
  if (!isAuth) return <Navigate to="/login" replace />
  return <>{children}</>
}