import { useState, useEffect, useRef } from 'react'
import { useNews } from '../../../../hooks/useApi'

function NewsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  // Helper function to get the most appropriate date for sorting and display
  const getMostRecentDate = (newsItem) => {
    const publishedDate = newsItem.published_at ? new Date(newsItem.published_at) : null;
    const createdDate = newsItem.created_at ? new Date(newsItem.created_at) : null;
    const now = new Date();
    
    if (publishedDate && createdDate) {
      // If published date is in the future or much older than created date, use created date
      if (publishedDate > now || (createdDate > publishedDate)) {
        return createdDate;
      } else {
        return publishedDate;
      }
    } else {
      return publishedDate || createdDate;
    }
  };

  // Function to get relative time (e.g., "2h ago", "1d ago")
  const getTimeAgo = (news) => {
    const postDate = getMostRecentDate(news);
    
    if (!postDate) return '';
    
    const now = new Date();
    const diffInSeconds = Math.floor((now - postDate) / 1000);
    
    if (diffInSeconds < 60) {
      return 'ទើបតែ'; // Just now
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}នាទី​មុន`; // X minutes ago
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}ម៉ោង​មុន`; // X hours ago
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}ថ្ងៃ​មុន`; // X days ago
    } else if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months}ខែ​មុន`; // X months ago
    } else {
      const years = Math.floor(diffInSeconds / 31536000);
      return `${years}ឆ្នាំ​មុន`; // X years ago
    }
  };
  
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

  // Use custom hook for news fetching with auto-refresh
  const { news, loading, error, retry, refreshing, retryCount } = useNews(true, 300000) // Auto-refresh every 5 minutes

  // Loading state
  if (loading) {
    return (
      <div ref={sectionRef} className="py-16 relative">
        <div className="absolute inset-0 bg-gray-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <div className="h-10 bg-gray-200 rounded-lg w-48 mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded-lg w-64 animate-pulse"></div>
            </div>
            <div className="hidden md:block h-12 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
            <h3 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl sm:mb-6 md:mb-8 font-semibold text-gray-900 mb-4">
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
    <div ref={sectionRef} className="py-16 relative">
      {/* Light overlay for better readability */}
      <div className="absolute inset-0 bg-gray-50"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center mb-12 transition-all duration-1000 ${
          isVisible 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform translate-y-8'
        }`}>
          <div>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl sm:mb-6 md:mb-8 font-bold text-gray-900 mb-4 font-khmer-title">
              ព័ត៌មានថ្មីៗ
            </h2>
            <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 md:mb-12 text-gray-600">
              ព័ត៌មាន និងការប្រកាសចុងក្រោយបំផុត ១០ ដំបូង
            </p>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={() => window.location.href = '/news'}
              className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 text-sm sm:text-base font-medium"
            >
              <span className="flex items-center space-x-2">
                <span>មើលទាំងអស់</span>
              </span>
            </button>
          </div>
        </div>

        {/* Check if news data exists */}
        {news && news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news
              // Sort by the most appropriate date (showing "just now" news first)
              .sort((a, b) => {
                const dateA = getMostRecentDate(a);
                const dateB = getMostRecentDate(b);
                return dateB - dateA; // Most recent first
              })
              // Take only the first 10 items
              .slice(0, 10)
              .map((item, index) => (
              <article 
                key={item.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-1000 hover:scale-105 ${
                  isVisible 
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform translate-y-8'
                }`}
                style={{ transitionDelay: `${300 + index * 100}ms` }} // Reduced delay for more items
              >
                <div className="relative">
                  <img
                    src={item.image || '/image/svrwsa_logo_high_quality.png'}
                    alt={item.title || 'News image'}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      console.log('Image failed to load:', item.image);
                      e.target.src = '/image/svrwsa_logo_high_quality.png';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    {item.featured ? (
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        ព័ត៌មានសំខាន់
                      </span>
                    ) : (
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        ព័ត៌មាន
                      </span>
                    )}
                  </div>
                  {item.category && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-gray-800 bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                        {item.category.name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {getTimeAgo(item)}
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

                  <a
                    href={`/news/${item.slug}`}
                    className="text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200"
                  >
                    អានបន្ថែម →
                  </a>
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
          <button 
            onClick={() => window.location.href = '/news'}
            className="bg-blue-600 text-white px-6 sm:px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base font-medium"
          >
            មើលព័ត៌មានទាំងអស់
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewsSection
