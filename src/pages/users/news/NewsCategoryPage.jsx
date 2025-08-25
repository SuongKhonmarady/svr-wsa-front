import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiService from '../../../services/api';
import newsService from '../../../services/newsService';

function NewsCategoryPage() {
    const { categorySlug } = useParams();
    const [news, setNews] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (categorySlug) {
            fetchCategoryAndNews();
        }
    }, [categorySlug]);

    const fetchCategoryAndNews = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch news by category (this also returns category info)
            const newsResult = await newsService.getNewsByCategory(categorySlug);

            console.log('API Response:', newsResult); // Debug log

            if (newsResult.error) {
                setError('Failed to load news');
                return;
            }

            // Extract category info from the response
            if (newsResult.data && newsResult.data.category_info) {
                setCategory(newsResult.data.category_info.category_details);
            }

            // Extract news data
            if (newsResult.data && newsResult.data.data) {
                setNews(newsResult.data.data);
            } else {
                setNews([]);
            }

        } catch (err) {
            setError('Failed to load data');
            console.error('Error fetching category and news:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-20">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Content</h3>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <Link
                            to="/news"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Back to News
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-20">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                            <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Category Not Found</h3>
                        <p className="text-gray-600 mb-6">The requested category could not be found.</p>
                        <Link
                            to="/news"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Back to News
                        </Link>
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
                                    Home
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
                                        News
                                    </Link>
                                </div>
                            </li>
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                                        {category ? category.name : 'Loading...'}
                                    </span>
                                </div>
                            </li>
                        </ol>
                    </nav>

                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            {category ? category.name : 'Loading...'}
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {category ? `Stay updated with the latest news and updates from ${category.name}` : 'Loading category information...'}
                        </p>
                        {news.length > 0 && (
                            <div className="mt-4 text-sm text-gray-500">
                                Found {news.length} article{news.length !== 1 ? 's' : ''} in this category
                            </div>
                        )}
                    </div>
                </div>

                {/* News Grid */}
                {news.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                            <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No News Available</h3>
                        <p className="text-gray-600 mb-6">
                            There are currently no news articles in this category.
                        </p>
                        <Link
                            to="/news"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            View All News
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {news.map((article) => (
                            <article
                                key={article.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                            >
                                {/* Article Image */}
                                {article.image && (
                                    <div className="aspect-w-16 aspect-h-9">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    </div>
                                )}

                                {/* Article Content */}
                                <div className="p-6">
                                    {/* Category Badge */}
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {category.name}
                                        </span>
                                        {article.featured && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                Featured
                                            </span>
                                        )}
                                    </div>

                                    {/* Article Title */}
                                    <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                                        <Link
                                            to={`/news/${article.slug || article.id}`}
                                            className="hover:text-blue-600 transition-colors duration-200"
                                        >
                                            {article.title}
                                        </Link>
                                    </h2>

                                    {/* Article Excerpt */}
                                    {article.content && (
                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                            {article.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                                        </p>
                                    )}

                                    {/* Article Meta */}
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span>{formatDate(article.published_at || article.created_at)}</span>
                                        <Link
                                            to={`/news/${article.slug || article.id}`}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            Read More →
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* Back to All News */}
                <div className="mt-16 text-center">
                    <Link
                        to="/news"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to All News
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NewsCategoryPage;