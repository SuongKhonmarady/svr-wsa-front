import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const NewsDetail = ({ news, formatDate }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [visibleSections, setVisibleSections] = useState({
        header: false,
        image: false,
        content: false,
        share: false
    });

    const headerRef = useRef(null);
    const imageRef = useRef(null);
    const contentRef = useRef(null);
    const shareRef = useRef(null);

    // Function to get relative time (e.g., "2h ago", "1d ago")
    const getTimeAgo = () => {
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
            return 'ឥឡូវនេះ'; // Just now
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

    // Intersection Observer for animations
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const targetId = entry.target.dataset.section;
                    setVisibleSections(prev => ({
                        ...prev,
                        [targetId]: true
                    }));
                }
            });
        }, observerOptions);

        const refs = [headerRef, imageRef, contentRef, shareRef];
        const sections = ['header', 'image', 'content', 'share'];

        refs.forEach((ref, index) => {
            if (ref.current) {
                ref.current.dataset.section = sections[index];
                observer.observe(ref.current);
            }
        });

        return () => observer.disconnect();
    }, [news]);

    // Initial load animation
    useEffect(() => {
        if (news) {
            setTimeout(() => {
                setIsLoaded(true);
                setVisibleSections(prev => ({ ...prev, header: true }));
            }, 100);
        }
    }, [news]);

    if (!news) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Animated Header */}
            <div 
                ref={headerRef}
                className={`bg-white border-b border-gray-200 transition-all duration-1000 ${
                    visibleSections.header ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                }`}
            >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Back Button */}
                    <div className={`mb-6 transition-all duration-700 delay-200 ${
                        isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}>
                        <Link 
                            to="/news" 
                            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:scale-105 transform"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            ត្រឡប់ទៅព័ត៌មាន
                        </Link>
                    </div>

                    {/* Meta Information */}
                    <div className={`flex flex-wrap items-center gap-4 mb-4 transition-all duration-800 delay-400 ${
                        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                        {news.category && (
                            <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium transform hover:scale-105 transition-transform duration-200">
                                {news.category.name}
                            </span>
                        )}
                        {news.featured && (
                            <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium transform hover:scale-105 transition-transform duration-200">
                                ⭐ សំខាន់
                            </span>
                        )}
                        <time className="text-gray-500 text-sm">
                            {formatDate(news.published_at || news.created_at)}
                        </time>
                    </div>

                    {/* Title */}
                    <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight font-khmer-title transition-all duration-1000 delay-600 ${
                        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}>
                        {news.title}
                    </h2>
                </div>
            </div>

            {/* Animated Featured Image */}
            {news.image && (
                <div 
                    ref={imageRef}
                    className={`bg-white transition-all duration-1000 delay-300 ${
                        visibleSections.image ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                >
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="overflow-hidden rounded-lg">
                            <img
                                src={news.image}
                                alt={news.title}
                                className={`w-full h-64 sm:h-80 lg:h-96 object-cover transition-all duration-700 hover:scale-105 ${
                                    visibleSections.image ? 'scale-100' : 'scale-110'
                                }`}
                                style={{ 
                                    filter: visibleSections.image ? 'blur(0px)' : 'blur(4px)',
                                    transition: 'all 0.8s ease-out'
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Animated Main Article Content */}
            <article 
                ref={contentRef}
                className={`bg-white transition-all duration-1000 delay-500 ${
                    visibleSections.content ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Reading Time */}
                    <div className={`flex items-center text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200 transition-all duration-800 delay-700 ${
                        visibleSections.content ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}>
                        <span className="flex items-center mr-6 hover:text-blue-600 transition-colors duration-200">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {getTimeAgo()}
                        </span>
                    </div>

                    {/* Article Content */}
                    <div 
                        className={`prose prose-lg max-w-none transition-all duration-1000 delay-900 ${
                            visibleSections.content ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                        }`}
                        style={{
                            fontSize: '1.125rem',
                            lineHeight: '1.7',
                            color: '#374151'
                        }}
                    >
                        <div 
                            dangerouslySetInnerHTML={{ __html: news.content }}
                            className="article-content"
                        />
                    </div>

                    {/* Animated Share Section */}
                    <div 
                        ref={shareRef}
                        className={`mt-8 pt-6 border-t border-gray-200 transition-all duration-1000 delay-1100 ${
                            visibleSections.share ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                        }`}
                    >
                        <h3 className={`text-lg font-semibold text-gray-900 mb-4 transition-all duration-800 delay-1200 ${
                            visibleSections.share ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                        }`}>
                            ចែករំលែកព័ត៌មាននេះ
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            <button 
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: news.title,
                                            text: news.content?.substring(0, 200) || '',
                                            url: window.location.href
                                        });
                                    } else {
                                        navigator.clipboard.writeText(window.location.href);
                                        alert('បានចម្លងតំណរភ្ជាប់!');
                                    }
                                }}
                                className={`flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg transform ${
                                    visibleSections.share 
                                        ? 'opacity-100 translate-y-0 delay-1300' 
                                        : 'opacity-0 translate-y-4'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                </svg>
                                ចែករំលែក
                            </button>
                            <button 
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    alert('បានចម្លងតំណរភ្ជាប់!');
                                }}
                                className={`flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-lg transform ${
                                    visibleSections.share 
                                        ? 'opacity-100 translate-y-0 delay-1400' 
                                        : 'opacity-0 translate-y-4'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                ចម្លងតំណ
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    {/* <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link 
                                to="/news" 
                                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                មើលព័ត៌មានផ្សេងទៀត
                            </Link>
                            
                            <button 
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                </svg>
                                ទៅកំពូល
                            </button>
                        </div>
                    </div> */}
                </div>
            </article>
        </div>

    );
};

export default NewsDetail;
