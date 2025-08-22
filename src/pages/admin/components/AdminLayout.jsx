import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import apiService from '../../../services/api'
import { clearAuth, getCurrentUser } from '../../../utils/auth'

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get current user info
  const currentUser = getCurrentUser()

  // Fetch pending requests count
  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const response = await apiService.getAdminServiceRequests()
        if (response.data && response.data.success) {
          const pendingCount = response.data.data.filter(
            request => request.status?.name?.toLowerCase() === 'pending'
          ).length
          setPendingRequestsCount(pendingCount)
        }
      } catch (error) {
        // Error fetching pending requests count
      }
    }

    fetchPendingCount()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    try {
      // Call logout API to invalidate token on server
      await apiService.logout()
    } catch (error) {
      // Continue with local logout even if API call fails
    } finally {
      // Clear all auth data and redirect
      clearAuth()
      navigate('/home')
    }
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: '🏠' },
    { name: 'News Management', href: '/admin/news', icon: '📰' },
    { name: 'Service Requests', href: '/admin/service-requests', icon: '🔧', badge: pendingRequestsCount > 0 ? pendingRequestsCount : null },
    { name: 'Report Management', href: '/admin/reports', icon: '📋' },
    { name: 'Laws', href: '/admin/laws', icon: '⚖️' },
    { name: 'Data', href: '/admin/data', icon: '📊' },
    { name: 'Contact', href: '/admin/contact', icon: '📞' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <img className="h-8 w-auto" src="/image/svrwsa_logo_high_quality.png" alt="SVRWSA" />
              <span className="ml-2 text-xl font-bold text-gray-900">Admin</span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.href)
                    setSidebarOpen(false)
                  }}
                  className={`w-full text-left group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    location.pathname === item.href
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                  {item.badge && (
                    <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
            {/* Mobile User Info */}
            <div className="mt-6 px-2 border-t border-gray-200 pt-4">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
                  </span>
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">
                    {currentUser ? currentUser.name || currentUser.email : 'Admin'}
                  </div>
                  {currentUser && (
                    <div className="text-xs text-gray-500">
                      {currentUser.role}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  setSidebarOpen(false)
                  handleLogout()
                }}
                className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <img className="h-8 w-auto" src="/image/svrwsa_logo_high_quality.png" alt="SVRWSA" />
              <span className="ml-2 text-xl font-bold text-gray-900">Admin</span>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  className={`w-full text-left group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    location.pathname === item.href
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                  {item.badge && (
                    <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Top navigation */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 p-2 hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-2">
                      {/* Avatar */}
                      <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
                        </span>
                      </div>
                      {/* User Info */}
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-900">
                          Welcome, {currentUser ? currentUser.name || currentUser.email : 'Admin'}
                        </div>
                        {currentUser && (
                          <div className="text-xs text-gray-500">
                            {currentUser.role}
                          </div>
                        )}
                      </div>
                      {/* Dropdown Arrow */}
                      <svg
                        className={`h-4 w-4 text-gray-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="py-1">
                        {/* User Info Section */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="text-sm font-medium text-gray-900">
                            {currentUser ? currentUser.name || currentUser.email : 'Admin User'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {currentUser?.email || 'admin@svrwsa.com'}
                          </div>
                          {currentUser && (
                            <div className="mt-1">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {currentUser.role}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Menu Items */}
                        <div className="py-1">
                          <button
                            onClick={() => {
                              navigate('/admin/profile')
                              setUserDropdownOpen(false)
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <svg className="mr-3 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Profile Settings
                          </button>
                          <button
                            onClick={() => {
                              navigate('/admin/dashboard')
                              setUserDropdownOpen(false)
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <svg className="mr-3 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5h8" />
                            </svg>
                            Dashboard
                          </button>
                        </div>
                        
                        {/* Logout Section */}
                        <div className="border-t border-gray-100 py-1">
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false)
                              handleLogout()
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <svg className="mr-3 h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-6">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
