import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import apiService from '../../../../../services/api'

function MonthlyYearlyReports() {
    const { year } = useParams()
    const [monthlyReports, setMonthlyReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [months, setMonths] = useState([])

    // Khmer month names mapping
    const khmerMonthNames = {
        'January': 'មករា',
        'February': 'កុម្ភៈ',
        'March': 'មីនា',
        'April': 'មេសា',
        'May': 'ឧសភា',
        'June': 'មិថុនា',
        'July': 'កក្កដា',
        'August': 'សីហា',
        'September': 'កញ្ញា',
        'October': 'តុលា',
        'November': 'វិច្ឆិកា',
        'December': 'ធ្នូ'
    }

    // Fetch months data from API
    const fetchMonths = async () => {
        try {
            const result = await apiService.getReportMonths()
            
            if (result.error) {
                console.error('Error fetching months:', result.error)
                return []
            }

            let monthsData = []
            if (Array.isArray(result.data)) {
                monthsData = result.data
            } else if (result.data && result.data.data && Array.isArray(result.data.data)) {
                monthsData = result.data.data
            } else {
                console.error('Unexpected months response format:', result)
                return []
            }

            // Transform API data to include Khmer names
            const transformedMonths = monthsData.map(month => ({
                id: month.id,
                name: khmerMonthNames[month.month] || month.month,
                nameEn: month.month,
                created_at: month.created_at,
                updated_at: month.updated_at
            }))

            return transformedMonths
        } catch (error) {
            console.error('Error fetching months:', error)
            return []
        }
    }

    // Fetch monthly reports for the specific year
    const fetchMonthlyReports = async () => {
        try {
            setLoading(true)
            setError('')
            
            // Fetch months and reports in parallel
            const [monthsData, reportsResult] = await Promise.all([
                fetchMonths(),
                apiService.getMonthlyReportsByYear(year)
            ])

            setMonths(monthsData)

            if (reportsResult.error) {
                setError(reportsResult.error)
                return
            }

            // Validate the response structure
            if (!reportsResult.data) {
                setError('Invalid response format from server')
                return
            }

            // Handle different response structures
            let reports = []
            if (Array.isArray(reportsResult.data)) {
                reports = reportsResult.data
            } else if (reportsResult.data.data && Array.isArray(reportsResult.data.data)) {
                reports = reportsResult.data.data
            } else {
                console.error('Unexpected response format:', reportsResult)
                setError('Unexpected response format from server')
                return
            }

            // Validate each report object
            const validReports = reports.filter(report => {
                return report && typeof report === 'object' && 
                       report.id && report.month_id && 
                       (report.year_id || report.report_date)
            })

            // Create monthly structure
            const monthlyData = monthsData.map(month => {
                const monthReport = validReports.find(report => report.month_id === month.id)
                
                if (monthReport) {
                    return {
                        id: monthReport.id,
                        month: month.id,
                        monthName: month.name,
                        monthNameEn: month.nameEn,
                        year: parseInt(year),
                        yearId: monthReport.year_id,
                        title: monthReport.title,
                        description: monthReport.description,
                        status: monthReport.status,
                        reportUrl: monthReport.file_url,
                        fileName: monthReport.file_name,
                        fileSize: monthReport.file_size,
                        reportDate: monthReport.report_date,
                        publishedDate: monthReport.published_at,
                        createdBy: monthReport.created_by,
                        createdAt: monthReport.created_at,
                        updatedAt: monthReport.updated_at,
                        yearData: monthReport.year,
                        monthData: monthReport.month,
                        isAvailable: monthReport.status === 'published'
                    }
                } else {
                    return {
                        id: `${year}-${month.id}`,
                        month: month.id,
                        monthName: month.name,
                        monthNameEn: month.nameEn,
                        year: parseInt(year),
                        yearId: null,
                        title: null,
                        description: null,
                        status: 'unavailable',
                        reportUrl: null,
                        fileName: null,
                        fileSize: null,
                        reportDate: null,
                        publishedDate: null,
                        createdBy: null,
                        createdAt: null,
                        updatedAt: null,
                        yearData: null,
                        monthData: null,
                        isAvailable: false
                    }
                }
            })

            setMonthlyReports(monthlyData)
            
        } catch (err) {
            console.error('Error fetching monthly reports:', err)
            setError('មិនអាចទាញយកទិន្នន័យបាន។ សូមព្យាយាមម្តងទៀត។')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (year) {
            fetchMonthlyReports()
        }
    }, [year])

    const handleDownloadReport = (report) => {
        setError('')
        if (report.reportUrl) {
            window.open(report.reportUrl, '_blank')
        } else {
            console.log(`Report not available for download: ${report.monthNameEn} ${report.year}`)
            setError('Report file is not available for download')
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleDateString('km-KH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div className="bg-gray-50 min-h-screen py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                {/* Header with Back Button */}
                <div className="mb-6 sm:mb-8">
                    <nav className="flex mb-6 sm:mb-8" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3">
                            <li className="inline-flex items-center">
                                <Link
                                    to="/"
                                    className="inline-flex items-center text-xs sm:text-sm font-medium text-gray-700 hover:text-blue-600"
                                >
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                    </svg>
                                    <span className="hidden sm:inline">Home</span>
                                    <span className="sm:hidden">ទំព័រដើម</span>
                                </Link>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <Link
                                        to="/data/monthly"
                                        className="ml-1 text-xs sm:text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
                                    >
                                        Monthly
                                    </Link>
                                </div>
                            </li>
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ml-1 text-xs sm:text-sm font-medium text-gray-500 md:ml-2">
                                        {year ? year : 'Loading...'}
                                    </span>
                                </div>
                            </li>
                        </ol>
                    </nav>
                    
                    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                            <div>
                                <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                                    របាយការណ៍ប្រចាំខែឆ្នាំ {year}
                                </h2>
                                <p className="text-sm sm:text-base text-gray-600">
                                    របាយការណ៍ប្រចាំខែទាំងអស់សម្រាប់ឆ្នាំ {year}
                                </p>
                            </div>
                            <button
                                onClick={fetchMonthlyReports}
                                disabled={loading}
                                className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base w-full sm:w-auto"
                            >
                                <svg className={`w-3 h-3 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span>ធ្វើបច្ចុប្បន្នភាព</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col sm:flex-row justify-center items-center py-8 sm:py-12 space-y-3 sm:space-y-0 sm:space-x-4">
                        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
                        <p className="text-sm sm:text-base text-gray-600">កំពុងផ្ទុកទិន្នន័យ...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                        <p className="text-sm sm:text-base text-red-800">{error}</p>
                        <button
                            onClick={() => setError('')}
                            className="text-red-600 hover:text-red-800 focus:outline-none self-end sm:self-auto"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Monthly Reports Grid */}
                {!loading && !error && (
                    <>
                        {monthlyReports.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                {monthlyReports.map((report) => (
                                    <div key={report.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 sm:p-4">
                                            <h3 className="text-base sm:text-lg font-bold mb-1">{report.monthName}</h3>
                                            <p className="text-blue-100 text-xs sm:text-sm">{report.monthNameEn} {report.year}</p>
                                        </div>
                                        
                                        <div className="p-3 sm:p-4">
                                            {report.isAvailable ? (
                                                <>
                                                    <div className="space-y-2 sm:space-y-3 mb-4">
                                                        <div className="text-xs sm:text-sm">
                                                            <span className="text-gray-600 font-medium">ចំណង់ជើង:</span>
                                                            <p className="text-gray-900 mt-1 font-medium text-xs sm:text-sm">{report.title}</p>
                                                        </div>
                                                        
                                                        {report.description && (
                                                            <div className="text-xs sm:text-sm">
                                                                <span className="text-gray-600 font-medium">ខ្លឹមសារ:</span>
                                                                <p className="text-gray-700 mt-1 text-xs leading-relaxed">
                                                                    {report.description.length > 100 
                                                                        ? `${report.description.substring(0, 100)}...` 
                                                                        : report.description
                                                                    }
                                                                </p>
                                                            </div>
                                                        )}

                                                        {report.reportDate && (
                                                            <div className="text-xs sm:text-sm">
                                                                <span className="text-gray-600 font-medium">កាលបរិច្ឆេទរបាយការណ៍:</span>
                                                                <p className="text-gray-900 mt-1 text-xs sm:text-sm">{formatDate(report.reportDate)}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="border-t pt-3 sm:pt-4">
                                                        <p className="text-xs text-gray-500 mb-3">
                                                            បោះពុម្ពនៅ: {formatDate(report.publishedDate)}
                                                        </p>
                                                        
                                                        {report.reportUrl ? (
                                                            <div className="space-y-2">
                                                                <button
                                                                    onClick={() => handleDownloadReport(report)}
                                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 sm:px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-xs sm:text-sm"
                                                                >
                                                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                    </svg>
                                                                    <span>ទាញយក</span>
                                                                </button>
                                                                <a
                                                                    href={`/data/monthly/${year}/report/${report.id}`}
                                                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 sm:px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-xs sm:text-sm"
                                                                >
                                                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                    </svg>
                                                                    <span>មើល</span>
                                                                </a>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                disabled
                                                                className="w-full bg-gray-300 text-gray-500 py-2 px-3 sm:px-4 rounded-lg cursor-not-allowed flex items-center justify-center space-x-2 text-xs sm:text-sm"
                                                            >
                                                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                                <span>មិនមានឯកសារ</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center py-4 sm:py-6">
                                                    <div className="text-gray-400 mb-3">
                                                        <svg className="w-8 h-8 sm:w-12 sm:h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-gray-500 text-xs sm:text-sm">របាយការណ៍មិនទាន់មាន</p>
                                                    <p className="text-gray-400 text-xs mt-1">នឹងធ្វើបច្ចុប្បន្នភាពនៅពេលក្រោយ</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 sm:py-12">
                                <div className="text-gray-400 mb-4">
                                    <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">មិនមានទិន្នន័យ</h3>
                                <p className="text-sm sm:text-base text-gray-500">មិនមានរបាយការណ៍សម្រាប់ឆ្នាំ {year} នៅឡើយទេ</p>
                            </div>
                        )}
                    </>
                )}

                {/* Summary Statistics */}
                {!loading && !error && monthlyReports.length > 0 && (
                    <div className="mt-8 sm:mt-12 bg-white rounded-xl shadow-lg p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">សង្ខេបស្ថិតិឆ្នាំ {year}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                            <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                                <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-2">
                                    {monthlyReports.filter(r => r.isAvailable).length}/12
                                </div>
                                <p className="text-sm sm:text-base text-gray-700">របាយការណ៍ដែលមាន</p>
                            </div>
                            <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
                                <div className="text-xl sm:text-2xl font-bold text-green-600 mb-2">
                                    {monthlyReports.filter(r => r.isAvailable && r.status === 'published').length}
                                </div>
                                <p className="text-sm sm:text-base text-gray-700">របាយការណ៍ដែលបានបោះពុម្ព</p>
                            </div>
                            <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg">
                                <div className="text-xl sm:text-2xl font-bold text-purple-600 mb-2">
                                    {monthlyReports.filter(r => !r.isAvailable).length}
                                </div>
                                <p className="text-sm sm:text-base text-gray-700">របាយការណ៍ដែលមិនទាន់មាន</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MonthlyYearlyReports
