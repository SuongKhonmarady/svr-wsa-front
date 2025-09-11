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
  const [customerGrowthError, setCustomerGrowthError] = useState(null)

  useEffect(() => {
    // Get user info using auth utility
    const userData = getCurrentUser()
    setUser(userData)

    // Load all dashboard data
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      setCustomerGrowthError(null)

      // Fetch essential data: stats and customer growth (stats already includes all counts)
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
      } else {
        // Set customer growth error if the API call failed
        setCustomerGrowthError('Failed to load customer growth data')
      }

      // Create simplified stats using data from dashboard stats API
      const stats = statsData ? [
        {
          name: 'Published News',
          value: (statsData.published_news || 0).toString(),
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          ),
          color: 'from-purple-500 to-purple-600'
        },
        {
          name: 'Monthly Reports',
          value: `${statsData.published_monthly_reports || 0}/${statsData.total_monthly_reports || 0}`,
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ),
          color: 'from-green-500 to-green-600',
          subtitle: `${(statsData.total_monthly_reports || 0) - (statsData.published_monthly_reports || 0)} draft, ${statsData.published_monthly_reports || 0} published`
        },
        {
          name: 'Yearly Reports',
          value: `${statsData.published_yearly_reports || 0}/${statsData.total_yearly_reports || 0}`,
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
          color: 'from-blue-500 to-blue-600',
          subtitle: `${(statsData.total_yearly_reports || 0) - (statsData.published_yearly_reports || 0)} draft, ${statsData.published_yearly_reports || 0} published`
        },
        {
          name: 'Service Requests',
          value: (statsData.total_service_requests || 0).toString(),
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
          color: 'from-orange-500 to-orange-600',
          subtitle: `${statsData.pending_service_requests || 0} pending, ${statsData.completed_service_requests || 0} completed`
        },
      ] : [
        {
          name: 'Published News',
          value: '0',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          ),
          color: 'from-purple-500 to-purple-600'
        },
        {
          name: 'Monthly Reports',
          value: '0/0',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ),
          color: 'from-green-500 to-green-600',
          subtitle: '0 draft, 0 published'
        },
        {
          name: 'Yearly Reports',
          value: '0/0',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
          color: 'from-blue-500 to-blue-600',
          subtitle: '0 draft, 0 published'
        },
        {
          name: 'Service Requests',
          value: '0',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
          color: 'from-orange-500 to-orange-600',
          subtitle: '0 pending, 0 completed'
        },
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

  // Sample data for customer growth chart
  const customerGrowthChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'New Customers',
        data: loading
          ? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          : (dashboardData.customerGrowth.length > 0
            ? dashboardData.customerGrowth
            : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
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
    {
      name: 'Published News', value: '...', icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ), color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Monthly Reports', value: '...', icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ), color: 'from-green-500 to-green-600', subtitle: 'Loading...'
    },
    {
      name: 'Yearly Reports', value: '...', icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ), color: 'from-blue-500 to-blue-600', subtitle: 'Loading...'
    },
    {
      name: 'Service Requests', value: '...', icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ), color: 'from-orange-500 to-orange-600'
    },
  ] : dashboardData.stats

  const quickActions = [
    {
      name: 'Create News', icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ), color: 'bg-blue-500 hover:bg-blue-600', action: () => navigate('/admin/news')
    },
    {
      name: 'View Reports', icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ), color: 'bg-green-500 hover:bg-green-600', action: () => navigate('/admin/reports')
    },
    {
      name: 'Service Requests', icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ), color: 'bg-orange-500 hover:bg-orange-600', action: () => navigate('/admin/service-requests')
    },
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
             
            <div className="text-left">
              <div className="flex items-center space-x-4">
                
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
            <button
                  onClick={() => loadDashboardData()}
                  disabled={loading}
                  className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh
                    </>
                  )}
                </button>
          </div>
        </div>

        {/* Stats Overview - 4 key metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  {stat.subtitle && (
                    <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                  )}
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0 ml-4`}>
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
                <h3 className="text-xl font-semibold text-gray-900">Customer Growth {new Date().getFullYear()}</h3>
                <div className="text-sm text-gray-500">
                  {loading ? 'Loading...' : 'Monthly new customer registrations'}
                </div>
              </div>
              <div className="h-80">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-gray-500">Loading chart data...</div>
                  </div>
                ) : customerGrowthError ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="text-red-500 text-lg mb-2">
                        <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <div className="text-red-600 font-medium">Something went wrong</div>
                      <div className="text-gray-500 text-sm mt-1">Unable to load customer growth data</div>
                      <button
                        onClick={() => loadDashboardData()}
                        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                      >
                        Try Again
                      </button>
                    </div>
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
            {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
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
            </div> */}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
