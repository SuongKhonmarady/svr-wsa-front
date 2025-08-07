import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../../../services/api';

function NewsList() {
  const [newsData, setNewsData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNewsAndCategories();
  }, []);

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
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured News */}
        {featuredNews.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 font-khmer-title">
              ព័ត៌មានសំខាន់
            </h2>
            {featuredNews.map((news) => (
              <div key={news.id} className="bg-white rounded-2xl shadow-xl overflow-hidden gap_8 mb-12">
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
                    <div className="text-sm text-gray-500 mb-4">
                      {formatDate(news.published_at || news.created_at)}
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
        <div className="flex flex-wrap gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-2 rounded-full border transition-colors duration-200 ${
              selectedCategory === null
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:text-blue-600'
            }`}
          >
            ទាំងអស់
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full border transition-colors duration-200 ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:text-blue-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 font-khmer-title">
            {selectedCategory ? 'ព័ត៌មានតាមប្រភេទ' : 'ព័ត៌មានថ្មីៗទាំងអស់'}
          </h2>
          
          {regularNews.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">📰</div>
              <p className="text-gray-600 text-lg">
                {selectedCategory ? 'មិនមានព័ត៌មានក្នុងប្រភេទនេះទេ' : 'មិនមានព័ត៌មានទេ'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularNews.map((news) => (
                <article key={news.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={news.image || "https://images.unsplash.com/photo-1577495508048-b635879837f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                      alt={news.title}
                      className="w-full h-48 object-cover"
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
                    <div className="text-sm text-gray-500 mb-3">
                      {formatDate(news.published_at || news.created_at)}
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
          <div className="text-center mt-12">
            <p className="text-gray-600">
              បង្ហាញព័ត៌មាន {filteredNews.length} ក្នុងចំណោម {newsData.length} សរុប
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NewsList;