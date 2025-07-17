import { useState, useEffect } from 'react'
import apiService from '../../../../../services/api'

function MonthlyReports() {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [monthlyReports, setMonthlyReports] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [allReports, setAllReports] = useState([]) // Store all reports from API
    const [loadingReportId, setLoadingReportId] = useState(null) // Track which report is being loaded
    const [months, setMonths] = useState([]) // Dynamic months from API
    const [years, setYears] = useState([]) // Dynamic years from API
    const [initialLoading, setInitialLoading] = useState(true) // Track initial data loading

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
            
            console.log('Months API Response:', result)
            
            if (result.error) {
                console.error('Error fetching months:', result.error)
                return []
            }

            // Handle different response structures
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

            console.log('Transformed months:', transformedMonths)
            return transformedMonths
        } catch (error) {
            console.error('Error fetching months:', error)
            return []
        }
    }

    // Fetch years data from API
    const fetchYears = async () => {
        try {
            const result = await apiService.getReportYears()
            
            console.log('Years API Response:', result)
            
            if (result.error) {
                console.error('Error fetching years:', result.error)
                return []
            }

            // Handle different response structures
            let yearsData = []
            if (Array.isArray(result.data)) {
                yearsData = result.data
            } else if (result.data && result.data.data && Array.isArray(result.data.data)) {
                yearsData = result.data.data
            } else {
                console.error('Unexpected years response format:', result)
                return []
            }

            // Sort years in descending order (most recent first)
            const sortedYears = yearsData.sort((a, b) => b.year_value - a.year_value)

            console.log('Sorted years:', sortedYears)
            return sortedYears
        } catch (error) {
            console.error('Error fetching years:', error)
            return []
        }
    }

    // Initialize data (fetch months, years, and reports)
    const initializeData = async () => {
        setInitialLoading(true)
        setError('')

        try {
            console.log('Starting data initialization...')
            
            // Fetch months and years in parallel
            const [monthsData, yearsData] = await Promise.all([
                fetchMonths(),
                fetchYears()
            ])

            console.log('Months data:', monthsData)
            console.log('Years data:', yearsData)

            setMonths(monthsData)
            setYears(yearsData)

            // Check if we have the required data
            if (monthsData.length === 0) {
                setError('មិនអាចទាញយកទិន្នន័យខែបាន។ សូមព្យាយាមម្តងទៀត។')
                return
            }

            if (yearsData.length === 0) {
                setError('មិនអាចទាញយកទិន្នន័យឆ្នាំបាន។ សូមព្យាយាមម្តងទៀត។')
                return
            }

            // Set default selected year to the most recent year
            let targetYear = selectedYear
            if (yearsData.length > 0) {
                // Years are already sorted in descending order (most recent first)
                targetYear = yearsData[0].year_value
                setSelectedYear(targetYear)
                
                // Fetch reports for the most recent year
                await fetchMonthlyReports(targetYear)
            }

        } catch (error) {
            console.error('Error initializing data:', error)
            setError('មិនអាចផ្ទុកទិន្នន័យដំបូងបាន។ សូមព្យាយាមម្តងទៀត។')
        } finally {
            setInitialLoading(false)
        }
    }
    const fetchMonthlyReports = async (year = selectedYear) => {
        setLoading(true)
        setError('')
        
        try {
            const result = await apiService.getMonthlyReportsByYear(year)
            
            console.log('Monthly Reports API Response:', result)
            
            if (result.error) {
                setError(result.error)
                return
            }

            // Validate the response structure
            if (!result.data) {
                setError('Invalid response format from server')
                return
            }

            // Handle different response structures
            let reports = []
            if (Array.isArray(result.data)) {
                reports = result.data
            } else if (result.data.data && Array.isArray(result.data.data)) {
                reports = result.data.data
            } else {
                console.error('Unexpected response format:', result)
                setError('Unexpected response format from server')
                return
            }

            // Validate each report object
            const validReports = reports.filter(report => {
                return report && typeof report === 'object' && 
                       report.id && report.month_id && 
                       (report.year_id || report.report_date)
            })

            console.log('Valid reports:', validReports)
            setAllReports(validReports)
            
            if (validReports.length === 0 && reports.length > 0) {
                setError('No valid reports found in the response')
            }
            
        } catch (err) {
            console.error('Error fetching monthly reports:', err)
            setError('មិនអាចទាញយកទិន្នន័យបាន។ សូមព្យាយាមម្តងទៀត។')
        } finally {
            setLoading(false)
        }
    }

    // Process reports for display (organize by month)
    const processReportsForYear = (year) => {
        // Since we're fetching reports by year, allReports already contains only reports for the selected year
        const yearReports = allReports

        // Create monthly structure
        const monthlyData = months.map(month => {
            const monthReport = yearReports.find(report => report.month_id === month.id)
            
            if (monthReport) {
                return {
                    id: monthReport.id,
                    month: month.id,
                    monthName: month.name,
                    monthNameEn: month.nameEn,
                    year: year,
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
                    // Additional data from nested objects
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
                    year: year,
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
    }

    // Initial data load
    useEffect(() => {
        initializeData()
    }, [])

    // Fetch reports when year changes (after initial load)
    useEffect(() => {
        if (months.length > 0 && years.length > 0 && !initialLoading) {
            fetchMonthlyReports(selectedYear)
        }
    }, [selectedYear])

    // Process reports when reports are loaded
    useEffect(() => {
        if (allReports.length >= 0 && months.length > 0) {
            processReportsForYear(selectedYear)
        }
    }, [allReports, months, selectedYear])

    const handleDownloadReport = (report) => {
        setError('') // Clear any previous errors
        if (report.reportUrl) {
            window.open(report.reportUrl, '_blank')
        } else {
            console.log(`Report not available for download: ${report.monthNameEn} ${report.year}`)
            setError('Report file is not available for download')
        }
    }

    const handleViewReport = async (reportId) => {
        setLoadingReportId(reportId)
        setError('') // Clear any previous errors
        
        try {
            const result = await apiService.getMonthlyReportById(reportId)
            
            if (result.error) {
                console.error('Error fetching report:', result.error)
                setError(`Error loading report: ${result.error}`)
                return
            }
            
            // Handle different response structures
            let report = null
            if (result.data) {
                if (result.data.data) {
                    report = result.data.data
                } else {
                    report = result.data
                }
            }
            
            if (!report) {
                console.error('No report data found')
                setError('Report not found')
                return
            }
            
            if (report.file_url) {
                window.open(report.file_url, '_blank')
            } else {
                console.log('No file URL available for this report')
                setError('No file is available for this report')
            }
        } catch (error) {
            console.error('Error viewing report:', error)
            setError('Error viewing report. Please try again.')
        } finally {
            setLoadingReportId(null)
        }
    }

    const formatFileSize = (bytes) => {
        if (!bytes) return 'N/A'
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
        <div className="bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Years List */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            របាយការណ៍ប្រចាំខែក្នុងឆ្នាំ
                        </h2>
                        <p className="text-sm text-gray-600">ជ្រើសរើសឆ្នាំដើម្បីមើលរបាយការណ៍ប្រចាំខែទាំងអស់</p>
                    </div>
                    
                    {/* Years Grid */}
                    {!initialLoading && years.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {years.map(year => (
                                <button
                                    key={year.id}
                                    onClick={() => setSelectedYear(year.year_value)}
                                    className={`p-4 rounded-lg border-2 transition-all duration-200 font-medium ${
                                        selectedYear === year.year_value 
                                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' 
                                            : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 shadow-sm hover:shadow-md'
                                    }`}
                                    disabled={loading}
                                >
                                    <div className="text-center">
                                        <div className="text-xl font-bold mb-1">{year.year_value}</div>
                                        <div className="text-xs text-gray-500">ឆ្នាំ</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : initialLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="ml-3 text-gray-600">កំពុងផ្ទុកឆ្នាំ...</p>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-gray-400 mb-3">
                                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2M8 7v5a2 2 0 002 2h4a2 2 0 002-2V7" />
                                </svg>
                            </div>
                            <p className="text-gray-500">មិនមានទិន្នន័យឆ្នាំ</p>
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {(loading || initialLoading) && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="ml-4 text-gray-600">
                            {initialLoading ? 'កំពុងផ្ទុកទិន្នន័យ...' : 'កំពុងធ្វើបច្ចុប្បន្នភាព...'}
                        </p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                        <p className="text-red-800">{error}</p>
                        <button
                            onClick={() => setError('')}
                            className="text-red-600 hover:text-red-800 focus:outline-none"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}                {/* Monthly Reports Grid */}
                {!loading && !initialLoading && !error && (
                    <>
                        {selectedYear ? (
                            <>
                                {/* Selected Year Header */}
                                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                របាយការណ៍ប្រចាំខែឆ្នាំ {selectedYear}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                របាយការណ៍ប្រចាំខែទាំងអស់សម្រាប់ឆ្នាំ {selectedYear}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => fetchMonthlyReports(selectedYear)}
                                            disabled={loading}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
                                        >
                                            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            <span>ធ្វើបច្ចុប្បន្នភាព</span>
                                        </button>
                                    </div>
                                </div>

                                {monthlyReports.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {monthlyReports.map((report) => (
                                            <div key={report.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                                                {/* ...existing card content... */}
                                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
                                                    <h3 className="text-lg font-bold mb-1">{report.monthName}</h3>
                                                    <p className="text-blue-100 text-sm">{report.monthNameEn} {report.year}</p>
                                                </div>
                                                
                                                <div className="p-4">
                                                    {report.isAvailable ? (
                                                        <>
                                                            <div className="space-y-3 mb-4">
                                                                <div className="text-sm">
                                                                    <span className="text-gray-600 font-medium">ចំណង់ជើង:</span>
                                                                    <p className="text-gray-900 mt-1 font-medium">{report.title}</p>
                                                                </div>
                                                                
                                                                {report.description && (
                                                                    <div className="text-sm">
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
                                                                    <div className="text-sm">
                                                                        <span className="text-gray-600 font-medium">កាលបរិច្ឆេទរបាយការណ៍:</span>
                                                                        <p className="text-gray-900 mt-1">{formatDate(report.reportDate)}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            
                                                            <div className="border-t pt-4">
                                                                <p className="text-xs text-gray-500 mb-3">
                                                                    បោះពុម្ពនៅ: {formatDate(report.publishedDate)}
                                                                </p>
                                                                
                                                                {report.reportUrl ? (
                                                                    <div className="space-y-2">
                                                                        <button
                                                                            onClick={() => handleDownloadReport(report)}
                                                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                                                                        >
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                            </svg>
                                                                            <span>ទាញយក</span>
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleViewReport(report.id)}
                                                                            disabled={loadingReportId === report.id}
                                                                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                                                                        >
                                                                            {loadingReportId === report.id ? (
                                                                                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                                                </svg>
                                                                            ) : (
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                                </svg>
                                                                            )}
                                                                            <span>{loadingReportId === report.id ? 'កំពុងផ្ទុក...' : 'មើល'}</span>
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        disabled
                                                                        className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-lg cursor-not-allowed flex items-center justify-center space-x-2"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                        </svg>
                                                                        <span>មិនមានឯកសារ</span>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="text-center py-6">
                                                            <div className="text-gray-400 mb-3">
                                                                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                            </div>
                                                            <p className="text-gray-500 text-sm">របាយការណ៍មិនទាន់មាន</p>
                                                            <p className="text-gray-400 text-xs mt-1">នឹងធ្វើបច្ចុប្បន្នភាពនៅពេលក្រោយ</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="text-gray-400 mb-4">
                                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">មិនមានទិន្នន័យ</h3>
                                        <p className="text-gray-500">មិនមានរបាយការណ៍សម្រាប់ឆ្នាំ {selectedYear} នៅឡើយទេ</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2M8 7v5a2 2 0 002 2h4a2 2 0 002-2V7" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">ជ្រើសរើសឆ្នាំ</h3>
                                <p className="text-gray-500">សូមជ្រើសរើសឆ្នាំពីលើដើម្បីមើលរបាយការណ៍ប្រចាំខែ</p>
                            </div>
                        )}
                    </>
                )}

                {/* Summary Statistics */}
                {!loading && !initialLoading && !error && monthlyReports.length > 0 && (
                    <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">សង្ខេបស្ថិតិឆ្នាំ {selectedYear}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600 mb-2">
                                    {monthlyReports.filter(r => r.isAvailable).length}/12
                                </div>
                                <p className="text-gray-700">របាយការណ៍ដែលមាន</p>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600 mb-2">
                                    {monthlyReports.filter(r => r.isAvailable && r.status === 'published').length}
                                </div>
                                <p className="text-gray-700">របាយការណ៍ដែលបានបោះពុម្ព</p>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600 mb-2">
                                    {monthlyReports.filter(r => !r.isAvailable).length}
                                </div>
                                <p className="text-gray-700">របាយការណ៍ដែលមិនទាន់មាន</p>
                            </div>
                        </div>
                        
                        {/* Available Reports List */}
                        {monthlyReports.filter(r => r.isAvailable).length > 0 && (
                            <div className="mt-8">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">របាយការណ៍ដែលមាន</h4>
                                <div className="space-y-2">
                                    {monthlyReports
                                        .filter(r => r.isAvailable)
                                        .map(report => (
                                            <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <span className="font-medium text-gray-900">{report.monthName}</span>
                                                    <span className="text-sm text-gray-500">({report.monthNameEn})</span>
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {formatDate(report.publishedDate)}
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MonthlyReports
