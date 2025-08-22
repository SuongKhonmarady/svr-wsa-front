import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import NewsDetail from './Components/newsDetail';
import newsService from '../../../services/newsService';

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
        return (
            <div className="max-w-3xl mx-auto py-32 px-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">កំពុងទាញយកព័ត៌មាន...</p>
                </div>
            </div>
        );
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