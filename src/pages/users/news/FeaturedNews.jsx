import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import newsService from '../../../services/newsService';

function FeaturedNews() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [animationTriggered, setAnimationTriggered] = useState(false);
  const [visibleItems, setVisibleItems] = useState(new Set());
  const containerRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    fetchFeatured(1, true);
  }, []);

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
    const cards = containerRef.current.querySelectorAll('[data-news-item]');
    cards.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    if (!loading && items.length > 0 && !animationTriggered) {
      setTimeout(() => setAnimationTriggered(true), 100);
    }
  }, [loading, items, animationTriggered]);

  const fetchFeatured = async (targetPage = 1, replace = false) => {
    try {
      if (targetPage === 1 && replace) setLoading(true); else setLoadingMore(true);
      const result = await newsService.getNews({ page: targetPage, featured: true });
      if (result.error) {
        setError(result.error);
      } else {
        const incoming = result.data || [];
        setItems(prev => (replace ? incoming : [...prev, ...incoming]));
        const p = result.pagination;
        const hasMoreFromApi = p && typeof p.hasMore === 'boolean' ? p.hasMore : false;
        setHasMore(hasMoreFromApi);
        setPage(targetPage);
      }
    } catch (e) {
      setError('Failed to load featured news');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    fetchFeatured(page + 1, false);
  };

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

  // Helper: detect featured across different data shapes (declared early for effects)
  const isFeatured = (n) => {
    const v = n?.featured ?? n?.is_featured ?? n?.highlighted;
    if (typeof v === 'boolean') return v;
    if (typeof v === 'number') return v === 1;
    if (typeof v === 'string') return v === '1' || v.toLowerCase() === 'true' || v === 'សំខាន់';
    return false;
  };

  // Since /news/featured endpoint returns only featured items, no need to filter
  const displayedItems = items;

  if (loading && items.length === 0) {
    return (
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 bg-gray-200 rounded w-64 mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-3 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-full mb-3 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                </div>
              </div>
            ))}
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
            <p className="text-gray-600">មានបញ្ហាក្នុងការទាញយកព័ត៌មានសំខាន់: {error}</p>
            <button onClick={() => fetchFeatured(1, true)} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">ព្យាយាមម្តងទៀត</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link
                  to="/"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  ទំព័រដើម
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <Link
                    to="/news"
                    className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
                  >
                    ព័ត៌មាន
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                    ព័ត៌មានសំខាន់
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl text-gray-900 mb-4">
              ព័ត៌មានសំខាន់ៗ
            </h1>
          </div>
        </div>

        {/* News Grid */}
        <div ref={containerRef}>
          {displayedItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">📰</div>
              <p className="text-gray-600 text-lg">មិនមានព័ត៌មានសំខាន់ទេ</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedItems.map((news, index) => (
                <article
                  key={news.id}
                  data-news-item
                  data-index={index}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden news-card-hover ${visibleItems.has(index) || animationTriggered
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-12 scale-95'
                    }`}
                  style={{ transitionDelay: `${200 + (index * 100)}ms` }}
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
                    <div className="absolute top-4 right-4">
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium">សំខាន់</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="text-sm text-gray-500 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {getTimeAgo(news)}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">{news.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{news.content ? news.content.substring(0, 150) + '...' : ''}</p>
                    <Link to={`/news/${news.slug}`} className="text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200">អានបន្ថែម →</Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {(displayedItems.length > 0 || hasMore) && (
            <div className="text-center mt-12">
              {hasMore ? (
                <button onClick={loadMore} disabled={loadingMore} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  {loadingMore ? 'កំពុងផ្ទុក...' : 'មើលបន្ថែម'}
                </button>
              ) : (
                <p className="text-gray-600">បង្ហាញព័ត៌មាន {displayedItems.length} សរុប</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FeaturedNews;
