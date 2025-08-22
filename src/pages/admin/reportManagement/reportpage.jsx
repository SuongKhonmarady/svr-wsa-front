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
    
    // Filter states for year and month
    const currentDate = new Date();
    const [selectedYear, setSelectedYear] = useState('all'); // Default to 'all' years
    const [selectedMonth, setSelectedMonth] = useState('all'); // Default to 'all' months

    const loadReports = async (currentPage = 1, reportType = null) => {
        setLoading(true);
        setError('');
        
        // Use the provided reportType or fall back to the current filter state
        const activeFilter = reportType || filter;
        
        // Clear existing reports immediately to prevent showing wrong data during loading
        setReports([]);
        setPagination({});
        
        try {
            let result;
            // Fetch data based on the selected filter
            if (activeFilter === 'monthly') {
                let url = `/reports/staff/monthly/all?page=${currentPage}`;
                if (selectedYear !== 'all') url += `&year=${selectedYear}`;
                if (selectedMonth !== 'all') url += `&month=${selectedMonth}`;
                result = await apiService.get(url);
            } else if (activeFilter === 'yearly') {
                let url = `/reports/staff/yearly/all?page=${currentPage}`;
                if (selectedYear !== 'all') url += `&year=${selectedYear}`;
                result = await apiService.get(url);
            } else {
                // Default to monthly
                let url = `/reports/staff/monthly/all?page=${currentPage}`;
                if (selectedYear !== 'all') url += `&year=${selectedYear}`;
                if (selectedMonth !== 'all') url += `&month=${selectedMonth}`;
                result = await apiService.get(url);
            }
            
            if (result.error) {
                setError(result.error);
                setReports([]);
                setPagination({});
            } else {
                const responseData = result.data.data;
                if (responseData && responseData.data) {
                    // Add the 'type' property to each report object for the delete function
                    const reportsWithType = responseData.data.map(report => ({
                        ...report,
                        type: activeFilter,
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
        } catch (error) {
            setError('Failed to load reports. Please try again.');
            setReports([]);
            setPagination({});
        } finally {
            setLoading(false);
        }
    };

    // Handle location state messages separately
    useEffect(() => {
        if (location.state?.message) {
            setSuccess(location.state.message);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    // This useEffect hook will re-run whenever the filter, page, year, or month changes.
    useEffect(() => {
        loadReports(page, filter);
    }, [filter, page, selectedYear, selectedMonth]);

    // Effect to handle success message timeout
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess('');
            }, 3000);

            return () => clearTimeout(timer); // Cleanup timeout on component unmount or success change
        }
    }, [success]);


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
                    const newPage = page - 1;
                    setPage(newPage);
                    await loadReports(newPage, filter);
                } else {
                    await loadReports(page, filter);
                }

                // Clear success message after 3 seconds
                setTimeout(() => {
                    setSuccess('');
                }, 3000);
            }
        }
    };

    const handleStatusChange = async () => {
        setSuccess('Report status updated successfully!');
        await loadReports(page, filter);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
            setSuccess('');
        }, 3000);
    };
    
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pagination.last_page) {
            setPage(newPage);
        }
    };

    const handleFilterChange = async (e) => {
        const newFilter = e.target.value;
        
        // Clear success and error messages
        setSuccess('');
        setError('');
        
        // Update filter and reset page immediately
        setFilter(newFilter);
        setPage(1);
        
        // Reset year and month to 'all' when switching filters
        setSelectedYear('all');
        setSelectedMonth('all');
        
        // Load reports with the new filter immediately
        await loadReports(1, newFilter);
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold">Report Management</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Currently viewing: <span className="font-medium capitalize">{filter}</span> reports
                        {filter === 'monthly' 
                            ? selectedYear === 'all' && selectedMonth === 'all' 
                                ? ' (all periods)'
                                : selectedYear === 'all' 
                                    ? ` for ${new Date(0, selectedMonth - 1).toLocaleString('default', { month: 'long' })} (all years)`
                                    : selectedMonth === 'all'
                                        ? ` for ${selectedYear} (all months)`
                                        : ` for ${new Date(0, selectedMonth - 1).toLocaleString('default', { month: 'long' })} ${selectedYear}`
                            : selectedYear === 'all'
                                ? ' (all years)'
                                : ` for ${selectedYear}`
                        }
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <select 
                            value={filter} 
                            onChange={handleFilterChange} 
                            disabled={loading}
                            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="monthly">Monthly Reports</option>
                            <option value="yearly">Yearly Reports</option>
                        </select>
                        {loading && (
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                            </div>
                        )}
                    </div>
                    <Link to="/admin/reports/create" className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700">
                        Create Report
                    </Link>
                </div>
            </div>

            {success && (
                <div className="bg-green-100 text-green-800 p-4 rounded mb-4 flex justify-between items-center">
                    <span>{success}</span>
                    <button
                        onClick={() => setSuccess('')}
                        className="text-green-800 hover:text-green-600 focus:outline-none"
                    >
                        ✕
                    </button>
                </div>
            )}
            {error && <div className="bg-red-100 text-red-800 p-4 rounded mb-4">{error}</div>}

            {/* Date Filters */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">Filter by:</span>
                    
                    {/* Year Filter (for both monthly and yearly) */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Year:</label>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading}
                        >
                            <option value="all">All Years</option>
                            {Array.from({ length: 10 }, (_, i) => {
                                const year = new Date().getFullYear() - i;
                                return (
                                    <option key={year} value={year}>{year}</option>
                                );
                            })}
                        </select>
                    </div>

                    {/* Month Filter (only for monthly reports) */}
                    {filter === 'monthly' && (
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600">Month:</label>
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                disabled={loading}
                            >
                                <option value="all">All Months</option>
                                {Array.from({ length: 12 }, (_, i) => {
                                    const monthNumber = i + 1;
                                    const monthName = new Date(0, i).toLocaleString('default', { month: 'long' });
                                    return (
                                        <option key={monthNumber} value={monthNumber}>{monthName}</option>
                                    );
                                })}
                            </select>
                        </div>
                    )}

                    {/* Clear Filters Button */}
                    <button
                        onClick={() => {
                            setSelectedYear('all');
                            setSelectedMonth('all');
                            setPage(1);
                        }}
                        className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                        disabled={loading}
                    >
                        Show All
                    </button>
                </div>
            </div>

            <ReportsTable 
                key={`${filter}-${page}-${selectedYear}-${selectedMonth}`} 
                reports={reports} 
                onDelete={handleDelete} 
                onStatusChange={handleStatusChange}
                loading={loading} 
            />

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
