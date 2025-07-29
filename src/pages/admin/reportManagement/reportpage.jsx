import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import apiService from '../../../services/api';
import ReportsTable from './Components/ReportsTable'; // Assuming this component exists

function ReportsManagement() {
    const location = useLocation();
    const [reports, setReports] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filter, setFilter] = useState('monthly'); // Default to 'monthly'
    const [page, setPage] = useState(1);

    const loadReports = async (currentPage = 1) => {
        setLoading(true);
        setError('');
        
        let result;
        // --- KEY CHANGE: Fetch data based on the selected filter ---
        if (filter === 'monthly') {
            result = await apiService.get(`/reports/monthly?page=${currentPage}`);
        } else if (filter === 'yearly') {
            result = await apiService.get(`/reports/yearly?page=${currentPage}`);
        } else {
            // Handle the 'all' case if you have a combined endpoint, otherwise default to monthly
            result = await apiService.get(`/reports/monthly?page=${currentPage}`);
        }
        
        if (result.error) {
            setError(result.error);
            setReports([]);
        } else {
            const responseData = result.data.data;
            if (responseData && responseData.data) {
                // Add the 'type' property to each report object for the delete function
                const reportsWithType = responseData.data.map(report => ({
                    ...report,
                    type: filter,
                }));
                setReports(reportsWithType);
                setPagination({
                    current_page: responseData.current_page,
                    last_page: responseData.last_page,
                    total: responseData.total,
                    from: responseData.from,
                    to: responseData.to,
                });
            } else {
                 setReports(result.data.data || []);
                 setPagination({});
            }
        }
        setLoading(false);
    };

    // This useEffect hook will re-run whenever the filter or page changes.
    useEffect(() => {
        if (location.state?.message) {
            setSuccess(location.state.message);
            window.history.replaceState({}, document.title);
        }
        loadReports(page);
    }, [location.state, filter, page]);


    const handleDelete = async (report) => {
        // Added a check for report.type to ensure it's defined
        if (window.confirm('Are you sure you want to delete this report?') && report.type) {
            const result = await (report.type === 'monthly'
                ? apiService.deleteMonthlyReport(report.id)
                : apiService.deleteYearlyReport(report.id));
            
            if (result.error) {
                setError(result.error);
            } else {
                setSuccess('Report deleted successfully!');
                // If the last item on a page is deleted, go to the previous page
                if (reports.length === 1 && page > 1) {
                    setPage(page - 1);
                } else {
                    loadReports(page);
                }
            }
        }
    };
    
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pagination.last_page) {
            setPage(newPage);
        }
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        setPage(1); // Reset to the first page when the filter changes
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Report Management</h1>
                <div className="flex items-center gap-4">
                    <select value={filter} onChange={handleFilterChange} className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                        {/* <option value="all">All</option> */}
                    </select>
                    <Link to="/admin/reports/create" className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700">
                        Create Report
                    </Link>
                </div>
            </div>

            {success && <div className="bg-green-100 text-green-800 p-4 rounded mb-4">{success}</div>}
            {error && <div className="bg-red-100 text-red-800 p-4 rounded mb-4">{error}</div>}

            <ReportsTable reports={reports} onDelete={handleDelete} loading={loading} />

            {/* Pagination Controls */}
            {!loading && pagination.last_page > 1 && (
                <div className="flex justify-between items-center mt-4">
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{pagination.from}</span> to <span className="font-medium">{pagination.to}</span> of <span className="font-medium">{pagination.total}</span> results
                    </p>
                    <div className="flex gap-2">
                        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">
                            Previous
                        </button>
                        <button onClick={() => handlePageChange(page + 1)} disabled={page === pagination.last_page} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">
                            Next
                        </button>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

export default ReportsManagement;
