import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiService from '../../../../../services/api'

function MonthlyYearsList() {
    const [years, setYears] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Fetch years data from API
    const fetchYears = async () => {
        try {
            setLoading(true)
            setError('')
            
            const result = await apiService.getReportYears()
            
            console.log('Years API Response:', result)
            
            if (result.error) {
                setError(result.error)
                return
            }

            // Handle different response structures
            let yearsData = []
            if (Array.isArray(result.data)) {
                yearsData = result.data
            } else if (result.data && result.data.data && Array.isArray(result.data.data)) {
                yearsData = result.data.data
            } else {
                console.error('Unexpected years response format:', result)
                setError('Unexpected response format from server')
                return
            }

            // Sort years in descending order (most recent first)
            const sortedYears = yearsData.sort((a, b) => b.year_value - a.year_value)

            setYears(sortedYears)
            
        } catch (err) {
            console.error('Error fetching years:', err)
            setError('មិនអាចទាញយកទិន្នន័យបាន។ សូមព្យាយាមម្តងទៀត។')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchYears()
    }, [])

    const handleRetry = () => {
        fetchYears()
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        របាយការណ៍ប្រចាំខែ
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        ជ្រើសរើសឆ្នាំដើម្បីមើលរបាយការណ៍ប្រចាំខែទាំងអស់
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="ml-4 text-gray-600">កំពុងផ្ទុកទិន្នន័យ...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-red-800 font-medium">{error}</p>
                            </div>
                            <button
                                onClick={handleRetry}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                            >
                                ព្យាយាមម្តងទៀត
                            </button>
                        </div>
                    </div>
                )}

                {/* Years Grid */}
                {!loading && !error && (
                    <>
                        {years.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {years.map(year => (
                                    <Link
                                        key={year.id}
                                        to={`/data/monthly/${year.year_value}`}
                                        className="group"
                                    >
                                        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-200">
                                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                                                <div className="text-center">
                                                    <h3 className="text-3xl font-bold mb-2">{year.year_value}</h3>
                                                    <p className="text-blue-100 text-sm">ឆ្នាំ</p>
                                                </div>
                                            </div>
                                            
                                            <div className="p-6">
                                                <div className="text-center">
                                                    <div className="mb-4">
                                                        <svg className="w-8 h-8 mx-auto text-blue-500 group-hover:text-blue-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-gray-600 text-sm mb-4">មើលរបាយការណ៍ប្រចាំខែ</p>
                                                    <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-700 transition-colors duration-200">
                                                        <span className="text-sm font-medium">មើលរបាយការណ៍</span>
                                                        <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2M8 7v5a2 2 0 002 2h4a2 2 0 002-2V7" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">មិនមានទិន្នន័យ</h3>
                                <p className="text-gray-500">មិនមានទិន្នន័យឆ្នាំសម្រាប់របាយការណ៍ប្រចាំខែ</p>
                            </div>
                        )}
                    </>
                )}

                {/* Statistics Section */}
                {!loading && !error && years.length > 0 && (
                    <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">ស្ថិតិទូទៅ</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600 mb-2">
                                    {years.length}
                                </div>
                                <p className="text-gray-700">ឆ្នាំសរុប</p>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600 mb-2">
                                    {years.length > 0 ? years[0].year_value : 0}
                                </div>
                                <p className="text-gray-700">ឆ្នាំចុងក្រោយ</p>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600 mb-2">
                                    {years.length > 0 ? years[years.length - 1].year_value : 0}
                                </div>
                                <p className="text-gray-700">ឆ្នាំដំបូង</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MonthlyYearsList
