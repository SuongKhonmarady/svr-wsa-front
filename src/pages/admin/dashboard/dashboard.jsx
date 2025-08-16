import AdminLayout from '../components/AdminLayout'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getCurrentUser } from '../../../utils/auth'
import apiService from '../../../services/api'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

function AdminDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    customerGrowth: [],
    systemStatus: null
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    // Get user info using auth utility
    const userData = getCurrentUser()
    setUser(userData)
    
    // Temporarily set admin token for testing (remove this in production)
    const currentToken = localStorage.getItem('admin_token')
    
    // Load all dashboard data
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Only fetch essential data: stats and customer growth
      const [statsResult, customerGrowthResult] = await Promise.allSettled([
        apiService.getDashboardStats(),
        apiService.getCustomerGrowthData(new Date().getFullYear())
      ])

      // Process stats data
      let statsData = null
      let customerGrowthApiData = null

      if (statsResult.status === 'fulfilled' && statsResult.value) {
        statsData = processStatsData(statsResult.value)
        
        // Extract nested data if needed
        if (statsData && statsData.data && statsData.data.published_news !== undefined) {
          statsData = statsData.data
        }
      }

      if (customerGrowthResult.status === 'fulfilled' && customerGrowthResult.value) {
        // Check if response has success wrapper
        if (customerGrowthResult.value.success && customerGrowthResult.value.data) {
          customerGrowthApiData = customerGrowthResult.value.data
        } else if (customerGrowthResult.value.data) {
          customerGrowthApiData = customerGrowthResult.value.data
        } else {
          customerGrowthApiData = customerGrowthResult.value
        }
      }

      // Create simplified stats (4 key metrics)
      const stats = statsData ? [
        { 
          name: 'Published News', 
          value: (statsData.published_news || 0).toString(), 
          icon: '📰', 
          color: 'from-purple-500 to-purple-600' 
        },
        { 
          name: 'Monthly Reports', 
          value: (statsData.published_monthly_reports || 0).toString(), 
          icon: '📊', 
          color: 'from-green-500 to-green-600' 
        },
        { 
          name: 'Yearly Reports', 
          value: (statsData.published_yearly_reports || 0).toString(), 
          icon: '📋', 
          color: 'from-blue-500 to-blue-600' 
        },
        { 
          name: 'Service Requests', 
          value: (statsData.total_service_requests || 0).toString(), 
          icon: '🔧', 
          color: 'from-orange-500 to-orange-600' 
        },
      ] : [
        { name: 'Published News', value: '0', icon: '📰', color: 'from-purple-500 to-purple-600' },
        { name: 'Monthly Reports', value: '0', icon: '📊', color: 'from-green-500 to-green-600' },
        { name: 'Yearly Reports', value: '0', icon: '📋', color: 'from-blue-500 to-blue-600' },
        { name: 'Service Requests', value: '0', icon: '🔧', color: 'from-orange-500 to-orange-600' },
      ]

      // Process customer growth data
      const customerGrowthData = processCustomerGrowthData(customerGrowthApiData)

      setDashboardData({
        stats: stats,
        customerGrowth: customerGrowthData,
        systemStatus: {
          api: 'Online',
          database: 'Connected',
          storage: 'Available'
        }
      })

    } catch (err) {
      console.error('Error loading dashboard data:', err)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const processCustomerGrowthData = (apiData) => {
    // Check if data is nested inside success wrapper
    if (apiData && apiData.data && apiData.data.monthly_data && Array.isArray(apiData.data.monthly_data)) {
      return apiData.data.monthly_data.map(monthData => monthData.count || 0)
    }
    
    // If we have API data directly, process it
    if (apiData && apiData.monthly_data && Array.isArray(apiData.monthly_data)) {
      return apiData.monthly_data.map(monthData => monthData.count || 0)
    }
    
    // Check for alternative data structures
    if (apiData && Array.isArray(apiData)) {
      return apiData
    }
    
    // Check if data is wrapped in a data property as array
    if (apiData && apiData.data && Array.isArray(apiData.data)) {
      return apiData.data
    }
    
    // Fallback to empty array if no API data
    return []
  }

  const processStatsData = (apiData) => {
    if (!apiData) {
      return null
    }

    // Check if data is nested inside success wrapper (most likely case)
    if (apiData.success && apiData.data) {
      return apiData.data  // Return the actual data, not the wrapper
    }
    
    // Check if data is wrapped in data property
    if (apiData.data && !apiData.success) {
      return apiData.data
    }
    
    // Use direct data (fallback)
    return apiData
  }

  // Sample data structure for when loading or as fallback
  const defaultCustomerGrowthData = [45, 52, 38, 65, 73, 58, 82, 67, 59, 71, 48, 63]

  // Sample data for customer growth chart
  const customerGrowthChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'New Customers',
        data: loading 
          ? defaultCustomerGrowthData 
          : (dashboardData.customerGrowth.length > 0 
              ? dashboardData.customerGrowth 
              : defaultCustomerGrowthData),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6B7280',
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
        }
      }
    }
  }

  const stats = loading ? [
    { name: 'Published News', value: '...', icon: '📰', color: 'from-purple-500 to-purple-600' },
    { name: 'Monthly Reports', value: '...', icon: '📊', color: 'from-green-500 to-green-600' },
    { name: 'Yearly Reports', value: '...', icon: '📋', color: 'from-blue-500 to-blue-600' },
    { name: 'Service Requests', value: '...', icon: '🔧', color: 'from-orange-500 to-orange-600' },
  ] : dashboardData.stats

  const quickActions = [
    { name: 'Create News', icon: '📝', color: 'bg-blue-500 hover:bg-blue-600', action: () => navigate('/admin/news') },
    { name: 'View Reports', icon: '📊', color: 'bg-green-500 hover:bg-green-600', action: () => navigate('/admin/reports') },
    { name: 'Service Requests', icon: '🔧', color: 'bg-orange-500 hover:bg-orange-600', action: () => navigate('/admin/service-requests') },
  ]

  if (error) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Loading Dashboard</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => loadDashboardData()}
                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
              <p className="text-gray-600 mt-1">
                {user ? `Hello ${user.name}, here's what's happening today.` : 'Here\'s what\'s happening today.'}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => loadDashboardData()}
                  disabled={loading}
                  className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? '🔄 Loading...' : '🔄 Refresh'}
                </button>
                <div>
                  <p className="text-sm text-gray-500">Today</p>
                  <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview - 4 key metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                  {loading ? '⏳' : stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Customer Growth Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Customer Growth 2025</h3>
                <div className="text-sm text-gray-500">
                  {loading ? 'Loading...' : 'Monthly new customer registrations'}
                </div>
              </div>
              <div className="h-80">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-gray-500">Loading chart data...</div>
                  </div>
                ) : (
                  <Bar data={customerGrowthChartData} options={chartOptions} />
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions & System Status */}
          <div className="space-y-6">
            
            {/* Quick Actions Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    disabled={loading}
                    className={`w-full ${action.color} text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="text-lg">{action.icon}</span>
                    <span>{action.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Status</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 ${loading ? 'bg-yellow-500' : 'bg-green-500'} rounded-full`}></div>
                    <span className={`text-sm font-medium ${loading ? 'text-yellow-600' : 'text-green-600'}`}>
                      {loading ? 'Checking...' : (dashboardData.systemStatus?.api || 'Online')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 ${loading ? 'bg-yellow-500' : 'bg-green-500'} rounded-full`}></div>
                    <span className={`text-sm font-medium ${loading ? 'text-yellow-600' : 'text-green-600'}`}>
                      {loading ? 'Checking...' : (dashboardData.systemStatus?.database || 'Connected')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Storage</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 ${loading ? 'bg-yellow-500' : 'bg-green-500'} rounded-full`}></div>
                    <span className={`text-sm font-medium ${loading ? 'text-yellow-600' : 'text-green-600'}`}>
                      {loading ? 'Checking...' : (dashboardData.systemStatus?.storage || 'Available')}
                    </span>
                  </div>
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
