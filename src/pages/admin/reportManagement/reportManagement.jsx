import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import apiService from '../../../services/api'

function ReportManagement() {
    const navigate = useNavigate()
    const location = useLocation()
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [statistics, setStatistics] = useState({
        totalReports: 0,
        publishedReports: 0,
        draftReports: 0,
        completionRate: 0
    })

    // Check for success message from navigation state
    useEffect(() => {
        if (location.state?.message) {
            setSuccess(location.state.message)
            // Clear the state to prevent showing message on refresh
            window.history.replaceState({}, document.title)
        }
    }, [location.state])

    // Load reports on component mount
    useEffect(() => {
        loadReports()
    }, [])

    // Load all reports
    const loadReports = async () => {
        try {
            setLoading(true)
            setError('')

            const result = await apiService.getMonthlyReports()

            if (result.error) {
                setError(result.error)
                setReports([])
                setStatistics({
                    totalReports: 0,
                    publishedReports: 0,
                    draftReports: 0,
                    completionRate: 0
                })
                return
            }


            // Handle paginated API response: { data: { data: [...] } }
            let reportsData = []
            if (Array.isArray(result.data)) {
                reportsData = result.data
            } else if (result.data && Array.isArray(result.data.data)) {
                reportsData = result.data.data
            } else if (result.data && Array.isArray(result.data.reports)) {
                reportsData = result.data.reports
            } else {
                reportsData = []
            }

            setReports(reportsData)

            // Calculate statistics
            const totalReports = reportsData.length
            const publishedReports = reportsData.filter(r => r.status === 'published').length
            const draftReports = reportsData.filter(r => r.status === 'draft').length
            const completionRate = totalReports > 0 ? Math.round((publishedReports / totalReports) * 100) : 0

            setStatistics({
                totalReports,
                publishedReports,
                draftReports,
                completionRate
            })

        } catch (err) {
            console.error('Error loading reports:', err)
            setError('Failed to load reports. Please try again.')
            setReports([])
            setStatistics({
                totalReports: 0,
                publishedReports: 0,
                draftReports: 0,
                completionRate: 0
            })
        } finally {
            setLoading(false)
        }
    }

    // Delete report with confirmation
    const handleDeleteReport = async (id) => {
        if (window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
            try {
                const result = await apiService.deleteMonthlyReport(id)
                
                if (result.error) {
                    setError(result.error)
                    return
                }
                
                // Remove from local state
                setReports(prev => prev.filter(r => r.id !== id))
                setSuccess('Report deleted successfully')
                
                // Recalculate statistics
                const updatedReports = reports.filter(r => r.id !== id)
                const totalReports = updatedReports.length
                const publishedReports = updatedReports.filter(r => r.status === 'published').length
                const draftReports = updatedReports.filter(r => r.status === 'draft').length
                const completionRate = Math.round((publishedReports / totalReports) * 100) || 0

                setStatistics({
                    totalReports,
                    publishedReports,
                    draftReports,
                    completionRate
                })
                
            } catch (err) {
                console.error('Error deleting report:', err)
                setError('Failed to delete report')
            }
        }
    }

    // Publish/Unpublish report
    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'published' ? 'draft' : 'published'
            
            let result
            if (newStatus === 'published') {
                result = await apiService.publishMonthlyReport(id)
            } else {
                result = await apiService.unpublishMonthlyReport(id)
            }
            
            if (result.error) {
                setError(result.error)
                return
            }
            
            // Update local state
            setReports(prev => prev.map(r => 
                r.id === id ? { ...r, status: newStatus } : r
            ))
            
            setSuccess(`Report ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`)
            
        } catch (err) {
            console.error('Error toggling report status:', err)
            setError('Failed to update report status')
        }
    }

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    // Get month name
    const getMonthName = (monthNumber) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ]
        return months[monthNumber - 1] || 'Unknown'
    }

    // Auto-hide success/error messages after 5 seconds
    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
                setSuccess('')
                setError('')
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [success, error])

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            📊 Reports Management
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Manage monthly and yearly reports with PDF uploads
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <Link
                            to="/admin/reports/create"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                        >
                            📄 Create New Report
                        </Link>
                        <Link
                            to="/admin/reports/monthly-years"
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                        >
                            📅 Monthly Reports
                        </Link>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center">
                            <div className="bg-blue-100 rounded-lg p-3">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Total Reports</p>
                                <p className="text-2xl font-bold text-gray-900">{statistics.totalReports}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center">
                            <div className="bg-green-100 rounded-lg p-3">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Published</p>
                                <p className="text-2xl font-bold text-gray-900">{statistics.publishedReports}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center">
                            <div className="bg-orange-100 rounded-lg p-3">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Draft</p>
                                <p className="text-2xl font-bold text-gray-900">{statistics.draftReports}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center">
                            <div className="bg-purple-100 rounded-lg p-3">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Completion Rate</p>
                                <p className="text-2xl font-bold text-gray-900">{statistics.completionRate}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-800">{error}</p>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-green-800">{success}</p>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="ml-4 text-gray-600">Loading reports...</p>
                    </div>
                )}

                {/* Reports List */}
                {!loading && (
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">All Reports</h2>
                        
                        {reports.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-gray-500">No reports found</p>
                                <Link
                                    to="/admin/reports/create"
                                    className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                                >
                                    📄 Create Your First Report
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {reports.map(report => (
                                    <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                report.status === 'published' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-orange-100 text-orange-800'
                                            }`}>
                                                {report.status}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {report.year} - {getMonthName(report.month)}
                                            </span>
                                        </div>
                                        
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                            {report.title}
                                        </h3>
                                        
                                        {report.description && (
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                {report.description}
                                            </p>
                                        )}
                                        
                                        {report.file_url && (
                                            <div className="mb-3 p-2 bg-gray-50 rounded text-sm">
                                                <span className="text-gray-600">📁 File attached</span>
                                                {report.file_size && (
                                                    <span className="text-gray-500 ml-2">
                                                        ({formatFileSize(report.file_size)})
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        
                                        <div className="flex space-x-2">
                                            <Link
                                                to={`/admin/reports/edit/monthly/${report.id}`}
                                                className="flex-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center transition-colors duration-200"
                                            >
                                                ✏️ Edit
                                            </Link>
                                            <button
                                                onClick={() => handleToggleStatus(report.id, report.status)}
                                                className={`flex-1 px-3 py-2 text-sm rounded-lg text-center transition-colors duration-200 ${
                                                    report.status === 'published'
                                                        ? 'bg-orange-600 hover:bg-orange-700 text-white'
                                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                                }`}
                                            >
                                                {report.status === 'published' ? '📝 Unpublish' : '✅ Publish'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteReport(report.id)}
                                                className="px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                        
                                        {report.file_url && (
                                            <a
                                                href={report.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full mt-2 px-3 py-2 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-center transition-colors duration-200"
                                            >
                                                👁️ View PDF
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}

export default ReportManagement
