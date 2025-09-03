import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import newsService from '../../../../services/newsService';

function NewsList() {
  const [newsData, setNewsData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleItems, setVisibleItems] = useState(new Set());
  const [animationTriggered, setAnimationTriggered] = useState(false);

  const observerRef = useRef(null);
  const containerRef = useRef(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    fetchNewsAndCategories();
  }, []); // Empty dependency array to run only once

  // Intersection Observer for scroll animations
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleItems(prev => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observerRef.current = observer;

    // Observe all news items
    const newsItems = containerRef.current.querySelectorAll('[data-news-item]');
    newsItems.forEach((item) => observer.observe(item));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []); // Remove dependencies to prevent recreation on every data change

  // Trigger initial animations when data loads
  useEffect(() => {
    if (!loading && newsData.length > 0 && !animationTriggered) {
      setTimeout(() => setAnimationTriggered(true), 100);
    }
  }, [loading, newsData, animationTriggered]);

  const fetchNewsAndCategories = async () => {
    // Generate a unique request ID for this call
    const currentRequestId = ++requestIdRef.current;

    try {
      setLoading(true);

      // Fetch news and categories in parallel
      const [newsResult, categoriesResult] = await Promise.all([
        newsService.getNews(),
        newsService.getCategories()
      ]);

      // Check if this is still the current request (prevents stale updates)
      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      if (newsResult.error) {
        setError(newsResult.error);
      } else {
        setNewsData(newsResult.data || []);
      }

      if (categoriesResult.error) {
        console.warn('Failed to load categories:', categoriesResult.error);
        setCategories([]);
      } else {
        setCategories(categoriesResult.data || []);
      }

    } catch (err) {
      // Check if this is still the current request
      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      setError('Failed to load news and categories');
      console.error('Error fetching data:', err);
    } finally {
      // Only update loading state if this is still the current request
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  // Get featured news
  const featuredNews = newsData.filter(news => news.featured).slice(0, 3);

  // Get regular news (non-featured)
  const regularNews = newsData.filter(news => !news.featured);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('km-KH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Function to get relative time (e.g., "2h ago", "1d ago")
  const getTimeAgo = (news) => {
    if (!news.published_at && !news.created_at) return '';

    const date = new Date(news.published_at || news.created_at);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  };

  const getCategoryUrl = (category) => {
    if (!category) return '/news';
    return `/news/category/${category.slug || category.name.toLowerCase()}`;
  };

  if (loading) {
    return (
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured News Skeleton */}
          <div className="mb-16">
            <div className="h-10 bg-gray-200 rounded w-64 mb-8 animate-pulse"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Image Skeleton */}
                  <div className="relative h-64 lg:h-auto">
                    <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                    {/* Category Badge Skeleton */}
                    <div className="absolute top-4 left-4">
                      <div className="h-8 bg-gray-300 rounded-full w-24 animate-pulse"></div>
                    </div>
                    {/* Featured Badge Skeleton */}
                    <div className="absolute top-4 right-4">
                      <div className="h-6 bg-gray-300 rounded-full w-16 animate-pulse"></div>
                    </div>
                  </div>
                  {/* Content Skeleton */}
                  <div className="p-8 lg:p-12">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded w-full mb-6 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-6 animate-pulse"></div>
                    <div className="h-12 bg-gray-200 rounded w-32 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Category Filter Skeleton */}
          <div className="flex flex-wrap gap-3 mb-12">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-gray-200 rounded-full w-24 animate-pulse"></div>
            ))}
          </div>

          {/* News Grid Skeleton */}
          <div>
            <div className="h-10 bg-gray-200 rounded w-80 mb-8 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  {/* Image Skeleton */}
                  <div className="relative">
                    <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                    {/* Category Badge Skeleton */}
                    <div className="absolute top-4 left-4">
                      <div className="h-6 bg-gray-300 rounded-full w-20 animate-pulse"></div>
                    </div>
                  </div>
                  {/* Content Skeleton */}
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-3 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded w-full mb-3 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-48 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-4">❌</div>
            <p className="text-gray-600">មានបញ្ហាក្នុងការទាញយកព័ត៌មាន: {error}</p>
            <button
              onClick={fetchNewsAndCategories}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              ព្យាយាមម្តងទៀត
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .news-card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .news-card-hover:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        .category-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .category-button:hover {
          transform: translateY(-2px);
        }
      `}</style>

      <div className="py-16 bg-white" ref={containerRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured News */}
          {featuredNews.length > 0 && (
            <div className="mb-16">
              <h2 className={`text-3xl font-bold text-gray-900 mb-8 font-khmer-title transition-all duration-1000 ${animationTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                ព័ត៌មានសំខាន់
              </h2>
              {featuredNews.map((news, index) => (
                <div
                  key={news.id}
                  data-news-item
                  data-index={index}
                  className={`bg-white rounded-2xl shadow-xl overflow-hidden mb-12 transition-all duration-1000 ${visibleItems.has(index) || animationTriggered
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-12 scale-95'
                    }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    <div className="relative h-64 lg:h-auto">
                      <img
                        src={news.image || "/image/mohamed-shaik-ScftZZiZnB8-unsplash.jpg"}
                        alt={news.title}
                        className="w-full h-full object-cover"
                      />
                      {news.category && (
                        <div className="absolute top-4 left-4">
                          <Link
                            to={getCategoryUrl(news.category)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                          >
                            {news.category.name}
                          </Link>
                        </div>
                      )}
                      {news.featured && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            សំខាន់
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-8 lg:p-12">
                      <div className="text-sm text-gray-500 mb-4 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {getTimeAgo(news)}
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                        {news.title}
                      </h3>
                      <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                        {news.content ? news.content.substring(0, 200) + '...' : ''}
                      </p>
                      <a
                        href={`/news/${news.slug || news.id}`}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium inline-block"
                      >
                        អានបន្ថែម
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Category Filter */}
          <div className={`flex flex-wrap gap-3 mb-12 transition-all duration-1000 ${animationTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '300ms' }}>
            <Link
              to="/news"
              className="px-6 py-2 rounded-full border category-button bg-blue-600 text-white border-blue-600 shadow-lg"
            >
              ទាំងអស់
            </Link>
            {categories.map((category, index) => (
              <a
                key={category.id}
                href={getCategoryUrl(category)}
                className="px-6 py-2 rounded-full border category-button bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:text-blue-600"
                style={{
                  animationDelay: `${(index + 1) * 100}ms`,
                  animation: animationTriggered ? 'fadeInUp 0.6s ease-out forwards' : 'none'
                }}
              >
                {category.name}
              </a>
            ))}
          </div>

          {/* News Grid */}
          <div>
            <h2 className={`text-3xl font-bold text-gray-900 mb-8 font-khmer-title transition-all duration-1000 ${animationTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{ transitionDelay: '500ms' }}>
              ព័ត៌មានថ្មីៗទាំងអស់
            </h2>

            {regularNews.length === 0 ? (
              <div className={`text-center py-16 transition-all duration-1000 ${animationTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`} style={{ transitionDelay: '700ms' }}>
                <div className="text-gray-400 text-6xl mb-4">📰</div>
                <p className="text-gray-600 text-lg">
                  មិនមានព័ត៌មានទេ
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularNews.map((news, index) => (
                  <article
                    key={news.id}
                    data-news-item
                    data-index={featuredNews.length + index}
                    className={`bg-white rounded-2xl shadow-lg overflow-hidden news-card-hover ${visibleItems.has(featuredNews.length + index) || animationTriggered
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-12 scale-95'
                      }`}
                    style={{ transitionDelay: `${600 + (index * 100)}ms` }}
                  >
                    <div className="relative">
                      <a href={`/news/${news.slug}`}>
                        <img
                          src={news.image || "/image/mohamed-shaik-ScftZZiZnB8-unsplash.jpg"}
                          alt={news.title}
                          className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </a>
                      {news.category && (
                        <div className="absolute top-4 left-4">
                          <Link
                            to={getCategoryUrl(news.category)}
                            className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-700 transition-colors duration-200"
                          >
                            {news.category.name}
                          </Link>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="text-sm text-gray-500 mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {getTimeAgo(news)}
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                        {news.title}
                      </h3>

                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {news.content ? news.content.substring(0, 150) + '...' : ''}
                      </p>

                      <Link
                        to={`/news/${news.slug}`}
                        className="text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200"
                      >
                        អានបន្ថែម →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Show total count */}
          {newsData.length > 0 && (
            <div className={`text-center mt-12 transition-all duration-1000 ${animationTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{ transitionDelay: '1000ms' }}>
              <p className="text-gray-600">
                បង្ហាញព័ត៌មាន {newsData.length} សរុប
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default NewsList;