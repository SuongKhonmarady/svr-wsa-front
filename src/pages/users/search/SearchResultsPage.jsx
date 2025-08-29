import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import newsService from '../../../services/newsService'

function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const [searchResults, setSearchResults] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const query = searchParams.get('q') || ''

  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query])

  const performSearch = async (searchQuery) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await newsService.globalSearch(searchQuery, 50)
      
      console.log('Search API Response:', response)
      
      if (response && !response.error) {
        let searchData = {}
        
        // Handle different response structures
        if (response.data) {
          if (response.data.data) {
            // Structure: { data: { success: true, data: { monthly_reports: [...], yearly_reports: [...] } } }
            const responseData = response.data.data
            searchData = {
              news: responseData.news || [],
              monthlyReports: responseData.monthly_reports || [],
              yearlyReports: responseData.yearly_reports || []
            }
          } else {
            // Structure: { data: { success: true, news: [...], monthly_reports: [...], yearly_reports: [...] } }
            searchData = {
              news: response.data.news || [],
              monthlyReports: response.data.monthly_reports || [],
              yearlyReports: response.data.yearly_reports || []
            }
          }
        } else if (response.data) {
          // Direct data structure
          searchData = {
            news: response.data.news || [],
            monthlyReports: response.data.monthly_reports || response.data.monthlyReports || [],
            yearlyReports: response.data.yearly_reports || response.data.yearlyReports || []
          }
        }
        
        console.log('Parsed search data:', searchData)
        
        // Additional debugging
        if (searchData.news && searchData.news.length > 0) {
          console.log('News count:', searchData.news.length)
          console.log('Sample news item:', searchData.news[0])
        }
        if (searchData.monthlyReports) {
          console.log('Monthly reports count:', searchData.monthlyReports.length)
          console.log('Sample monthly report:', searchData.monthlyReports[0])
        }
        if (searchData.yearlyReports) {
          console.log('Yearly reports count:', searchData.yearlyReports.length)
          console.log('Sample yearly report:', searchData.yearlyReports[0])
        }
        
        setSearchResults(searchData)
      } else {
        setError(response?.error || response?.data?.message || 'មានបញ្ហាក្នុងការស្វែងរក')
      }
    } catch (err) {
      console.error('Search error:', err)
      setError('មានបញ្ហាក្នុងការស្វែងរក')
    } finally {
      setIsLoading(false)
    }
  }

  const getTotalResultsCount = () => {
    let total = 0
    if (searchResults.news) total += searchResults.news.length
    if (searchResults.monthlyReports) total += searchResults.monthlyReports.length
    if (searchResults.yearlyReports) total += searchResults.yearlyReports.length
    return total
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('km-KH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getMonthName = (monthData) => {
    const khmerMonths = {
      'January': 'មករា', 'February': 'កុម្ភៈ', 'March': 'មីនា', 'April': 'មេសា', 
      'May': 'ឧសភា', 'June': 'មិថុនា', 'July': 'កក្កដា', 'August': 'សីហា', 
      'September': 'កញ្ញា', 'October': 'តុលា', 'November': 'វិច្ឆិកា', 'December': 'ធ្នូ'
    }
    
    // Handle nested month object from backend
    if (monthData && typeof monthData === 'object' && monthData.month) {
      return khmerMonths[monthData.month] || monthData.month
    }
    
    // Handle simple month number
    if (typeof monthData === 'number') {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']
      return khmerMonths[monthNames[monthData - 1]] || ''
    }
    
    return ''
  }

  const getYearValue = (yearData) => {
    // Handle nested year object from backend
    if (yearData && typeof yearData === 'object' && yearData.year_value) {
      return yearData.year_value
    }
    
    // Handle simple year number
    if (typeof yearData === 'number') {
      return yearData
    }
    
    return ''
  }

  if (!query) {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">ស្វែងរក</h1>
              <p className="text-gray-600">សូមបញ្ចូលពាក្យគន្លឹះដើម្បីស្វែងរក</p>
            </div>
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Header */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              ព័ត៌មានដែរអ្នកស្វែងរក 
            </h2>
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="font-semibold text-blue-600">"{query}"</span>
              {!isLoading && (
                <span>({getTotalResultsCount()} លទ្ធផល)</span>
              )}
            </div>
          </div>

          {isLoading ? (
            /* Loading State */
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span>កំពុងស្វែងរក...</span>
              </div>
            </div>
          ) : error ? (
            /* Error State */
            <div className="text-center py-16">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <svg className="w-12 h-12 mx-auto text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          ) : getTotalResultsCount() === 0 ? (
            /* No Results */
            <div className="text-center py-16">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">មិនមានព័ត៍មាន</h2>
              <p className="text-gray-600 mb-4">មិនមានព័ត៍មានសម្រាប់ "{query}"</p>
              <div className="text-sm text-gray-500">
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>ពិនិត្យអក្ខរវិរុទ្ធ</li>
                  <li>ប្រើពាក្យគន្លឹះផ្សេងទៀត</li>
                </ul>
              </div>
            </div>
          ) : (
            /* Results */
            <div className="space-y-8">
              {/* News Results */}
              {searchResults.news && searchResults.news.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                      <span className="text-xl mr-2">📰</span>
                      ព័ត៌មានថ្មី ({searchResults.news.length})
                    </h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {searchResults.news.map((item) => (
                      <a
                        key={`news-${item.id}`}
                        href={`/news/${item.slug || item.id}`}
                        className="block p-6 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-blue-600 hover:text-blue-800 mb-2">
                              {item.title}
                            </h3>
                            <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                              {item.content_preview}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{formatDate(item.published_at || item.created_at)}</span>
                              <span className="text-green-600 font-medium">ព័ត៌មាន</span>
                            </div>
                          </div>
                          {item.image && (
                            <div className="flex-shrink-0">
                              <img
                                src={apiService.getImageUrl(item.image)}
                                alt={item.title}
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                            </div>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Monthly Reports Results */}
              {searchResults.monthlyReports && searchResults.monthlyReports.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                      <span className="text-xl mr-2">📊</span>
                      របាយការណ៍ប្រចាំខែ ({searchResults.monthlyReports.length})
                    </h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {searchResults.monthlyReports.map((item) => (
                      <a
                        key={`monthly-${item.id}`}
                        href={`/data/monthly/${getYearValue(item.year)}/report/${item.id}`}
                        className="block p-6 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-blue-600 hover:text-blue-800 mb-2">
                              របាយការណ៍ប្រចាំខែ {getMonthName(item.month)} ឆ្នាំ {getYearValue(item.year)}
                            </h3>
                            <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                              {item.description || `របាយការណ៍ប្រចាំខែ ${getMonthName(item.month)} ឆ្នាំ ${getYearValue(item.year)} - ព័ត៌មានលម្អិតអំពីសេវាកម្មផ្គត់ផ្គង់ទឹកស្វាយរៀង`}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{getMonthName(item.month)} {getYearValue(item.year)}</span>
                              <span className="text-blue-600 font-medium">របាយការណ៍ប្រចាំខែ</span>
                              {item.status && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  item.status === 'published' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {item.status === 'published' ? 'បានបង្ហោះ' : 'មិនទាន់បង្ហោះ'}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex-shrink-0 text-2xl">
                            📊
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Yearly Reports Results */}
              {searchResults.yearlyReports && searchResults.yearlyReports.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                      <span className="text-xl mr-2">📈</span>
                      របាយការណ៍ប្រចាំឆ្នាំ ({searchResults.yearlyReports.length})
                    </h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {searchResults.yearlyReports.map((item) => (
                      <a
                        key={`yearly-${item.id}`}
                        href={`/data/yearly/${getYearValue(item.year)}/report/${item.id}`}
                        className="block p-6 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-blue-600 hover:text-blue-800 mb-2">
                              របាយការណ៍ប្រចាំឆ្នាំ {getYearValue(item.year)}
                            </h3>
                            <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                              {item.description || `របាយការណ៍ប្រចាំឆ្នាំ ${getYearValue(item.year)} - សង្ខេបព័ត៌មានសម្រាប់ទាំងឆ្នាំរបស់សេវាកម្មផ្គត់ផ្គង់ទឹកស្វាយរៀង`}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>ឆ្នាំ {getYearValue(item.year)}</span>
                              <span className="text-purple-600 font-medium">របាយការណ៍ប្រចាំឆ្នាំ</span>
                              {item.status && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  item.status === 'published' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {item.status === 'published' ? 'បានបង្ហោះ' : 'មិនទាន់បង្ហោះ'}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex-shrink-0 text-2xl">
                            📈
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
  )
}

export default SearchResultsPage
