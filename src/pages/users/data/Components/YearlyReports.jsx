import { useState, useEffect } from 'react'
import apiService from '../../../../services/api'

function YearlyReports() {
    const [yearlyReports, setYearlyReports] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [sortBy, setSortBy] = useState('year-desc') // year-desc, year-asc, revenue, customers

    // Mock data for yearly reports - replace with actual API call
    const fetchYearlyReports = async () => {
        setLoading(true)
        try {
            const currentYear = new Date().getFullYear()
            const mockReports = []
            
            // Generate reports for past 10 years
            for (let i = 0; i < 10; i++) {
                const year = currentYear - i
                mockReports.push({
                    id: year,
                    year: year,
                    reportUrl: `/reports/yearly/${year}.pdf`,
                    totalWaterProduction: Math.floor(Math.random() * 500000) + 300000,
                    averageCustomerCount: Math.floor(Math.random() * 50000) + 80000,
                    totalRevenue: Math.floor(Math.random() * 1000000) + 500000,
                    waterQualityScore: (Math.random() * 20 + 80).toFixed(1), // 80-100%
                    customerSatisfaction: (Math.random() * 15 + 85).toFixed(1), // 85-100%
                    isAvailable: Math.random() > 0.15, // 85% chance of being available
                    publishedDate: new Date(year + 1, 2, Math.floor(Math.random() * 30) + 1), // March of next year
                    highlights: [
                        'បង្កើនទីកន្លែងផ្គត់ផ្គង់ថ្មី',
                        'ធ្វើបច្ចុប្បន្នភាពប្រព័ន្ធចម្រាញ់ទឹក',
                        'កាត់បន្ថយការប្រើប្រាស់ថាមពលរហូតដល់ 15%'
                    ]
                })
            }
            
            setYearlyReports(mockReports)
            setError('')
        } catch (err) {
            setError('មិនអាចទាញយកទិន្នន័យបាន។ សូមព្យាយាមម្តងទៀត។')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchYearlyReports()
    }, [])

    const handleDownloadReport = (report) => {
        // Mock download - replace with actual download logic
        console.log(`Downloading yearly report for ${report.year}`)
        // window.open(report.reportUrl, '_blank')
    }

    const sortedReports = [...yearlyReports].sort((a, b) => {
        switch (sortBy) {
            case 'year-asc':
                return a.year - b.year
            case 'year-desc':
                return b.year - a.year
            case 'revenue':
                return b.totalRevenue - a.totalRevenue
            case 'customers':
                return b.averageCustomerCount - a.averageCustomerCount
            default:
                return b.year - a.year
        }
    })

    return (
        <div className="bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Controls */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
                            របាយការណ៍ប្រចាំឆ្នាំទាំងអស់
                        </h2>
                        <div className="flex items-center space-x-4">
                            <label className="text-gray-700 font-medium">តម្រៀប:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option value="year-desc">ឆ្នាំថ្មីបំផុត</option>
                                <option value="year-asc">ឆ្នាំចាស់បំផុត</option>
                                <option value="revenue">ចំណូលខ្ពស់បំផុត</option>
                                <option value="customers">អតិថិជនច្រើនបំផុត</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Yearly Reports List */}
                {!loading && !error && (
                    <div className="space-y-6">
                        {sortedReports.map((report) => (
                            <div key={report.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                                <div className="md:flex">
                                    {/* Left Side - Year and Status */}
                                    <div className="md:w-1/4 bg-gradient-to-br from-green-500 to-green-600 text-white p-6 flex flex-col justify-center items-center">
                                        <div className="text-4xl font-bold mb-2">{report.year}</div>
                                        <div className="text-green-100 text-sm mb-4">របាយការណ៍ប្រចាំឆ្នាំ</div>
                                        {report.isAvailable ? (
                                            <div className="flex items-center space-x-2 bg-green-400/30 rounded-full px-3 py-1">
                                                <div className="w-2 h-2 bg-green-200 rounded-full"></div>
                                                <span className="text-sm">មាន</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-2 bg-yellow-400/30 rounded-full px-3 py-1">
                                                <div className="w-2 h-2 bg-yellow-200 rounded-full"></div>
                                                <span className="text-sm">មិនទាន់មាន</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Side - Content */}
                                    <div className="md:w-3/4 p-6">
                                        {report.isAvailable ? (
                                            <>
                                                {/* Statistics Grid */}
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                                                        <div className="text-lg font-bold text-blue-600">
                                                            {report.totalWaterProduction.toLocaleString()}L
                                                        </div>
                                                        <div className="text-xs text-gray-600">ទឹកផលិតសរុប</div>
                                                    </div>
                                                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                                                        <div className="text-lg font-bold text-purple-600">
                                                            {report.averageCustomerCount.toLocaleString()}
                                                        </div>
                                                        <div className="text-xs text-gray-600">អតិថិជនមធ្យម</div>
                                                    </div>
                                                    <div className="text-center p-3 bg-green-50 rounded-lg">
                                                        <div className="text-lg font-bold text-green-600">
                                                            ${report.totalRevenue.toLocaleString()}
                                                        </div>
                                                        <div className="text-xs text-gray-600">ចំណូលសរុប</div>
                                                    </div>
                                                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                                                        <div className="text-lg font-bold text-orange-600">
                                                            {report.waterQualityScore}%
                                                        </div>
                                                        <div className="text-xs text-gray-600">គុណភាពទឹក</div>
                                                    </div>
                                                </div>

                                                {/* Highlights */}
                                                <div className="mb-6">
                                                    <h4 className="font-semibold text-gray-900 mb-3">ចំណុចសំខាន់ៗ:</h4>
                                                    <ul className="space-y-2">
                                                        {report.highlights.map((highlight, index) => (
                                                            <li key={index} className="flex items-start space-x-2">
                                                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                                                <span className="text-gray-700 text-sm">{highlight}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200">
                                                    <div className="text-sm text-gray-500 mb-4 sm:mb-0">
                                                        បោះពុម្ពនៅ: {report.publishedDate.toLocaleDateString('km-KH')}
                                                    </div>
                                                    <button
                                                        onClick={() => handleDownloadReport(report)}
                                                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <span>ទាញយករបាយការណ៍</span>
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center py-8">
                                                <div className="text-gray-400 mb-4">
                                                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <h4 className="text-lg font-semibold text-gray-600 mb-2">
                                                    របាយការណ៍ឆ្នាំ {report.year} មិនទាន់មាន
                                                </h4>
                                                <p className="text-gray-500 text-sm">
                                                    របាយការណ៍នេះកំពុងត្រូវបានរៀបចំ និងនឹងអាចទាញយកបាននៅពេលក្រោយ
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Overall Statistics */}
                {!loading && !error && yearlyReports.length > 0 && (
                    <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">ស្ថិតិទូទៅ</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600 mb-2">
                                    {yearlyReports.filter(r => r.isAvailable).length}
                                </div>
                                <p className="text-gray-700">របាយការណ៍ដែលមាន</p>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600 mb-2">
                                    {Math.round(yearlyReports
                                        .filter(r => r.isAvailable)
                                        .reduce((sum, r) => sum + parseFloat(r.waterQualityScore), 0) / 
                                        yearlyReports.filter(r => r.isAvailable).length) || 0}%
                                </div>
                                <p className="text-gray-700">គុណភាពទឹកមធ្យម</p>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600 mb-2">
                                    {yearlyReports
                                        .filter(r => r.isAvailable)
                                        .reduce((sum, r) => sum + r.totalWaterProduction, 0)
                                        .toLocaleString()}L
                                </div>
                                <p className="text-gray-700">ទឹកផលិតសរុប</p>
                            </div>
                            <div className="text-center p-4 bg-orange-50 rounded-lg">
                                <div className="text-2xl font-bold text-orange-600 mb-2">
                                    ${yearlyReports
                                        .filter(r => r.isAvailable)
                                        .reduce((sum, r) => sum + r.totalRevenue, 0)
                                        .toLocaleString()}
                                </div>
                                <p className="text-gray-700">ចំណូលសរុប</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default YearlyReports
