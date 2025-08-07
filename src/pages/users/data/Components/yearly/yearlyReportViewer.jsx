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
    const [pdfUrl, setPdfUrl] = useState('')
    const [showPdfModal, setShowPdfModal] = useState(false)
    const [downloading, setDownloading] = useState(false)

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
            
            // Set PDF URL if available (handle different field names)
            if (reportData.file_url || reportData.filePath || reportData.file_path || reportData.url) {
                const pdfPath = reportData.file_url || reportData.filePath || reportData.file_path || reportData.url
                setPdfUrl(pdfPath)
            }
            
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

    const handleViewPdf = () => {
        if (pdfUrl) {
            setShowPdfModal(true)
        } else {
            setPdfError(true)
        }
    }

    const handleDownload = async () => {
        if (!pdfUrl || !report) return
        
        try {
            setDownloading(true)
            
            // Use the original file name if available, otherwise create a meaningful name
            const fileName = report.file_name || `${report.title || 'Yearly Report'} - ${year}.pdf`
            
            // Create a temporary anchor element for download
            const link = document.createElement('a')
            link.href = pdfUrl
            link.download = fileName
            link.target = '_blank' // Open in new tab as fallback
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error('Download error:', error)
        } finally {
            setDownloading(false)
        }
    }

    const handlePrint = () => {
        if (pdfUrl) {
            const printWindow = window.open(pdfUrl, '_blank')
            printWindow?.addEventListener('load', () => {
                printWindow.print()
            })
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

    const formatFileSize = (bytes) => {
        if (!bytes) return 'N/A'
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const getReportStatus = (report) => {
        if (!report) return { status: 'unknown', color: 'gray', text: 'មិនស្គាល់' }
        
        // Check published status first
        if (report.status === 'published') {
            return { status: 'published', color: 'green', text: 'បានបោះពុម្ព' }
        } else if (report.status === 'draft') {
            return { status: 'draft', color: 'yellow', text: 'ការព្រាង' }
        } else if (report.status === 'archived') {
            return { status: 'archived', color: 'gray', text: 'ទុកក្នុងបណ្ណាល័យ' }
        }
        
        // Fallback to date-based status
        const currentDate = new Date()
        const reportDate = new Date(report.report_date || report.date || report.created_at)
        const daysDifference = Math.floor((currentDate - reportDate) / (1000 * 60 * 60 * 24))
        
        if (daysDifference <= 30) {
            return { status: 'new', color: 'green', text: 'ថ្មី' }
        } else if (daysDifference <= 90) {
            return { status: 'recent', color: 'blue', text: 'ថ្មីៗ' }
        } else {
            return { status: 'archived', color: 'gray', text: 'ទុកក្នុងបណ្ណាល័យ' }
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                            <div className="space-y-4">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                            <div className="mt-8 h-64 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">មានបញ្ហាក្នុងការទាញយកទិន្នន័យ</h3>
                            <p className="text-gray-600 mb-6">{error}</p>
                            <div className="flex justify-center space-x-3">
                                <button
                                    onClick={fetchReport}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                                >
                                    ព្យាយាមម្តងទៀត
                                </button>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors"
                                >
                                    ត្រលប់ក្រោយ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const status = getReportStatus(report)
    
    return(
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                        <Link to="/data" className="hover:text-blue-600">ទិន្នន័យ</Link>
                        <span>/</span>
                        <Link to="/data/yearly" className="hover:text-blue-600">របាយការណ៍ប្រចាំឆ្នាំ</Link>
                        <span>/</span>
                        <span className="text-gray-900">{year}</span>
                    </nav>
                    <h1 className="text-3xl font-bold text-gray-900">
                        របាយការណ៍ប្រចាំឆ្នាំ {year}
                    </h1>
                </div>

                {/* Report Card */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Report Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8 text-white">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div className="mb-4 md:mb-0">
                                <h2 className="text-2xl font-bold mb-2">
                                    {report?.title || `របាយការណ៍ប្រចាំឆ្នាំ ${year}`}
                                </h2>
                                <div className="flex flex-wrap items-center gap-4 text-blue-100">
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8l-3-3.5 3-3.5" />
                                        </svg>
                                        <span>{formatDate(report?.report_date || report?.date || report?.created_at)}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span>{formatFileSize(report?.file_size || report?.fileSize)}</span>
                                    </div>
                                    {report?.file_name && (
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                            <span className="truncate max-w-48">{report.file_name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${status.color}-100 text-${status.color}-800`}>
                                    {status.text}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Report Content */}
                    <div className="p-6">
                        {/* Report Description */}
                        {report?.description && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">ការពិពណ៌នា</h3>
                                <p className="text-gray-600 leading-relaxed">{report.description}</p>
                            </div>
                        )}

                        {/* Report Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">ព័ត៌មានលម្អិត</h3>
                                <dl className="space-y-3">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">ចំណងជើង</dt>
                                        <dd className="text-gray-900">{report?.title || 'N/A'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">ឆ្នាំ</dt>
                                        <dd className="text-gray-900">{report?.year?.year_value || year}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">កាលបរិច្ចេទរបាយការណ៍</dt>
                                        <dd className="text-gray-900">{formatDate(report?.report_date)}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">ស្ថានភាព</dt>
                                        <dd className="text-gray-900">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                status.color === 'green' ? 'bg-green-100 text-green-800' :
                                                status.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                                                status.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {status.text}
                                            </span>
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">ទំហំឯកសារ</dt>
                                        <dd className="text-gray-900">{formatFileSize(report?.file_size || report?.fileSize)}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">ឈ្មោះឯកសារ</dt>
                                        <dd className="text-gray-900 break-all">{report?.file_name || 'N/A'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">បង្កើតដោយ</dt>
                                        <dd className="text-gray-900">{report?.created_by || 'N/A'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">កាលបរិច្ចេទបង្កើត</dt>
                                        <dd className="text-gray-900">{formatDate(report?.created_at)}</dd>
                                    </div>
                                </dl>
                            </div>
                            
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">សកម្មភាព</h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={handleViewPdf}
                                        disabled={!pdfUrl}
                                        className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-3 rounded-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        <span>មើលឯកសារ PDF</span>
                                    </button>
                                    
                                    <button
                                        onClick={handleDownload}
                                        disabled={!pdfUrl || downloading}
                                        className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-3 rounded-lg transition-colors"
                                    >
                                        {downloading ? (
                                            <>
                                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>កំពុងទាញយក...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <span>ទាញយកឯកសារ</span>
                                            </>
                                        )}
                                    </button>
                                    
                                    <button
                                        onClick={handlePrint}
                                        disabled={!pdfUrl}
                                        className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white px-4 py-3 rounded-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                        </svg>
                                        <span>បោះពុម្ពឯកសារ</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Error Messages */}
                        {pdfError && (
                            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    <div>
                                        <p className="text-red-700 font-medium">មិនអាចបង្ហាញឯកសារ PDF បាន។</p>
                                        <p className="text-red-600 text-sm mt-1">សូមព្យាយាមទាញយកឯកសារ ឬទំនាក់ទំនងអ្នកគ្រប់គ្រង។</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Quick Preview Section */}
                        {pdfUrl && !pdfError && (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">ការមើលលើសរុប</h3>
                                <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                                    <div className="text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="text-gray-600 mb-4">ចុចកូនចុចខាងក្រោម ដើម្បីមើលឯកសារពេញ</p>
                                        <button
                                            onClick={handleViewPdf}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            មើលឯកសារ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Back Button */}
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>ត្រលប់ក្រោយ</span>
                    </button>
                </div>
            </div>

            {/* PDF Modal */}
            {showPdfModal && pdfUrl && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-full overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                            <div className="flex items-center space-x-3">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">មើលឯកសារ PDF</h3>
                                    <p className="text-sm text-gray-600 truncate max-w-md">
                                        {report?.file_name || report?.title}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={handleDownload}
                                    disabled={downloading}
                                    className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm rounded-md transition-colors"
                                    title="ទាញយកឯកសារ"
                                >
                                    {downloading ? (
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    )}
                                </button>
                                <button
                                    onClick={handlePrint}
                                    className="inline-flex items-center px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-md transition-colors"
                                    title="បោះពុម្ពឯកសារ"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setShowPdfModal(false)}
                                    className="text-gray-500 hover:text-gray-700 p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                                    title="បិទ"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="relative" style={{ height: 'calc(90vh - 100px)' }}>
                            <iframe
                                src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                                className="w-full h-full border-0"
                                title="PDF Viewer"
                                onLoad={() => setPdfError(false)}
                                onError={() => setPdfError(true)}
                            />
                            {/* Loading overlay */}
                            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center" id="pdf-loading">
                                <div className="text-center">
                                    <svg className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <p className="text-gray-600">កំពុងផ្ទុកឯកសារ...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
    
}
export default YearlyReportViewer