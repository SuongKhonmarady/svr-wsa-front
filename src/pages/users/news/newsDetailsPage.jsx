import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import NewsDetail from './Components/newsDetail';
import newsService from '../../../services/newsService';

// Loading Skeleton Component
const NewsDetailSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Skeleton */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Back Button Skeleton */}
                    <div className="mb-6">
                        <div className="h-6 bg-gray-200 rounded w-32 animate-skeleton-shimmer"></div>
                    </div>

                    {/* Meta Information Skeleton */}
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="h-6 bg-gray-200 rounded-full w-20 animate-skeleton-shimmer"></div>
                        <div className="h-6 bg-gray-200 rounded-full w-16 animate-skeleton-shimmer"></div>
                        <div className="h-6 bg-gray-200 rounded w-24 animate-skeleton-shimmer"></div>
                    </div>

                    {/* Title Skeleton */}
                    <div className="space-y-3">
                        <div className="h-8 bg-gray-200 rounded w-3/4 animate-skeleton-shimmer"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/2 animate-skeleton-shimmer"></div>
                        <div className="h-8 bg-gray-200 rounded w-2/3 animate-skeleton-shimmer"></div>
                    </div>
                </div>
            </div>

            {/* Featured Image Skeleton */}
            <div className="bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="overflow-hidden rounded-lg">
                        <div className="w-full h-64 sm:h-80 lg:h-96 bg-gray-200 animate-skeleton-shimmer"></div>
                    </div>
                </div>
            </div>

            {/* Content Skeleton */}
            <article className="bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Reading Time Skeleton */}
                    <div className="flex items-center text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
                        <div className="h-4 bg-gray-200 rounded w-24 animate-skeleton-shimmer"></div>
                    </div>

                    {/* Article Content Skeleton */}
                    <div className="space-y-4">
                        {/* Paragraph 1 */}
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-full animate-skeleton-shimmer"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6 animate-skeleton-shimmer"></div>
                            <div className="h-4 bg-gray-200 rounded w-4/5 animate-skeleton-shimmer"></div>
                        </div>

                        {/* Paragraph 2 */}
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-full animate-skeleton-shimmer"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 animate-skeleton-shimmer"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6 animate-skeleton-shimmer"></div>
                        </div>

                        {/* Paragraph 3 */}
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-full animate-skeleton-shimmer"></div>
                            <div className="h-4 bg-gray-200 rounded w-4/5 animate-skeleton-shimmer"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3 animate-skeleton-shimmer"></div>
                        </div>

                        {/* Paragraph 4 */}
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-full animate-skeleton-shimmer"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6 animate-skeleton-shimmer"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 animate-skeleton-shimmer"></div>
                        </div>

                        {/* Paragraph 5 */}
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-full animate-skeleton-shimmer"></div>
                            <div className="h-4 bg-gray-200 rounded w-4/5 animate-skeleton-shimmer"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 animate-skeleton-shimmer"></div>
                        </div>
                    </div>

                    {/* Share Section Skeleton */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-skeleton-shimmer"></div>
                        <div className="flex flex-wrap gap-3">
                            <div className="h-10 bg-gray-200 rounded-lg w-32 animate-skeleton-shimmer"></div>
                            <div className="h-10 bg-gray-200 rounded-lg w-28 animate-skeleton-shimmer"></div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
};

function NewsDetailsPage() {
    const { slug } = useParams(); // Changed from id to slug
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('km-KH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    useEffect(() => {
        const fetchNewsDetail = async () => {
            setLoading(true);
            setError(null);
            
            try {
                let result;
                
                // Check if slug is numeric (likely an ID)
                if (/^\d+$/.test(slug)) {
                    // Use getNewsById for numeric values
                    result = await newsService.getNewsById(slug);
                } else {
                    // Use getNewsBySlug for non-numeric values
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

        if (slug) {
            fetchNewsDetail();
        }
    }, [slug]);

    if (loading) {
        return <NewsDetailSkeleton />;
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto py-16 px-4">
                <div className="text-center">
                    <div className="text-red-600 text-6xl mb-4">❌</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">មានបញ្ហា!</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link 
                        to="/news"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        ត្រឡប់ទៅព័ត៌មាន
                    </Link>
                </div>
            </div>
        );
    }

    if (!news) {
        return (
            <div className="max-w-3xl mx-auto py-16 px-4">
                <div className="text-center">
                    <div className="text-gray-400 text-6xl mb-4">📰</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">រកមិនឃើញព័ត៌មាន</h1>
                    <p className="text-gray-600 mb-6">ព័ត៌មានដែលអ្នកកំពុងស្វែងរក មិនមានទេ។</p>
                    <Link 
                        to="/news"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        ត្រឡប់ទៅព័ត៌មាន
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <NewsDetail news={news} formatDate={formatDate} />
        </div>
    );
}

export default NewsDetailsPage;