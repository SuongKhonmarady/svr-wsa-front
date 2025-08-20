import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import apiService from '../../../../../services/api'

function YearlyReportViewer() {
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
            
            const result = await apiService.getYearlyReport(reportId)
            
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Link
                                to={`/data/yearly/${year}`}
                                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                ត្រលប់ទៅរបាយការណ៍ប្រចាំឆ្នាំ
                            </Link>
                            <div className="h-6 w-px bg-gray-300"></div>
                            <h1 className="text-lg font-semibold text-gray-900">
                                មើលរបាយការណ៍ប្រចាំឆ្នាំ
                            </h1>
                        </div>
                        
                        {/* Action Buttons */}
                        {!loading && !error && report?.file_url && (
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => window.open(report.file_url, '_blank')}
                                    className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    បើកផ្ទាំងថ្មីដើម្បីមើលរបាយការណ៍
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="ml-4 text-gray-600">កំពុងផ្ទុករបាយការណ៍...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                        <div className="flex items-center">
                            <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <p className="text-red-800 font-medium">{error}</p>
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
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">មើលរបាយការណ៍</h3>
                        </div>
                        
                        <div className="p-6">
                            {!pdfError ? (
                                <div className="w-full" style={{ height: '85vh' }}>
                                    <iframe
                                        src={`${report.file_url}#toolbar=1&navpanes=1&scrollbar=1`}
                                        width="100%"
                                        height="100%"
                                        className="border border-gray-300 rounded-lg"
                                        title="Yearly Report PDF"
                                        onError={handlePdfError}
                                    />
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 mb-4">
                                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">មិនអាចបង្ហាញ PDF</h3>
                                    <p className="text-gray-500 mb-4">
                                        មិនអាចបង្ហាញ PDF នៅក្នុងកម្មវិធីរុករកបានទេ។ សូមទាញយកឯកសារ ឬបើកក្នុងផ្ទាំងថ្មី។
                                    </p>
                                    <div className="space-x-4">
                                        <button
                                            onClick={() => window.open(report.file_url, '_blank')}
                                            className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
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
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">ព័ត៌មានរបាយការណ៍</h2>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm text-gray-600 font-medium">ចំណង់ជើង:</span>
                                        <p className="text-gray-900 font-semibold">{report.title}</p>
                                    </div>
                                    {report.description && (
                                        <div>
                                            <span className="text-sm text-gray-600 font-medium">ខ្លឹមសារ:</span>
                                            <p className="text-gray-700 text-sm leading-relaxed">{report.description}</p>
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-sm text-gray-600 font-medium">កាលបរិច្ឆេទរបាយការណ៍:</span>
                                        <p className="text-gray-900">{formatDate(report.report_date)}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600 font-medium">បោះពុម្ពនៅ:</span>
                                        <p className="text-gray-900">{formatDate(report.published_at)}</p>
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

export default YearlyReportViewer
