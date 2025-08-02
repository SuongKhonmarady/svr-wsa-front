import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiService from '../../../../services/api'

function AdminMonthlyYearsList() {
    const [years, setYears] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        console.log('AdminMonthlyYearsList: Component mounted')
        fetchYears()
    }, [])

    const fetchYears = async () => {
        try {
            console.log('AdminMonthlyYearsList: Starting fetch')
            setLoading(true)
            setError('')
            
            console.log('AdminMonthlyYearsList: Calling API...')
            const result = await apiService.getReportYears()
            console.log('AdminMonthlyYearsList: API result:', result)
            
            if (result.error) {
                console.error('AdminMonthlyYearsList: API error:', result.error)
                setError(result.error)
                // Use mock data for testing
                const mockYears = [
                    { id: 1, year_value: 2023, status: 'past', reports_count: 10 },
                    { id: 2, year_value: 2024, status: 'past', reports_count: 12 },
                    { id: 3, year_value: 2025, status: 'current', reports_count: 8 }
                ]
                setYears(mockYears)
                console.log('AdminMonthlyYearsList: Set mock data')
                return
            }

            const yearsData = result.data || []
            console.log('AdminMonthlyYearsList: Setting years:', yearsData)
            setYears(yearsData)
            
        } catch (err) {
            console.error('AdminMonthlyYearsList: Exception:', err)
            setError('Failed to load years data: ' + err.message)
        } finally {
            setLoading(false)
            console.log('AdminMonthlyYearsList: Finished loading')
        }
    }

    console.log('AdminMonthlyYearsList: Rendering - loading:', loading, 'years:', years.length, 'error:', error)

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="ml-4 text-gray-600">Loading years...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">Error: {error}</p>
                    <button 
                        onClick={fetchYears}
                        className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                    >
                        Try Again
                    </button>
                </div>
                {years.length > 0 && (
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Showing cached data:</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {years.map(year => (
                                <div key={year.id} className="border rounded-lg p-4">
                                    <h3 className="text-lg font-bold">{year.year_value}</h3>
                                    <p>Reports: {year.reports_count || 0}</p>
                                    <p>Status: {year.status}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        📅 Monthly Reports by Year
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Manage monthly reports organized by year
                    </p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={fetchYears}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                    >
                        🔄 Refresh
                    </button>
                    <Link
                        to="/admin/reports/create"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                        📄 Create New Report
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Years Overview</h2>
                
                {years.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No years found</p>
                        <button 
                            onClick={fetchYears}
                            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                        >
                            Refresh Data
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {years.map(year => (
                            <div key={year.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-2xl font-bold text-gray-900">{year.year_value}</h3>
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {year.status || 'active'}
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
                                </div>
                                
                                <div className="space-y-2">
                                    <Link
                                        to={`/admin/reports/monthly/${year.year_value}`}
                                        className="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center"
                                    >
                                        📅 View Monthly Reports
                                    </Link>
                                    <Link
                                        to={`/admin/reports/create?type=monthly&year=${year.id}`}
                                        className="block w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-center"
                                    >
                                        ➕ Add Monthly Report
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminMonthlyYearsList
