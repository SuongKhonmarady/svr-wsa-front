import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import apiService from '../../../services/api'

function ReportManagement() {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [years, setYears] = useState([]);
    const [months, setMonths] = useState([]);
    const [monthlyReports, setMonthlyReports] = useState([]);
    const [allReports, setAllReports] = useState([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [initialLoading, setInitialLoading] = useState(true);

    // Khmer month names mapping (optional, for admin you can use English)
    const monthNames = {
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
    };

    // Fetch months and years
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
                name:month.month,
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
    };

    const fetchYears = async () => {
        try {
            const result = await apiService.getReportYears();
            let yearsData = [];
            if (Array.isArray(result.data)) {
                yearsData = result.data;
            } else if (result.data && Array.isArray(result.data.data)) {
                yearsData = result.data.data;
            }
            return yearsData.sort((a, b) => b.year_value - a.year_value);
        } catch (error) {
            return [];
        }
    };

    // Fetch all monthly reports for selected year
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

    // Initialize months, years, and reports
    const initializeData = async () => {
        setInitialLoading(true);
        setError('');
        try {
            const [monthsData, yearsData] = await Promise.all([
                fetchMonths(),
                fetchYears()
            ]);
            setMonths(monthsData);
            setYears(yearsData);
            if (yearsData.length > 0) {
                setSelectedYear(yearsData[0].year_value);
                await fetchMonthlyReports(yearsData[0].year_value);
            }
        } catch (error) {
            setError('Failed to initialize data.');
        } finally {
            setInitialLoading(false);
        }
    };

    useEffect(() => {
        initializeData();
    }, []);

    useEffect(() => {
        if (!initialLoading && selectedYear) {
            fetchMonthlyReports(selectedYear);
        }
    }, [selectedYear]);
    
    useEffect(() => {
        if (allReports.length >= 0 && months.length > 0) {
            processReportsForYear(selectedYear)
        }
    }, [allReports, months, selectedYear])

    // Delete report
    const handleDeleteReport = async (id) => {
        if (window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
            try {
                const result = await apiService.deleteMonthlyReport(id);
                if (result.error) {
                    setError(result.error);
                    return;
                }
                setMonthlyReports(prev => prev.filter(r => r.id !== id));
                setSuccess('Report deleted successfully');
            } catch (err) {
                setError('Failed to delete report');
            }
        }
    };

    // Toggle report status
    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'published' ? 'draft' : 'published';
            let result;
            if (newStatus === 'published') {
                result = await apiService.publishMonthlyReport(id);
            } else {
                result = await apiService.unpublishMonthlyReport(id);
            }
            if (result.error) {
                setError(result.error);
                return;
            }
            setMonthlyReports(prev => prev.map(r =>
                r.id === id ? { ...r, status: newStatus } : r
            ));
            setSuccess(`Report ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`);
        } catch (err) {
            setError('Failed to update report status');
        }
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (!bytes || bytes <= 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Auto-hide messages
    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
                setSuccess('');
                setError('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [success, error]);

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">📊 Reports Management</h1>
                        <p className="text-gray-600 mt-2">Manage monthly and yearly reports with PDF uploads</p>
                    </div>
                    <div className="flex space-x-3">
                        <Link
                            to="/admin/reports/create"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                        >
                            📄 Create New Report
                        </Link>
                    </div>
                </div>

                {/* Years List */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Yearly Reports</h2>
                        <p className="text-sm text-gray-600">Select a year to view all monthly reports</p>
                    </div>
                    {years.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {years.map(year => (
                                <button
                                    key={year.id}
                                    onClick={() => setSelectedYear(year.year_value)}
                                    className={`p-4 rounded-lg border-2 transition-all duration-200 font-medium ${selectedYear === year.year_value ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 shadow-sm hover:shadow-md'}`}
                                    disabled={loading}
                                >
                                    <div className="text-center">
                                        <div className="text-xl font-bold mb-1">{year.year_value}</div>
                                        <div className="text-xs text-gray-500">Year</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-gray-400 mb-3">
                                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2M8 7v5a2 2 0 002 2h4a2 2 0 002-2V7" />
                                </svg>
                            </div>
                            <p className="text-gray-500">No year data</p>
                        </div>
                    )}
                </div>

                {/* Alerts */}
                {(error || success) && (
                    <div className={`p-4 rounded-lg border ${error ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                        <div className="flex items-center">
                            <svg className={`w-5 h-5 mr-3 ${error ? 'text-red-600' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={error ? 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' : 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'} />
                            </svg>
                            <p className={error ? 'text-red-800' : 'text-green-800'}>{error || success}</p>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {(loading || initialLoading) && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="ml-4 text-gray-600">{initialLoading ? 'Loading data...' : 'Updating...'}</p>
                    </div>
                )}

                {/* Reports List */}
                {!loading && !initialLoading && (
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Reports for {selectedYear}</h2>
                        {monthlyReports.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-gray-500">No reports found for {selectedYear}</p>
                                <Link
                                    to="/admin/reports/create"
                                    className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                                >
                                    📄 Create Your First Report
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {monthlyReports.map(report => (
                                    <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${report.status === 'published'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-orange-100 text-orange-800'
                                                }`}>
                                                {report.status}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {report.year?.year_value || report.year_id || selectedYear} - {report.month?.month || monthNames[report.month_id - 1] || report.month_id}
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
                                                <span className="text-gray-600">📁 {report.file_name}</span>
                                                {report.file_size > 0 && (
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
                                                className={`flex-1 px-3 py-2 text-sm rounded-lg text-center transition-colors duration-200 ${report.status === 'published'
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
                                                👁️ View File
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
    );
}

export default ReportManagement;