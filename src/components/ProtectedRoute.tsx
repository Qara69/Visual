import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, user } = useAppSelector((state) => state.auth)
  
  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}