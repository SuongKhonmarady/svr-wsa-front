import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const NewsDetailsPage = () => {
    // 1. Get the 'id' from the URL parameters
    const { id } = useParams();

    // 2. State for holding the news data
    const [news, setNews] = useState(null);

    // 3. States for managing loading and error feedback
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper to format date nicely in Khmer locale
    const formatDate = (dateString) => {
        if (!dateString) return ''; // Handle cases where dateString might be null or undefined
        try {
            const date = new Date(dateString);
            // Options for Khmer locale (kh-KH)
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit', // Added seconds for more detail if needed
                hour12: true // Use 12-hour clock with AM/PM
            };
            // Use 'kh-KH' for Khmer locale
            return date.toLocaleDateString('kh-KH', options);
        } catch (e) {
            console.error("Error formatting date:", dateString, e);
            return dateString; // Return original string if formatting fails
        }
    };

    // 4. useEffect to fetch data when component mounts or 'id' changes
    useEffect(() => {
        const fetchNewsById = async () => {
            setLoading(true); // Start loading
            setError(null);   // Clear previous errors

            // Mock Data (matches your NewsList structure)
            const mockNewsData = {
                '1': {
                    title: "ការពង្រីកប្រព័ន្ធទឹកស្អាតក្នុងតំបន់ទីក្រុង",
                    image_url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    created_at: "2025-02-05T10:00:00Z", // Use ISO format for Date object parsing
                    content: `<p>រដ្ឋករទឹកស្វាយរៀងបានចាប់ផ្តើមគម្រោងពង្រីកប្រព័ន្ធផ្គត់ផ្គង់ទឹកស្អាតដើម្បីបម្រើសហគមន៍បន្ថែមទៀត។ គម្រោងនេះនឹងអាចផ្គត់ផ្គង់ទឹកស្អាតដល់គ្រួសារបន្ថែម ៥០០០ គ្រួសារទៀតក្នុងតំបន់ទីក្រុង និងជុំវិញ។</p>
                                  <ul>
                                    <li>ការដំឡើងបំពង់ថ្មីប្រវែង ១០ គីឡូម៉ែត្រ</li>
                                    <li>ការសាងសង់អាងស្តុកទឹកចំណុះ ២០០០ ម៉ែត្រគូប</li>
                                    <li>ការបណ្តុះបណ្តាលបុគ្គលិកក្នុងការថែទាំប្រព័ន្ធ</li>
                                  </ul>
                                  <p>គម្រោងនេះត្រូវបានគេរំពឹងថានឹងបញ្ចប់ក្នុងរយៈពេល ៦ ខែខាងមុខ ហើយនឹងរួមចំណែកយ៉ាងសំខាន់ក្នុងការលើកកម្ពស់សុខភាព និងអនាម័យសាធារណៈ។</p>`,
                    description: "រដ្ឋករទឹកស្វាយរៀងបានចាប់ផ្តើមគម្រោងពង្រីកប្រព័ន្ធផ្គត់ផ្គង់ទឹកស្អាតដើម្បីបម្រើសហគមន៍បន្ថែមទៀត។",
                    author: "លោក សុខ ស្រេីនុត"
                },
                '2': {
                    title: "បច្ចេកវិទ្យាថ្មីសម្រាប់ការចម្រាញ់ទឹក",
                    image_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    created_at: "2025-02-02T14:00:00Z",
                    content: `<p>រដ្ឋករទឹកកំពុងដំឡើងប្រព័ន្ធចម្រាញ់ទឹកទំនើបបំផុត ដើម្បីធានាគុណភាពទឹកកាន់តែប្រសើរសម្រាប់អ្នកប្រើប្រាស់ទាំងអស់។</p>
                                  <p>ប្រព័ន្ធថ្មីនេះប្រើប្រាស់បច្ចេកវិទ្យា nano-filtration ដែលអាចយកចេញនូវបាក់តេរី វីរុស និងសារធាតុគីមីដែលមានគ្រោះថ្នាក់បាន ៩៩.៩%។</p>`,
                    description: "ការដំឡើងប្រព័ន្ធចម្រាញ់ទឹកទំនើបដើម្បីធានាគុណភាពទឹកកាន់តែប្រសើរ",
                    author: "លោកស្រី ចាន់ សុភា"
                },
                '3': {
                    title: "កម្មវិធីអប់រំស្តីពីការប្រើប្រាស់ទឹកប្រកបដោយប្រសិទ្ធភាព",
                    image_url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    created_at: "2025-01-28T09:30:00Z",
                    content: `<p>ការបង្រៀនសហគមន៍អំពីការប្រើប្រាស់ទឹកប្រកបដោយប្រសិទ្ធភាព និងការអភិរក្ស។ កម្មវិធីនេះមានគោលបំណងលើកកម្ពស់ការយល់ដឹងរបស់សហគមន៍អំពីសារៈសំខាន់នៃទឹកស្អាត និងវិធីសាស្ត្រក្នុងការសន្សំសំចៃទឹកប្រចាំថ្ងៃ។</p>`,
                    description: "ការបង្រៀនសហគមន៍អំពីការប្រើប្រាស់ទឹកប្រកបដោយប្រសិទ្ធភាព និងការអភិរក្ស",
                    author: "លោក វុទ្ធី ចន្ទ្រា"
                }
            };

            // Simulate network delay
            setTimeout(() => {
                const foundNews = mockNewsData[id];
                if (foundNews) {
                    setNews(foundNews);
                } else {
                    setError("News item not found.");
                }
                setLoading(false);
            }, 700); // Simulate 700ms loading time
        };

        fetchNewsById();
    }, [id]); // Dependency array: re-run this effect if 'id' changes

    // 5. Conditional rendering based on loading, error, and data presence
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-lg text-gray-700 font-inter">កំពុងផ្ទុកព័ត៌មានលម្អិត...</p> {/* Loading text in Khmer */}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
                    <p className="text-xl text-red-600 font-bold mb-4 font-inter">មានបញ្ហាក្នុងការផ្ទុកព័ត៌មាន:</p> {/* Error text in Khmer */}
                    <p className="text-gray-700 mb-6 font-inter">{error}</p>
                    <Link
                        to="/news"
                        className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out shadow-md font-inter"
                    >
                        ← ត្រឡប់ទៅបញ្ជីព័ត៌មាន {/* Back to news list in Khmer */}
                    </Link>
                </div>
            </div>
        );
    }

    if (!news) {
        // This case should ideally be caught by the error if ID is not found,
        // but it's a good fallback.
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
                    <p className="text-xl text-gray-700 font-bold mb-4 font-inter">មិនមានព័ត៌មានលម្អិតសម្រាប់លេខសម្គាល់នេះទេ។</p> {/* Not found text in Khmer */}
                    <Link
                        to="/news"
                        className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out shadow-md font-inter"
                    >
                        ← ត្រឡប់ទៅបញ្ជីព័ត៌មាន {/* Back to news list in Khmer */}
                    </Link>
                </div>
            </div>
        );
    }

    // If news data is available, render the details
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-inter">
            <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-xl">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                    {news.title}
                </h1>
                {news.author && (
                    <p className="text-gray-600 text-sm sm:text-base mb-2">
                        <strong className="font-semibold">ដោយ:</strong> {news.author} {/* "By:" in Khmer */}
                    </p>
                )}
                {news.created_at && (
                    <p className="text-gray-500 text-xs sm:text-sm mb-6">
                        ផ្សាយនៅ: {formatDate(news.created_at)} {/* "Published:" in Khmer */}
                    </p>
                )}

                {news.image_url && (
                    <img
                        src={news.image_url}
                        alt={news.title}
                        className="w-full h-auto rounded-lg mb-8 shadow-md object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/800x450/E0E0E0/333333?text=Image+Not+Found`; }}
                    />
                )}

                {news.description && (
                    <p className="text-lg text-gray-700 italic mb-6 leading-relaxed">
                        {news.description}
                    </p>
                )}

                {news.content && (
                    // dangerouslySetInnerHTML is used to render HTML strings. Be careful with untrusted input!
                    <div
                        className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-4"
                        dangerouslySetInnerHTML={{ __html: news.content }}
                    />
                )}
                {!news.content && (
                    <p className="text-gray-600 text-center py-4">
                        មិនមានមាតិកាលម្អិតទេ។ {/* "No detailed content" in Khmer */}
                    </p>
                )}

                <div className="mt-10 text-center">
                    <Link
                        to="/news"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                    >
                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H16a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        ត្រឡប់ទៅបញ្ជីព័ត៌មាន {/* Back to news list in Khmer */}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NewsDetailsPage;
