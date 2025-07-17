import { useNews } from '../../../../hooks/useApi'
import apiService from '../../../../services/api'

function NewsSection() {
  // Use custom hook for news fetching with auto-refresh
  const { news, loading, error, retry, refresh, refreshing, retryCount } = useNews(true, 300000) // Auto-refresh every 5 minutes

  // Loading state
  if (loading) {
    return (
      <div className="py-16 relative">
        <div className="absolute inset-0 bg-gray-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <div className="h-10 bg-gray-200 rounded-lg w-48 mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded-lg w-64 animate-pulse"></div>
            </div>
            <div className="hidden md:block h-12 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="py-16 relative">
        <div className="absolute inset-0 bg-gray-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              មានបញ្ហាក្នុងការផ្ទុកព័ត៌មាន
            </h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            
            {retryCount > 0 && (
              <p className="text-sm text-gray-600 mb-4">
                ការព្យាយាមលើកទី {retryCount + 1} ក្នុងចំណោម 4 លើក
              </p>
            )}

            <div className="flex justify-center space-x-4">
              <button 
                onClick={retry}
                disabled={refreshing}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {refreshing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>កំពុងព្យាយាម...</span>
                  </>
                ) : (
                  <span>ព្យាយាមម្តងទៀត</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16 relative">
      {/* Light overlay for better readability */}
      <div className="absolute inset-0 bg-gray-50"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-khmer-title">
              ព័ត៌មានថ្មីៗ
            </h2>
            <p className="text-xl text-gray-600">
              ការធ្វើប្រើថ្មី និងព័ត៌មានសំខាន់ៗ
            </p>
          </div>
          <div className="hidden md:flex space-x-4">
            <button 
              onClick={refresh}
              disabled={refreshing}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {refreshing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                <span>↻</span>
              )}
            </button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              មើលទាំងអស់
            </button>
          </div>
        </div>

        {/* Check if news data exists */}
        {news && news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((item) => (
              <article key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={apiService.getImageUrl(item.image)}
                    alt={item.title || 'News image'}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      console.log('Image failed to load:', item.image);
                      e.target.src = '/image/svrwsa_logo_high_quality.png';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      ព័ត៌មាន
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-3">
                    {item.published_at ? new Date(item.published_at).toLocaleDateString('km-KH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : new Date(item.created_at).toLocaleDateString('km-KH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {item.title || 'មិនមានចំណងជើង'}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {item.content && item.content.length > 150 
                      ? `${item.content.substring(0, 150)}...` 
                      : item.content || 'មិនមានមាតិកា...'
                    }
                  </p>

                  <button 
                    className="text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200"
                    onClick={() => {
                      // Handle read more action
                      console.log('Read more clicked for:', item.title);
                    }}
                  >
                    អានបន្ថែម →
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl text-gray-300 mb-4">📰</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              មិនមានព័ត៌មាន
            </h3>
            <p className="text-gray-500">
              សូមពិនិត្យមកវិញនៅពេលក្រោយ
            </p>
          </div>
        )}

        <div className="text-center mt-12 md:hidden">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200">
            មើលព័ត៌មានទាំងអស់
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewsSection
