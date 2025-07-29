import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import NewsDetail from './Components/newsDetail';

function NewsDetailsPage() {
    const { id } = useParams();
    const [news, setNews] = useState(null);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    useEffect(() => {
        const fetchNewsDetail = async () => {
            setLoading(true);
            try {

                setTimeout(() => {
                    if (mockNewsData[id]) {
                        setNews(mockNewsData[id]);
                        setError(null);
                    } else {
                        setNews(null);
                        setError("News item not found.");
                    }
                    setLoading(false);
                }, 500);

            } catch (err) {
                console.error("Failed to fetch news details:", err);
                setError("Failed to load news details. Please try again later.");
                setLoading(false);
            }
        };

        fetchNewsDetail();
    }, [id]);

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <NewsDetail news={news} formatDate={formatDate} />
        </div>
    );
}

export default NewsDetailsPage;