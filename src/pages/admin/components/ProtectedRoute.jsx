import { Navigate } from 'react-router-dom'
import { isAuthenticatedAdmin, clearAuth } from '../../../utils/auth'

function ProtectedRoute({ children }) {
  // Check if user is authenticated and has admin role
  if (!isAuthenticatedAdmin()) {
    // Clear any invalid auth data
    clearAuth()
    return <Navigate to="*" replace />
  }
  
  return children
}

export default ProtectedRoute
