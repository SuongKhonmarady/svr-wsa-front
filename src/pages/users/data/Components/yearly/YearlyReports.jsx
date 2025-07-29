import { useEffect, useState } from 'react';
import apiService from '../../../../../services/api';

const YearlyReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [sortBy, setSortBy] = useState('year-desc');
    const [page, setPage] = useState(1);  // <-- add this
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 }); // <-- add this if needed

    useEffect(() => {
        fetchReports();
    }, [page]);

    const fetchReports = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await apiService.getYearlyReports(page);

            const reportList = res.data?.data?.data;

            if (Array.isArray(reportList)) {
                const raw = reportList.map((r) => ({
                    id: r.id,
                    title: r.title || 'របាយការណ៍ប្រចាំឆ្នាំ',
                    description: r.description || 'គ្មានពិពណ៌នាសម្រាប់របាយការណ៍នេះ',
                    year: r.year?.year_value ?? 'N/A',
                    reportUrl: r.file_url,
                    isAvailable: r.status === 'published',
                    publishedDate: new Date(r.published_at || r.created_at),
                    totalWaterProduction: 0,
                    averageCustomerCount: 0,
                    totalRevenue: 0,
                    waterQualityScore: 0,
                    highlights: [],
                }));

                setReports(raw);
                setPagination({
                    currentPage: res.data.data.current_page,
                    totalPages: res.data.data.last_page,
                });
            } else {
                console.error('Expected array, got:', reportList);
                setError('ទិន្នន័យមិនត្រឹមត្រូវទេ។');
            }
        } catch (err) {
            console.error(err);
            setError('បញ្ហាក្នុងការទាញយកទិន្នន័យ។');
        }
        setLoading(false);
    };

    const handleDownload = (url) => {
        const link = document.createElement('a');
        link.href = url;
        // Extract filename from URL or provide a default
        const filename = url.split('/').pop().split('?')[0] || 'report.pdf';
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const sorted = [...reports].sort((a, b) => {
        switch (sortBy) {
            case 'year-asc': return a.year - b.year;
            case 'year-desc': return b.year - a.year;
            case 'revenue': return b.totalRevenue - a.totalRevenue;
            case 'customers': return b.averageCustomerCount - a.averageCustomerCount;
            default: return b.year - a.year;
        }
    });

    return (
        <div className="bg-gray-50 py-26 px-4 sm:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
                        របាយការណ៍ប្រចាំឆ្នាំ
                    </h1>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-gray-300 rounded px-4 py-2 focus:outline-none"
                    >
                        <option value="year-desc">ឆ្នាំថ្មីបំផុត</option>
                        <option value="year-asc">ឆ្នាំចាស់បំផុត</option>
                        <option value="revenue">ចំណូលខ្ពស់បំផុត</option>
                        <option value="customers">អតិថិជនច្រើនបំផុត</option>
                    </select>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-26">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                        <p className="ml-4 text-gray-600">កំពុងផ្ទុកទិន្នន័យ...</p>
                    </div>
                )}

                {error && (
                    <div className="text-center text-red-600 font-medium py-26">{error}</div>
                )}

                {!loading && !error && sorted.length === 0 && (
                    <div className="text-center text-gray-500 py-26">គ្មានរបាយការណ៍ទេ។</div>
                )}

                {!loading && !error && sorted.length > 0 && (
                    <div className="space-y-8">
                        {sorted.map((r) => (
                            <div key={r.id} className="bg-white rounded-xl shadow p-6 md:flex">
                                <div className="md:w-1/4 flex flex-col justify-center items-center bg-green-100 rounded-lg p-4 mb-4 md:mb-0">
                                    <div className="text-3xl font-bold text-green-700">{r.year}</div>
                                    <div className="text-sm text-gray-600">
                                        {r.isAvailable ? 'មាន' : 'មិនទាន់មាន'}
                                    </div>
                                </div>
                                <div className="md:w-3/4 md:pl-6">
                                    {r.isAvailable ? (
                                        <>
                                            <div>
                                                {/* Use r.title here */}
                                                <h2 className="text-lg font-semibold text-gray-800 mb-2">{r.title}</h2>
                                                <p className="text-gray-600 mb-4">{r.description || 'គ្មានពិពណ៌នាសម្រាប់របាយការណ៍នេះ'}</p>

                                                <div className="flex justify-between items-center">
                                                    <div className="text-sm text-gray-500">
                                                        បោះពុម្ព: {r.publishedDate.toLocaleDateString('km-KH')}
                                                    </div>
                                                    <button
                                                        onClick={() => r.reportUrl && handleDownload(r.reportUrl)}
                                                        disabled={!r.reportUrl}
                                                        className={`bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:bg-gray-400`}
                                                    >
                                                        ទាញយក
                                                    </button>
                                                </div>

                                                {!r.reportUrl && (
                                                    <div className="text-center text-gray-500 mt-4 text-sm">
                                                        របាយការណ៍នេះមិនទាន់បានបញ្ចូលឯកសារនៅឡើយទេ។
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center text-gray-500 text-sm py-4">
                                            របាយការណ៍កំពុងរៀបចំ...
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                )}
            </div>
        </div>
    );
};

export default YearlyReports;
