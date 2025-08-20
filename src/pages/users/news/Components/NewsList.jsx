import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../../../services/api';

function NewsList() {
  const [newsData, setNewsData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleItems, setVisibleItems] = useState(new Set());
  const [animationTriggered, setAnimationTriggered] = useState(false);
  
  const observerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchNewsAndCategories();
  }, []);

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
  }, [newsData, selectedCategory]);

  // Trigger initial animations when data loads
  useEffect(() => {
    if (!loading && newsData.length > 0) {
      setTimeout(() => setAnimationTriggered(true), 100);
    }
  }, [loading, newsData]);

  const fetchNewsAndCategories = async () => {
    try {
      setLoading(true);
      
      // Fetch news and categories in parallel
      const [newsResult, categoriesResult] = await Promise.all([
        apiService.getNews(),
        apiService.getCategories()
      ]);

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
      setError('Failed to load news and categories');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter news by category
  const filteredNews = selectedCategory 
    ? newsData.filter(news => news.category?.id === selectedCategory)
    : newsData;

  // Get featured news
  const featuredNews = filteredNews.filter(news => news.featured);
  const regularNews = filteredNews.filter(news => !news.featured);

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
    // Use the most recent date between published_at and created_at
    const publishedDate = news.published_at ? new Date(news.published_at) : null;
    const createdDate = news.created_at ? new Date(news.created_at) : null;
    
    // Choose the most recent date, or fall back to created_at if published_at is in the future
    let postDate;
    const now = new Date();
    
    if (publishedDate && createdDate) {
      // If published date is in the future or much older than created date, use created date
      if (publishedDate > now || (createdDate > publishedDate)) {
        postDate = createdDate;
      } else {
        postDate = publishedDate;
      }
    } else {
      postDate = publishedDate || createdDate;
    }
    
    if (!postDate) return '';
    
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

  if (loading) {
    return (
      <div className="py-48 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">កំពុងទាញយកព័ត៌មាន...</p>
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
      
      <div className="py-24 bg-white" ref={containerRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured News */}
        {featuredNews.length > 0 && (
          <div className="mb-16">
            <h2 className={`text-3xl font-bold text-gray-900 mb-8 font-khmer-title transition-all duration-1000 ${
              animationTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              ព័ត៌មានសំខាន់
            </h2>
            {featuredNews.map((news, index) => (
              <div 
                key={news.id} 
                data-news-item
                data-index={index}
                className={`bg-white rounded-2xl shadow-xl overflow-hidden gap_8 mb-12 transition-all duration-1000 ${
                  visibleItems.has(index) || animationTriggered 
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
                      className="w-full h-full object-cover backdrop-blur-2xl"
                    />
                    {news.category && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                          {news.category.name}
                        </span>
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
                      href={`/news/${news.slug}`}
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
        <div className={`flex flex-wrap gap-3 mb-12 transition-all duration-1000 ${
          animationTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} style={{ transitionDelay: '300ms' }}>
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-2 rounded-full border category-button ${
              selectedCategory === null
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:text-blue-600'
            }`}
          >
            ទាំងអស់
          </button>
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full border category-button ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:text-blue-600'
              }`}
              style={{ 
                animationDelay: `${(index + 1) * 100}ms`,
                animation: animationTriggered ? 'fadeInUp 0.6s ease-out forwards' : 'none'
              }}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div>
          <h2 className={`text-3xl font-bold text-gray-900 mb-8 font-khmer-title transition-all duration-1000 ${
            animationTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '500ms' }}>
            {selectedCategory ? 'ព័ត៌មានតាមប្រភេទ' : 'ព័ត៌មានថ្មីៗទាំងអស់'}
          </h2>
          
          {regularNews.length === 0 ? (
            <div className={`text-center py-16 transition-all duration-1000 ${
              animationTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '700ms' }}>
              <div className="text-gray-400 text-6xl mb-4 animate-bounce">📰</div>
              <p className="text-gray-600 text-lg">
                {selectedCategory ? 'មិនមានព័ត៌មានក្នុងប្រភេទនេះទេ' : 'មិនមានព័ត៌មានទេ'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularNews.map((news, index) => (
                <article 
                  key={news.id} 
                  data-news-item
                  data-index={featuredNews.length + index}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden news-card-hover ${
                    visibleItems.has(featuredNews.length + index) || animationTriggered 
                      ? 'opacity-100 translate-y-0 scale-100' 
                      : 'opacity-0 translate-y-12 scale-95'
                  }`}
                  style={{ transitionDelay: `${600 + (index * 100)}ms` }}
                >
                  <div className="relative">
                    <img
                      src={news.image || "https://images.unsplash.com/photo-1577495508048-b635879837f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                      alt={news.title}
                      className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                    />
                    {news.category && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                          {news.category.name}
                        </span>
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

                    <a
                      href={`/news/${news.slug}`}
                      className="text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200"
                    >
                      អានបន្ថែម →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Show total count */}
        {newsData.length > 0 && (
          <div className={`text-center mt-12 transition-all duration-1000 ${
            animationTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '1000ms' }}>
            <p className="text-gray-600 animate-pulse">
              បង្ហាញព័ត៌មាន {filteredNews.length} ក្នុងចំណោម {newsData.length} សរុប
            </p>
          </div>
        )}
        </div>
      </div>
    </>
  );
}

export default NewsList;