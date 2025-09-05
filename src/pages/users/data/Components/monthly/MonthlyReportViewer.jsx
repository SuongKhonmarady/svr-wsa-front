import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import apiService from '../../../../../services/api'

function MonthlyReportViewer() {
    const { year, reportId } = useParams()
    const navigate = useNavigate()
    const [report, setReport] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [pdfError, setPdfError] = useState(false)

    // Fetch report details
    const fetchReport = async () => {
        try {
            setLoading(true)
            setError('')
            setPdfError(false)

            const result = await apiService.getMonthlyReportById(reportId)

            console.log('Report API Response:', result)

            if (result.error) {
                setError(result.error)
                return
            }

            // Handle different response structures
            let reportData = null
            if (result.data) {
                if (result.data.data) {
                    reportData = result.data.data
                } else {
                    reportData = result.data
                }
            }

            if (!reportData) {
                setError('Report not found')
                return
            }

            setReport(reportData)

        } catch (err) {
            console.error('Error fetching report:', err)
            setError('មិនអាចទាញយកទិន្នន័យរបាយការណ៍បាន។ សូមព្យាយាមម្តងទៀត។')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (reportId) {
            fetchReport()
        }
    }, [reportId])


    const handlePdfError = () => {
        setPdfError(true)
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

    const formatFileSize = (bytes) => {
        if (!bytes) return 'N/A'
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    {/* Mobile-optimized breadcrumb */}
                    <nav className="flex items-center py-3 sm:py-4" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 sm:space-x-2 md:space-x-4 overflow-x-auto pb-2 sm:pb-0">
                            <li className="inline-flex items-center flex-shrink-0">
                                <Link
                                    to="/"
                                    className="inline-flex items-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                >
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                    </svg>
                                    <span className="hidden sm:inline">Home</span>
                                </Link>
                            </li>
                            <li className="flex-shrink-0">
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <Link
                                        to="/data/monthly"
                                        className="ml-1 sm:ml-2 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                    >
                                        Monthly
                                    </Link>
                                </div>
                            </li>
                            <li className="flex-shrink-0">
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <Link
                                        to={`/data/monthly/${year}`}
                                        className="ml-1 sm:ml-2 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                    >
                                        {year ? year : 'Monthly'}
                                    </Link>
                                </div>
                            </li>
                            <li aria-current="page" className="flex-shrink-0">
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ml-1 sm:ml-2 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-900 bg-gray-100 rounded-lg">
                                        {report?.report_date ? new Date(report.report_date).toLocaleDateString('km-KH', { month: 'long' }) : (reportId ? `Report ${reportId}` : 'Report')}
                                    </span>
                                </div>
                            </li>
                        </ol>
                    </nav>
                    
                    {/* Mobile-optimized header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 sm:h-16 space-y-3 sm:space-y-0">
                        <div className="flex items-center">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                                មើលរបាយការណ៍ប្រចាំខែ
                            </h2>
                        </div>

                        {/* Action Buttons - Mobile optimized */}
                        {!loading && !error && report?.file_url && (
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <button
                                    onClick={() => window.open(report.file_url, '_blank')}
                                    className="inline-flex items-center px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 text-sm sm:text-base w-full sm:w-auto justify-center"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    <span className="hidden sm:inline">បើកផ្ទាំងថ្មីដើម្បីមើលរបាយការណ៍</span>
                                    <span className="sm:hidden">បើកផ្ទាំងថ្មី</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col sm:flex-row justify-center items-center py-8 sm:py-12">
                        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
                        <p className="mt-3 sm:mt-0 sm:ml-4 text-gray-600 text-sm sm:text-base text-center">កំពុងផ្ទុករបាយការណ៍...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center">
                            <svg className="w-6 h-6 text-red-600 mr-0 sm:mr-3 mb-2 sm:mb-0 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="flex-1">
                                <p className="text-red-800 font-medium text-sm sm:text-base">{error}</p>
                                <button
                                    onClick={fetchReport}
                                    className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                                >
                                    ព្យាយាមម្តងទៀត
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* PDF Viewer - SHOWN FIRST */}
                {!loading && !error && report?.file_url && (
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden mb-6 sm:mb-8">
                        <div className="p-3 sm:p-6">
                            {!pdfError ? (
                                <div className="w-full" style={{ height: '80vh', minHeight: '400px' }}>
                                    <iframe
                                        src={`${report.file_url}#toolbar=1&navpanes=1&scrollbar=1`}
                                        width="100%"
                                        height="100%"
                                        className="border border-gray-300 rounded-lg"
                                        title="Monthly Report PDF"
                                        onError={handlePdfError}
                                    />
                                </div>
                            ) : (
                                <div className="text-center py-8 sm:py-12">
                                    <div className="text-gray-400 mb-4">
                                        <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">មិនអាចបង្ហាញ PDF</h3>
                                    <p className="text-gray-500 mb-4 text-sm sm:text-base px-4">
                                        មិនអាចបង្ហាញ PDF នៅក្នុងកម្មវិធីរុករកបានទេ។ សូមទាញយកឯកសារ ឬបើកក្នុងផ្ទាំងថ្មី។
                                    </p>
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => window.open(report.file_url, '_blank')}
                                            className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 text-sm sm:text-base"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            បើកផ្ទាំងថ្មី
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Report Information - SHOWN SECOND */}
                {!loading && !error && report && (
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
                        <div className="grid grid-cols-1 gap-4 sm:gap-6">
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">ព័ត៌មានរបាយការណ៍</h2>
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="border-b border-gray-100 pb-2 sm:pb-3">
                                        <span className="text-xs sm:text-sm text-gray-600 font-medium block mb-1">ចំណង់ជើង:</span>
                                        <p className="text-sm sm:text-base text-gray-900 font-semibold break-words">{report.title}</p>
                                    </div>
                                    {report.description && (
                                        <div className="border-b border-gray-100 pb-2 sm:pb-3">
                                            <span className="text-xs sm:text-sm text-gray-600 font-medium block mb-1">ខ្លឹមសារ:</span>
                                            <p className="text-sm sm:text-base text-gray-700 leading-relaxed break-words">{report.description}</p>
                                        </div>
                                    )}
                                    <div className="border-b border-gray-100 pb-2 sm:pb-3">
                                        <span className="text-xs sm:text-sm text-gray-600 font-medium block mb-1">កាលបរិច្ឆេទរបាយការណ៍:</span>
                                        <p className="text-sm sm:text-base text-gray-900">{formatDate(report.report_date)}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs sm:text-sm text-gray-600 font-medium block mb-1">បោះពុម្ពនៅ:</span>
                                        <p className="text-sm sm:text-base text-gray-900">{formatDate(report.published_at)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MonthlyReportViewer
