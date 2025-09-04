import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import apiService from '../../../../../services/api'

function MonthlyYearsList() {
    const [years, setYears] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
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

    // Fetch years data from API
    const fetchYears = async () => {
        try {
            setLoading(true)
            setError('')
            setShowContent(false) // Reset content visibility when fetching

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

            // Mark content as ready and trigger animation after scroll detection
            setTimeout(() => {
                setShowContent(true)
            }, 100)

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
        <div ref={sectionRef} className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <p className={`text-xl text-gray-600 max-w-3xl mx-auto transition-all duration-2000 ${isVisible
                        ? 'opacity-100 transform translate-y-0'
                        : 'opacity-0 transform translate-y-8'
                        }`}>
                        ជ្រើសរើសឆ្នាំដើម្បីមើលរបាយការណ៍ប្រចាំខែទាំងអស់
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col sm:flex-row justify-center items-center py-8 sm:py-12 space-y-4 sm:space-y-0 sm:space-x-6">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-200 border-t-blue-600"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-transparent border-r-blue-400 animate-pulse"></div>
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-lg sm:text-xl text-gray-700 font-medium mb-1">កំពុងផ្ទុកទិន្នន័យ...</p>
                            <p className="text-sm sm:text-base text-gray-500">សូមរង់ចាំខណៈយើងទាញយករបាយការណ៍</p>
                        </div>
                        
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
                            <div className={`transition-all duration-800 ${(isVisible && showContent)
                                    ? 'opacity-100 transform translate-y-0'
                                    : 'opacity-0 transform translate-y-8'
                                }`}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                    {years.map((year, index) => (
                                        <a
                                            key={year.id}
                                            href={`/data/monthly/${year.year_value}`}
                                            className="group"
                                        >
                                            <div
                                                className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 overflow-hidden border border-gray-200 ${(isVisible && showContent)
                                                        ? 'opacity-100 translate-y-0 scale-100'
                                                        : 'opacity-0 translate-y-8 scale-95'
                                                    }`}
                                                style={{
                                                    transitionDelay: `${index * 100}ms`,
                                                    animationFillMode: 'both'
                                                }}
                                            >
                                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white transform group-hover:scale-105 transition-transform duration-300">
                                                    <div className="text-center">
                                                        <h3 className="text-3xl font-bold mb-2 transform group-hover:scale-110 transition-transform duration-300">{year.year_value}</h3>
                                                        <p className="text-blue-100 text-sm">ឆ្នាំ</p>
                                                    </div>
                                                </div>

                                                <div className="p-6">
                                                    <div className="text-center">
                                                        <div className="mb-4">
                                                            <svg className="w-8 h-8 mx-auto text-blue-500 group-hover:text-blue-600 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </div>
                                                        <p className="text-gray-600 text-sm mb-4">មើលរបាយការណ៍ប្រចាំខែ</p>
                                                        <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-700 transition-colors duration-200">
                                                            <span className="text-sm font-medium">មើលរបាយការណ៍</span>
                                                            <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className={`text-center py-12 transition-all duration-800 ${(isVisible && showContent)
                                    ? 'opacity-100 transform translate-y-0'
                                    : 'opacity-0 transform translate-y-8'
                                }`}>
                                <div className="text-gray-400 mb-4 transform hover:scale-110 transition-transform duration-300">
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
                    <div className={`mt-12 bg-white rounded-xl shadow-lg p-6 transition-all duration-1000 ${(isVisible && showContent)
                            ? 'opacity-100 transform translate-y-0'
                            : 'opacity-0 transform translate-y-8'
                        }`} style={{ transitionDelay: '600ms' }}>
                        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">ស្ថិតិទូទៅ</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className={`text-center p-4 bg-blue-50 rounded-lg transition-all duration-800 hover:scale-105 transform ${(isVisible && showContent)
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-4'
                                }`} style={{ transitionDelay: '800ms' }}>
                                <div className="text-2xl font-bold text-blue-600 mb-2 transform hover:scale-110 transition-transform duration-300">
                                    {years.length}
                                </div>
                                <p className="text-gray-700">ឆ្នាំសរុប</p>
                            </div>
                            <div className={`text-center p-4 bg-green-50 rounded-lg transition-all duration-800 hover:scale-105 transform ${(isVisible && showContent)
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-4'
                                }`} style={{ transitionDelay: '900ms' }}>
                                <div className="text-2xl font-bold text-green-600 mb-2 transform hover:scale-110 transition-transform duration-300">
                                    {years.length > 0 ? years[0].year_value : 0}
                                </div>
                                <p className="text-gray-700">ឆ្នាំចុងក្រោយ</p>
                            </div>
                            <div className={`text-center p-4 bg-purple-50 rounded-lg transition-all duration-800 hover:scale-105 transform ${(isVisible && showContent)
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-4'
                                }`} style={{ transitionDelay: '1000ms' }}>
                                <div className="text-2xl font-bold text-purple-600 mb-2 transform hover:scale-110 transition-transform duration-300">
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
