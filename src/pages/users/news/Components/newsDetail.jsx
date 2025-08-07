import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const NewsDetail = ({ news, formatDate }) => {
    const [visibleSections, setVisibleSections] = useState({
        image: false,
        title: false,
        content: false,
        share: false
    });

    const imageRef = useRef(null);
    const titleRef = useRef(null);
    const contentRef = useRef(null);
    const shareRef = useRef(null);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
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

        if (imageRef.current) {
            imageRef.current.dataset.section = 'image';
            observer.observe(imageRef.current);
        }
        if (titleRef.current) {
            titleRef.current.dataset.section = 'title';
            observer.observe(titleRef.current);
        }
        if (contentRef.current) {
            contentRef.current.dataset.section = 'content';
            observer.observe(contentRef.current);
        }
        if (shareRef.current) {
            shareRef.current.dataset.section = 'share';
            observer.observe(shareRef.current);
        }

        return () => observer.disconnect();
    }, []);

    if (!news) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Back Button */}
            <div className="max-w-4xl mx-auto py-6 px-4">
                <Link 
                    to="/news" 
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200 mb-6"
                >
                    ← ត្រឡប់ទៅទំព័រព័ត៌មាន
                </Link>
            </div>

            {/* Main Content */}
            <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Featured Image */}
                {news.image && (
                    <div 
                        ref={imageRef}
                        className={`relative h-64 md:h-80 lg:h-96 transition-all duration-1000 ${
                            visibleSections.image ? 'opacity-100 transform scale-100 animate-fade-in-up' : 'opacity-0 transform scale-95'
                        }`}
                    >
                        <img
                            src={news.image}
                            alt={news.title}
                            className="w-full h-full object-cover"
                        />
                        {/* Category Badge */}
                        {news.category && (
                            <div className="absolute top-6 left-6">
                                <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium animate-bounce">
                                    {news.category.name}
                                </span>
                            </div>
                        )}
                        {/* Featured Badge */}
                        {news.featured && (
                            <div className="absolute top-6 right-6">
                                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                                    សំខាន់
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Article Content */}
                <div className="p-8 lg:p-12">
                    {/* Meta Information */}
                    <div 
                        ref={titleRef}
                        className={`transition-all duration-1000 ${
                            visibleSections.title ? 'opacity-100 transform translate-y-0 animate-slide-in-left' : 'opacity-0 transform translate-y-8'
                        }`}
                    >
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                            <time dateTime={news.published_at || news.created_at}>
                                📅 {formatDate(news.published_at || news.created_at)}
                            </time>
                            {news.category && (
                                <span className="flex items-center">
                                    🏷️ {news.category.name}
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight font-khmer-title">
                            {news.title}
                        </h1>
                    </div>

                    {/* Content */}
                    <div 
                        ref={contentRef}
                        className={`prose prose-lg max-w-none transition-all duration-1000 ${
                            visibleSections.content ? 'opacity-100 transform translate-y-0 animate-slide-in-right' : 'opacity-0 transform translate-y-8'
                        }`}
                    >
                        <div 
                            className="text-gray-700 leading-relaxed text-lg"
                            dangerouslySetInnerHTML={{ __html: news.content }}
                        />
                    </div>

                    {/* Share Section */}
                    <div 
                        ref={shareRef}
                        className={`mt-12 pt-8 border-t border-gray-200 transition-all duration-1000 ${
                            visibleSections.share ? 'opacity-100 transform translate-y-0 animate-slide-in-up' : 'opacity-0 transform translate-y-8'
                        }`}
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">ចែករំលែកព័ត៌មាននេះ</h3>
                        <div className="flex flex-wrap gap-4">
                            <button 
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: news.title,
                                            text: news.content.substring(0, 200),
                                            url: window.location.href
                                        });
                                    } else {
                                        navigator.clipboard.writeText(window.location.href);
                                        alert('បានចម្លងតំណរភ្ជាប់!');
                                    }
                                }}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                                📤 ចែករំលែក
                            </button>
                            <button 
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    alert('បានចម្លងតំណរភ្ជាប់!');
                                }}
                                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                            >
                                🔗 ចម្លងតំណ
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    {/* <div className="mt-12 pt-8 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <Link 
                                to="/news" 
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                            >
                                ← មើលព័ត៌មានផ្សេងទៀត
                            </Link>
                            
                            <button 
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
                            >
                                ⬆️ ទៅកំពូល
                            </button>
                        </div>
                    </div> */}
                </div>
            </article>

            {/* Related News Section (placeholder) */}
            <div className="max-w-4xl mx-auto py-12 px-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">ព័ត៌មានពាក់ព័ន្ធ</h2>
                <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-600">
                    នឹងបង្ហាញព័ត៌មានពាក់ព័ន្ធនៅទីនេះ
                </div>
            </div>
        </div>
    );
};

export default NewsDetail;

                                  
