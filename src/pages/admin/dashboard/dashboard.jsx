import AdminLayout from '../components/AdminLayout'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getCurrentUser } from '../../../utils/auth'

function AdminDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Get user info using auth utility
    const userData = getCurrentUser()
    setUser(userData)
  }, [])
  const stats = [
    { name: 'Total News', value: '24', icon: '📰', color: 'bg-blue-500' },
    { name: 'Published News', value: '18', icon: '✅', color: 'bg-green-500' },
    { name: 'Draft News', value: '6', icon: '📝', color: 'bg-yellow-500' },
  ]

  const recentNews = [
    { id: 1, title: 'New Water Quality Standards', status: 'Published', date: '2025-07-10' },
    { id: 2, title: 'Infrastructure Development Update', status: 'Draft', date: '2025-07-09' },
    { id: 3, title: 'Community Water Safety Program', status: 'Published', date: '2025-07-08' },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">
            Welcome to SVRWSA Admin Dashboard
            {user && <span className="ml-2 font-medium">- {user.name}</span>}
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`${stat.color} rounded-md p-3`}>
                      <span className="text-white text-2xl">{stat.icon}</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent news */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent News</h3>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                {recentNews.map((news) => (
                  <div key={news.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{news.title}</p>
                      <p className="text-sm text-gray-500">{news.date}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      news.status === 'Published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {news.status}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <button 
                  onClick={() => navigate('/admin/news')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View all news →
                </button>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/admin/news')}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  📰 Create New News
                </button>
                <button 
                  onClick={() => navigate('/admin/reports')}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  📋 Manage Reports
                </button>
                <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  🔧 Add New Service
                </button>
                <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                  📊 Generate Report
                </button>
                <button className="w-full bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                  ⚙️ Settings
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* System status */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">System Status</h3>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-900">API Status</p>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-900">Database</p>
                  <p className="text-xs text-gray-500">Connected</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-900">Storage</p>
                  <p className="text-xs text-gray-500">Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
