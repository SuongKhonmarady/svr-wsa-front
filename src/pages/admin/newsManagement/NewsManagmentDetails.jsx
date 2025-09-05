import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import NewsModal from './Components/NewsModal';
import newsService from '../../../services/newsService';
import { useToast } from '../../../components/ToastContainer';

const NewsManagementDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { showError } = useToast();

    const [news, setNews] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);

    useEffect(() => {
        if (slug) {
            fetchNewsDetails();
            fetchCategories();
        }
    }, [slug]);

    const fetchNewsDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            let result;

            // Check if slug is numeric (likely an ID)
            if (/^\d+$/.test(slug)) {
                result = await newsService.getNewsById(slug);
            } else {
                result = await newsService.getNewsBySlug(slug);
            }

            if (result.error) {
                setError(result.error);
                setNews(null);
            } else {
                setNews(result.data);
            }
        } catch (err) {
            console.error("Failed to fetch news details:", err);
            setError("Failed to load news details. Please try again later.");
            setNews(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const result = await newsService.getCategories();
            if (result.error) {
                // Failed to fetch categories
            } else {
                setCategories(result.data);
            }
        } catch (err) {
            // Failed to fetch categories
        }
    };

    const handleSaveNews = async (formData, newsId) => {
        try {
            let result;
            if (newsId) {
                // Update existing news - use news.slug instead of newsId
                result = await newsService.updateNews(news.slug, formData);
            } else {
                // Create new news
                result = await newsService.createNews(formData);
            }

            if (result.error) {
                showError('Error saving news: ' + result.error);
                throw new Error(result.error);
            } else {
                // Refresh the news details
                await fetchNewsDetails();
                setModalOpen(false);
                // Show success message
                alert(newsId ? 'News updated successfully!' : 'News created successfully!');
            }
        } catch (err) {
            throw err;
        }
    };

    const handleEditNews = () => {
        setSelectedNews(news);
        setModalOpen(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('km-KH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTimeAgo = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) {
            return 'ឥឡូវនេះ';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes}នាទី​មុន`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours}ម៉ោង​មុន`;
        } else if (diffInSeconds < 2592000) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days}ថ្ងៃ​មុន`;
        } else if (diffInSeconds < 31536000) {
            const months = Math.floor(diffInSeconds / 2592000);
            return `${months}ខែ​មុន`;
        } else {
            const years = Math.floor(diffInSeconds / 31536000);
            return `${years}ឆ្នាំ​មុន`;
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="space-y-6">
                    {/* Header Skeleton */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        </div>
                    </div>

                    {/* Content Skeleton */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="animate-pulse space-y-4">
                            <div className="h-64 bg-gray-200 rounded"></div>
                            <div className="space-y-2">
                                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-center py-12">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">មានបញ្ហាក្នុងការទាញយកព័ត៌មាន</h3>
                            <p className="text-gray-600 mb-6">{error}</p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => navigate('/admin/news')}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    ត្រឡប់ទៅព័ត៌មាន
                                </button>
                                <button
                                    onClick={fetchNewsDetails}
                                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                                >
                                    ព្យាយាមម្តងទៀត
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (!news) {
        return (
            <AdminLayout>
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-center py-12">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">រកមិនឃើញព័ត៌មាន</h3>
                            <p className="text-gray-600 mb-6">ព័ត៌មានដែលអ្នកកំពុងស្វែងរក មិនមានទេ។</p>
                            <button
                                onClick={() => navigate('/admin/news')}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                ត្រឡប់ទៅព័ត៌មាន
                            </button>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => navigate('/admin/news')}
                            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            ត្រឡប់ទៅព័ត៌មាន
                        </button>
                        <div className="flex space-x-2">
                            <button
                                onClick={handleEditNews}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                កែប្រែ
                            </button>
                            <button
                                onClick={() => window.open(`/news/${news.slug || news.id}`, '_blank')}
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                            >
                                មើលជាសាធារណៈ
                            </button>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{news.title}</h2>

                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        {news.category && (
                            <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                                {news.category.name}
                            </span>
                        )}
                        {news.featured && (
                            <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full">
                                ⭐ សំខាន់
                            </span>
                        )}
                        <span>បានបង្កើត: {formatDate(news.created_at)}</span>
                        {news.published_at && (
                            <span>បានបោះពុម្ព: {formatDate(news.published_at)}</span>
                        )}
                        <span>ចុងក្រោយ: {getTimeAgo(news.updated_at)}</span>
                    </div>
                </div>

                {/* Featured Image */}
                {news.image && (
                    <div className="bg-white rounded-lg shadow overflow-hidden max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <img
                            src={news.image}
                            alt={news.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="prose prose-lg max-w-none">
                        <div
                            dangerouslySetInnerHTML={{ __html: news.content }}
                            className="article-content"
                        />
                    </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* News Statistics */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">ស្ថិតិព័ត៌មាន</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">លេខសម្គាល់:</span>
                                <span className="font-medium">{news.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Slug:</span>
                                <span className="font-medium font-mono text-sm">{news.slug || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">ស្ថានភាព:</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${news.published_at ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {news.published_at ? 'បានបោះពុម្ព' : 'ព្រាង'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">ប្រភេទ:</span>
                                <span className="font-medium">{news.featured ? 'ព័ត៌មានសំខាន់' : 'ព័ត៌មានធម្មតា'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">សកម្មភាពរហ័ស</h3>
                        <div className="space-y-3">
                            <button
                                onClick={handleEditNews}
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                កែប្រែព័ត៌មាន
                            </button>
                            <button
                                onClick={() => window.open(`/news/${news.slug || news.id}`, '_blank')}
                                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                មើលជាសាធារណៈ
                            </button>
                            <button
                                onClick={() => {
                                    if (navigator.clipboard) {
                                        navigator.clipboard.writeText(`${window.location.origin}/news/${news.slug || news.id}`);
                                        alert('បានចម្លងតំណរភ្ជាប់!');
                                    }
                                }}
                                className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                ចម្លងតំណរភ្ជាប់
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* News Modal */}
            <NewsModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                news={selectedNews}
                categories={categories}
                onSave={handleSaveNews}
            />
        </AdminLayout>
    );
};

export default NewsManagementDetails;