import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx'
import Loading from './Loading.jsx'
export default function ProtectedRoute({ admin = false }) {
  const { authenticated, user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <Loading full />
  if (!authenticated) return <Navigate to="/login" state={{ from: location }} replace />
  if (admin && user?.role !== 'admin') return <Navigate to="/" replace />
  return <Outlet />
}
