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
        <div ref={sectionRef} className="bg-gray-50 py-26 px-4 sm:px-8">
            <div className="max-w-6xl mx-auto">
                <div className={`flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-4 rounded-lg shadow transition-all duration-1000 ${
                    isVisible 
                        ? 'opacity-100 transform translate-y-0' 
                        : 'opacity-0 transform translate-y-8'
                }`}>
                    <h2 className="text-4xl text-gray-900 mb-4 ">
                        របាយការណ៍ប្រចាំឆ្នាំ
                    </h2>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-gray-300 rounded px-4 py-2 focus:outline-none transition-all duration-200 hover:border-green-500 focus:border-green-500"
                    >
                        <option value="year-desc">ឆ្នាំថ្មីបំផុត</option>
                        <option value="year-asc">ឆ្នាំចាស់បំផុត</option>
                        <option value="revenue">ចំណូលខ្ពស់បំផុត</option>
                        <option value="customers">អតិថិជនច្រើនបំផុត</option>
                    </select>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className={`flex justify-center items-center py-26 transition-all duration-2000 ${isVisible
                            ? 'opacity-100 transform translate-y-0'
                            : 'opacity-0 transform translate-y-8'
                        }`}>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                        <p className="ml-4 text-gray-600">កំពុងផ្ទុកទិន្នន័យ...</p>
                    </div>
                )}

                {error && (
                    <div className="text-center text-red-600 font-medium py-26">{error}</div>
                )}

                {!loading && !error && sorted.length === 0 && (
                    <div className={`text-center text-gray-500 py-26 transition-all duration-800 ${
                        showContent 
                            ? 'opacity-100 transform translate-y-0' 
                            : 'opacity-0 transform translate-y-8'
                    }`}>
                        <div className="text-gray-400 mb-4 transform hover:scale-110 transition-transform duration-300">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        គ្មានរបាយការណ៍ទេ។
                    </div>
                )}

                {!loading && !error && sorted.length > 0 && (
                    <div className={`space-y-8 transition-all duration-1500 ${
                        (isVisible && showContent)
                            ? 'opacity-100 transform translate-y-0' 
                            : 'opacity-0 transform translate-y-8'
                    }`}>
                        {sorted.map((r, index) => (
                            <div 
                                key={r.id} 
                                className={`bg-white rounded-xl shadow hover:shadow-xl p-6 md:flex transition-all duration-700 transform hover:scale-102 ${
                                    showContent 
                                        ? 'opacity-100 translate-y-0 scale-100' 
                                        : 'opacity-0 translate-y-8 scale-95'
                                }`}
                                style={{ 
                                    transitionDelay: `${index * 150}ms`,
                                    animationFillMode: 'both'
                                }}
                            >
                                <div className="md:w-1/4 flex flex-col justify-center items-center bg-green-100 rounded-lg p-4 mb-4 md:mb-0 transform hover:scale-105 transition-transform duration-300">
                                    <div className="text-3xl font-bold text-green-700 transform hover:scale-110 transition-transform duration-300">{r.year}</div>
                                    <div className="text-sm text-gray-600">
                                        {r.isAvailable ? 'មាន' : 'មិនទាន់មាន'}
                                    </div>
                                </div>
                                <div className="md:w-3/4 md:pl-6">
                                    {r.isAvailable ? (
                                        <>
                                            <div>
                                                {/* Use r.title here */}
                                                <h2 className="text-lg font-semibold text-gray-800 mb-2 transform hover:text-green-700 transition-colors duration-200">{r.title}</h2>
                                                <p className="text-gray-600 mb-4">{r.description || 'គ្មានពិពណ៌នាសម្រាប់របាយការណ៍នេះ'}</p>

                                                <div className="flex justify-between items-center">
                                                    <div className="text-sm text-gray-500">
                                                        បោះពុម្ព: {r.publishedDate.toLocaleDateString('km-KH')}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <a
                                                            href={`/data/yearly/${r.year}/report/${r.id}`}
                                                            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-105 hover:shadow-lg"
                                                        >
                                                            <svg className="w-4 h-4 transform group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            <span>មើល</span>
                                                        </a>
                                                        <button
                                                            onClick={() => r.reportUrl && handleDownload(r.reportUrl)}
                                                            disabled={!r.reportUrl}
                                                            className={`bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:bg-gray-400 transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:hover:scale-100`}
                                                        >
                                                            ទាញយក
                                                        </button>
                                                    </div>
                                                </div>

                                                {!r.reportUrl && (
                                                    <div className="text-center text-gray-500 mt-4 text-sm">
                                                        របាយការណ៍នេះមិនទាន់បានបញ្ចូលឯកសារនៅឡើយទេ។
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center text-gray-500 text-sm py-4">
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
