import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiService from '../../../../services/api'

function AdminMonthlyYearsList() {
    const [years, setYears] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [statistics, setStatistics] = useState({
        totalYears: 0,
        totalReports: 0,
        publishedReports: 0,
        draftReports: 0
    })

    useEffect(() => {
        fetchYears()
    }, [])

    const fetchYears = async () => {
        try {
            setLoading(true)
            setError('')
            
            const result = await apiService.getReportYears()
            
            if (result.error) {
                setError(result.error)
                // Fallback to mock data
                const mockYears = [
                    { id: 1, year_value: 2023, status: 'past', reports_count: 10 },
                    { id: 2, year_value: 2024, status: 'past', reports_count: 12 },
                    { id: 3, year_value: 2025, status: 'current', reports_count: 8 }
                ]
                setYears(mockYears)
                calculateStatistics(mockYears)
                return
            }

            const yearsData = result.data || []
            setYears(yearsData)
            calculateStatistics(yearsData)
            
        } catch (err) {
            console.error('Error fetching years:', err)
            setError('Failed to load years data. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const calculateStatistics = (yearsData) => {
        const totalYears = yearsData.length
        const totalReports = yearsData.reduce((sum, year) => sum + (year.reports_count || 0), 0)
        const publishedReports = yearsData.reduce((sum, year) => sum + (year.published_count || 0), 0)
        const draftReports = yearsData.reduce((sum, year) => sum + (year.draft_count || 0), 0)

        setStatistics({
            totalYears,
            totalReports,
            publishedReports,
            draftReports
        })
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'current':
                return 'bg-green-100 text-green-800'
            case 'future':
                return 'bg-blue-100 text-blue-800'
            case 'past':
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case 'current':
                return 'Current Year'
            case 'future':
                return 'Future Year'
            case 'past':
            default:
                return 'Past Year'
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        📅 Monthly Reports by Year
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Manage monthly reports organized by year
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
                        to="/admin/reports"
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                    >
                        ← Back to Reports
                    </Link>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center">
                        <div className="bg-blue-100 rounded-lg p-3">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4h8m-8 0v8h8v-8m-8 0H6a2 2 0 00-2 2v6a2 2 0 002 2h2m8-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Total Years</p>
                            <p className="text-2xl font-bold text-gray-900">{statistics.totalYears}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center">
                        <div className="bg-green-100 rounded-lg p-3">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <div className="bg-purple-100 rounded-lg p-3">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            </div>

            {/* Error Alert */}
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

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="ml-4 text-gray-600">Loading years...</p>
                </div>
            )}

            {/* Years Grid */}
            {!loading && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Years Overview</h2>
                    
                    {years.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4h8m-8 0v8h8v-8m-8 0H6a2 2 0 00-2 2v6a2 2 0 002 2h2m8-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
                            </svg>
                            <p className="text-gray-500">No years found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {years.map(year => (
                                <div key={year.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-2xl font-bold text-gray-900">{year.year_value}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(year.status)}`}>
                                            {getStatusText(year.status)}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Total Reports:</span>
                                            <span className="font-medium">{year.reports_count || 0}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Published:</span>
                                            <span className="font-medium text-green-600">{year.published_count || 0}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Draft:</span>
                                            <span className="font-medium text-orange-600">{year.draft_count || 0}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Completion:</span>
                                            <span className="font-medium">
                                                {year.reports_count ? Math.round(((year.published_count || 0) / year.reports_count) * 100) : 0}%
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Link
                                            to={`/admin/reports/monthly/${year.year_value}`}
                                            className="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center transition-colors duration-200"
                                        >
                                            📅 View Monthly Reports
                                        </Link>
                                        <Link
                                            to={`/admin/reports/create?type=monthly&year=${year.id}`}
                                            className="block w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-center transition-colors duration-200"
                                        >
                                            ➕ Add Monthly Report
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default AdminMonthlyYearsList
