// Authentication utilities
export const AUTH_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator'
}

/**
 * Get current user from localStorage
 * @returns {Object|null} User object or null if not found/invalid
 */
export const getCurrentUser = () => {
  try {
    const userDataString = localStorage.getItem('admin_user')
    if (!userDataString) return null
    
    const userData = JSON.parse(userDataString)
    return userData
  } catch (error) {
    console.error('Error parsing user data:', error)
    return null
  }
}

/**
 * Get current auth token
 * @returns {string|null} Token or null if not found
 */
export const getAuthToken = () => {
  return localStorage.getItem('admin_token')
}

/**
 * Check if current user has admin role
 * @returns {boolean} True if user is admin
 */
export const isAdmin = () => {
  const user = getCurrentUser()
  return user && user.role === AUTH_ROLES.ADMIN
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid token and user data
 */
export const isAuthenticated = () => {
  const token = getAuthToken()
  const user = getCurrentUser()
  return !!(token && user)
}

/**
 * Check if user is authenticated and has admin role
 * @returns {boolean} True if user is authenticated admin
 */
export const isAuthenticatedAdmin = () => {
  return isAuthenticated() && isAdmin()
}

/**
 * Clear all authentication data
 */
export const clearAuth = () => {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_user')
}

/**
 * Check if user has specific role
 * @param {string} role - Role to check
 * @returns {boolean} True if user has the role
 */
export const hasRole = (role) => {
  const user = getCurrentUser()
  return user && user.role === role
}

/**
 * Get user display name
 * @returns {string} User's name or email
 */
export const getUserDisplayName = () => {
  const user = getCurrentUser()
  return user ? (user.name || user.email) : 'Unknown User'
}
