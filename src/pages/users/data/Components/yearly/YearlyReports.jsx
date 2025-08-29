import { useEffect, useState, useRef } from 'react';
import apiService from '../../../../../services/api';
import { Link } from 'react-router-dom'

const YearlyReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [sortBy, setSortBy] = useState('year-desc');
    const [page, setPage] = useState(1);  // <-- add this
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 }); // <-- add this if needed
    const [loadingReportId, setLoadingReportId] = useState(null) // Track which report is being loaded
    const [isVisible, setIsVisible] = useState(false)
    const [showContent, setShowContent] = useState(false)
    const sectionRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.unobserve(entry.target)
                }
            },
            {
                threshold: 0.1,
                rootMargin: '50px 0px -50px 0px'
            }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current)
            }
        }
    }, [])


    useEffect(() => {
        fetchReports();
    }, [page]);

    const fetchReports = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await apiService.getYearlyReports(page);

            const reportList = res.data?.data?.data;

            if (Array.isArray(reportList)) {
                const raw = reportList.map((r) => ({
                    id: r.id,
                    title: r.title || 'របាយការណ៍ប្រចាំឆ្នាំ',
                    description: r.description || 'គ្មានពិពណ៌នាសម្រាប់របាយការណ៍នេះ',
                    year: r.year?.year_value ?? 'N/A',
                    reportUrl: r.file_url,
                    isAvailable: r.status === 'published',
                    publishedDate: new Date(r.published_at || r.created_at),
                    totalWaterProduction: 0,
                    averageCustomerCount: 0,
                    totalRevenue: 0,
                    waterQualityScore: 0,
                    highlights: [],
                }));

                setReports(raw);
                setPagination({
                    currentPage: res.data.data.current_page,
                    totalPages: res.data.data.last_page,
                });

                // Trigger content animation after successful fetch
                setTimeout(() => {
                    setShowContent(true)
                }, 100)
                
            } else {
                console.error('Expected array, got:', reportList);
                setError('ទិន្នន័យមិនត្រឹមត្រូវទេ។');
            }
        } catch (err) {
            console.error(err);
            setError('បញ្ហាក្នុងការទាញយកទិន្នន័យ។');
        }
        setLoading(false);
    };

    const handleViewReport = async (reportId) => {
        setLoadingReportId(reportId)
        setError('') // Clear any previous errors

        try {
            const result = await apiService.getYearlyReport(reportId)

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

    const handleDownload = (url) => {
        const link = document.createElement('a');
        link.href = url;
        // Extract filename from URL or provide a default
        const filename = url.split('/').pop().split('?')[0] || 'report.pdf';
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const sorted = [...reports].sort((a, b) => {
        switch (sortBy) {
            case 'year-asc': return a.year - b.year;
            case 'year-desc': return b.year - a.year;
            case 'revenue': return b.totalRevenue - a.totalRevenue;
            case 'customers': return b.averageCustomerCount - a.averageCustomerCount;
            default: return b.year - a.year;
        }
    });

    return (
        <div ref={sectionRef} className="bg-gray-50 py-8 sm:py-12 lg:py-26 px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className={`flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-4 sm:p-6 rounded-lg shadow transition-all duration-1000 ${
                    isVisible 
                        ? 'opacity-100 transform translate-y-0' 
                        : 'opacity-0 transform translate-y-8'
                }`}>
                    <h2 className="text-2xl xs:text-3xl sm:text-4xl text-gray-900 mb-4 sm:mb-0">
                        របាយការណ៍ប្រចាំឆ្នាំ
                    </h2>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-gray-300 rounded px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none transition-all duration-200 hover:border-green-500 focus:border-green-500 w-full sm:w-auto"
                    >
                        <option value="year-desc">ឆ្នាំថ្មីបំផុត</option>
                        <option value="year-asc">ឆ្នាំចាស់បំផុត</option>
                        <option value="revenue">ចំណូលខ្ពស់បំផុត</option>
                        <option value="customers">អតិថិជនច្រើនបំផុត</option>
                    </select>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className={`space-y-6 transition-all duration-1000 ${isVisible
                            ? 'opacity-100 transform translate-y-0'
                            : 'opacity-0 transform translate-y-8'
                        }`}>
                        {/* Loading Header */}
                        <div className="flex flex-col sm:flex-row justify-center items-center py-8 sm:py-12 space-y-4 sm:space-y-0 sm:space-x-6">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-green-200 border-t-green-600"></div>
                                <div className="absolute inset-0 rounded-full border-4 border-transparent border-r-green-400 animate-pulse"></div>
                            </div>
                            <div className="text-center sm:text-left">
                                <p className="text-lg sm:text-xl text-gray-700 font-medium mb-1">កំពុងផ្ទុកទិន្នន័យ...</p>
                                <p className="text-sm sm:text-base text-gray-500">សូមរង់ចាំខណៈយើងទាញយករបាយការណ៍</p>
                            </div>
                        </div>

                        {/* Skeleton Loaders */}
                        <div className="space-y-4 sm:space-y-6">
                            {[1, 2, 3].map((index) => (
                                <div key={index} className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                                    <div className="md:flex space-y-4 md:space-y-0 md:space-x-6">
                                        {/* Year Skeleton */}
                                        <div className="md:w-1/4 flex flex-col justify-center items-center bg-gray-100 rounded-lg p-4">
                                            <div className="h-8 sm:h-10 bg-gray-200 rounded w-16 sm:w-20 mb-2 animate-skeleton"></div>
                                            <div className="h-4 bg-gray-200 rounded w-12 sm:w-16 animate-skeleton"></div>
                                        </div>
                                        
                                        {/* Content Skeleton */}
                                        <div className="md:w-3/4 space-y-3">
                                            <div className="h-5 sm:h-6 bg-gray-200 rounded w-3/4 animate-skeleton"></div>
                                            <div className="h-4 bg-gray-200 rounded w-full animate-skeleton"></div>
                                            <div className="h-4 bg-gray-200 rounded w-2/3 animate-skeleton"></div>
                                            
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0 pt-2">
                                                <div className="h-4 bg-gray-200 rounded w-32 animate-skeleton"></div>
                                                <div className="flex space-x-2">
                                                    <div className="h-8 bg-gray-200 rounded w-16 animate-skeleton"></div>
                                                    <div className="h-8 bg-gray-200 rounded w-20 animate-skeleton"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Progress Bar */}
                        <div className="max-w-md mx-auto">
                            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                            </div>
                            <p className="text-center text-sm text-gray-500 mt-2">កំពុងដំណើរការ...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="text-center text-red-600 font-medium py-8 sm:py-12 lg:py-26 text-sm sm:text-base">{error}</div>
                )}

                {!loading && !error && sorted.length === 0 && (
                    <div className={`text-center text-gray-500 py-8 sm:py-12 lg:py-26 transition-all duration-800 ${
                        showContent 
                            ? 'opacity-100 transform translate-y-0' 
                            : 'opacity-0 transform translate-y-8'
                    }`}>
                        <div className="text-gray-400 mb-4 transform hover:scale-110 transition-transform duration-300">
                            <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-sm sm:text-base">គ្មានរបាយការណ៍ទេ។</p>
                    </div>
                )}

                {!loading && !error && sorted.length > 0 && (
                    <div className={`space-y-4 sm:space-y-6 lg:space-y-8 transition-all duration-1500 ${
                        (isVisible && showContent)
                            ? 'opacity-100 transform translate-y-0' 
                            : 'opacity-0 transform translate-y-8'
                    }`}>
                        {sorted.map((r, index) => (
                            <div 
                                key={r.id} 
                                className={`bg-white rounded-xl shadow hover:shadow-xl p-4 sm:p-6 md:flex transition-all duration-700 transform hover:scale-102 ${
                                    showContent 
                                        ? 'opacity-100 translate-y-0 scale-100' 
                                        : 'opacity-0 translate-y-8 scale-95'
                                }`}
                                style={{ 
                                    transitionDelay: `${index * 150}ms`,
                                    animationFillMode: 'both'
                                }}
                            >
                                <div className="md:w-1/4 flex flex-col justify-center items-center bg-green-100 rounded-lg p-3 sm:p-4 mb-4 md:mb-0 transform hover:scale-105 transition-transform duration-300">
                                    <div className="text-2xl sm:text-3xl font-bold text-green-700 transform hover:scale-110 transition-transform duration-300">{r.year}</div>
                                    <div className="text-xs sm:text-sm text-gray-600">
                                        {r.isAvailable ? 'មាន' : 'មិនទាន់មាន'}
                                    </div>
                                </div>
                                <div className="md:w-3/4 md:pl-6">
                                    {r.isAvailable ? (
                                        <>
                                            <div>
                                                {/* Use r.title here */}
                                                <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 transform hover:text-green-700 transition-colors duration-200">{r.title}</h2>
                                                <p className="text-sm sm:text-base text-gray-600 mb-4">{r.description || 'គ្មានពិពណ៌នាសម្រាប់របាយការណ៍នេះ'}</p>

                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                                                    <div className="text-xs sm:text-sm text-gray-500">
                                                        បោះពុម្ព: {r.publishedDate.toLocaleDateString('km-KH')}
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row gap-2">
                                                        <a
                                                            href={`/data/yearly/${r.year}/report/${r.id}`}
                                                            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 sm:px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-105 hover:shadow-lg text-sm sm:text-base"
                                                        >
                                                            <svg className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            <span>មើល</span>
                                                        </a>
                                                        <button
                                                            onClick={() => r.reportUrl && handleDownload(r.reportUrl)}
                                                            disabled={!r.reportUrl}
                                                            className={`bg-green-600 text-white px-3 sm:px-4 py-2 rounded text-xs sm:text-sm hover:bg-green-700 disabled:bg-gray-400 transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:hover:scale-100 w-full sm:w-auto`}
                                                        >
                                                            ទាញយក
                                                        </button>
                                                    </div>
                                                </div>

                                                {!r.reportUrl && (
                                                    <div className="text-center text-gray-500 mt-4 text-xs sm:text-sm">
                                                        របាយការណ៍នេះមិនទាន់បានបញ្ចូលឯកសារនៅឡើយទេ។
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center text-gray-500 text-xs sm:text-sm py-4">
                                            របាយការណ៍កំពុងរៀបចំ...
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                )}
            </div>
        </div>
    );
};

export default YearlyReports;
