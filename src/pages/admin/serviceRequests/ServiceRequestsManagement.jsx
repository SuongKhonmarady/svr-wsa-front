import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../../services/api';
import AdminLayout from '../components/AdminLayout';
import ServiceRequestsList from './components/ServiceRequestsList';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useToast } from '../../../components/ToastContainer';

function ServiceRequestsManagement() {
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();
    const [serviceRequests, setServiceRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingRequest, setDeletingRequest] = useState(false);
    const [statuses, setStatuses] = useState([]);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [dataFetched, setDataFetched] = useState(false); // Flag to prevent multiple fetches

    // Search functionality state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('name'); // 'name' or 'phone'
    const [isSearching, setIsSearching] = useState(false);

    // Simple state for all requests
    const [totalRequests, setTotalRequests] = useState(0);

    // Status color mapping
    const getStatusColor = useCallback((statusName) => {
        switch (statusName?.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'in progress':
            case 'in-progress':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    }, []);

    // Fetch both statuses and service requests simultaneously
    const fetchAllData = useCallback(async () => {
        // Prevent multiple fetches
        if (dataFetched || loading) {
            return;
        }

        try {
            setLoading(true);   
            setError('');

            // Fetch both APIs simultaneously
            const [statusesResponse, serviceRequestsResponse] = await Promise.all([
                apiService.get('/statuses'),
                apiService.getAdminServiceRequests()
            ]);

            // Handle statuses response
            if (statusesResponse.data) {
                setStatuses(statusesResponse.data);
            }

            // Handle service requests response
            if (serviceRequestsResponse.data && serviceRequestsResponse.data.success) {
                const requests = serviceRequestsResponse.data.data || [];

                // Ensure requests is always an array
                if (Array.isArray(requests)) {
                    // Sort requests by creation date (most recent first)
                    const sortedRequests = requests.sort((a, b) => {
                        const dateA = new Date(a.created_at);
                        const dateB = new Date(b.created_at);
                        return dateB - dateA; // Most recent first
                    });
                    setServiceRequests(sortedRequests);
                    setTotalRequests(serviceRequestsResponse.data.total || requests.length);
                } else {
                    // If it's a single object, wrap it in an array
                    setServiceRequests([requests]);
                    setTotalRequests(1);
                }
            } else if (serviceRequestsResponse.error) {
                setError(serviceRequestsResponse.error);
            } else {
                setError('Unexpected response format from server');
            }

            // Mark data as fetched to prevent future fetches
            setDataFetched(true);
        } catch (err) {
            setError('Failed to fetch data: ' + (err.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    }, [dataFetched, loading]); // Include dataFetched to prevent multiple calls

    // Fetch service requests with status filter and search (for filtering only)
    const fetchServiceRequests = useCallback(async (statusFilter = null, searchTerm = null, searchTypeParam = null) => {
        // Prevent multiple simultaneous calls
        if (loading) {
            return;
        }

        try {
            setLoading(true);
            setError('');

            // Build query parameters for filtering (no pagination)
            const queryParams = new URLSearchParams();

            // Use the passed statusFilter or fall back to current selectedStatus
            const currentStatus = statusFilter !== null ? statusFilter : selectedStatus;

            if (currentStatus !== 'all') {
                // Get the status name from the selected status ID
                const selectedStatusObj = statuses.find(s => s.id == currentStatus);
                if (selectedStatusObj) {
                    queryParams.append('status', selectedStatusObj.name);
                }
            }

            // Add search parameters if provided
            const currentSearchTerm = searchTerm !== null ? searchTerm : searchQuery;
            const currentSearchType = searchTypeParam !== null ? searchTypeParam : searchType;
            
            if (currentSearchTerm && currentSearchTerm.trim() !== '') {
                queryParams.append(currentSearchType, currentSearchTerm.trim());
            }

            const response = await apiService.getAdminServiceRequests(queryParams);

            if (response.data && response.data.success) {
                const requests = response.data.data || [];

                // Ensure requests is always an array
                if (Array.isArray(requests)) {
                    // Sort requests by creation date (most recent first)
                    const sortedRequests = requests.sort((a, b) => {
                        const dateA = new Date(a.created_at);
                        const dateB = new Date(b.created_at);
                        return dateB - dateA; // Most recent first
                    });
                    setServiceRequests(sortedRequests);
                    setTotalRequests(response.data.total || requests.length);
                } else {
                    // If it's a single object, wrap it in an array
                    setServiceRequests([requests]);
                    setTotalRequests(1);
                }
            } else if (response.error) {
                setError(response.error);
            } else {
                setError('Unexpected response format from server');
            }
        } catch (err) {
            setError('Failed to fetch service requests: ' + (err.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    }, [statuses, selectedStatus, loading, searchQuery, searchType]);

    // Initial data fetch - only run once on mount
    useEffect(() => {
        fetchAllData();
    }, []); // Only run once on mount

    // Manual refresh function (for user-triggered refreshes)
    const refreshData = useCallback(() => {
        setDataFetched(false); // Reset flag to allow fetching
        fetchAllData();
    }, [fetchAllData]);

    // Filter effect - only run when filters change
    useEffect(() => {
        // Only refetch if we have statuses loaded and selectedStatus is not 'all'
        if (statuses.length > 0 && selectedStatus !== 'all') {
            fetchServiceRequests(selectedStatus);
        }
    }, [selectedStatus, statuses.length]); // fetchServiceRequests is stable now

    const handleStatusUpdate = useCallback(async (requestId, newStatusId) => {
        try {
            setUpdatingStatus(true);
            const response = await apiService.updateServiceRequestStatus(requestId, {
                status_id: newStatusId
            });

            if (response.data && response.data.success) {
                // Update the local state with the full updated service request
                setServiceRequests(prev => {
                    const updatedRequests = prev.map(request =>
                        request.id === requestId
                            ? response.data.data // Use the full updated object from backend
                            : request
                    );

                    // Re-sort to maintain most recent first order
                    return updatedRequests.sort((a, b) => {
                        const dateA = new Date(a.created_at);
                        const dateB = new Date(b.created_at);
                        return dateB - dateA; // Most recent first
                    });
                });
                setShowModal(false);
                setSelectedRequest(null);

                // Show success message
                showSuccess('Status updated successfully!');
            } else if (response.error) {
                showError('Error updating status: ' + response.error);
            }
        } catch (err) {
            showError('Failed to update status');
        } finally {
            setUpdatingStatus(false);
        }
    }, []);

    const openStatusModal = useCallback((request) => {
        setSelectedRequest(request);
        setShowModal(true);
    }, []);

    const openDetailModal = useCallback((request) => {
        navigate(`/admin/service-requests/${request.id}`);
    }, [navigate]);

    const openDeleteModal = useCallback((request) => {
        setSelectedRequest(request);
        setShowDeleteModal(true);
    }, []);

    const handleDeleteRequest = useCallback(async () => {
        if (!selectedRequest) return;

        try {
            setDeletingRequest(true);
            const response = await apiService.delete(`/admin/service-requests/${selectedRequest.id}`);

            if (response.data && response.data.success) {
                // Remove the deleted request from local state
                setServiceRequests(prev => {
                    const filteredRequests = prev.filter(request => request.id !== selectedRequest.id);

                    // Re-sort to maintain most recent first order
                    return filteredRequests.sort((a, b) => {
                        const dateA = new Date(a.created_at);
                        const dateB = new Date(b.created_at);
                        return dateB - dateA; // Most recent first
                    });
                });
                setShowDeleteModal(false);
                setSelectedRequest(null);

                // Show success message
                showSuccess('Service request deleted successfully!');
            } else if (response.error) {
                showError('Error deleting service request: ' + response.error);
            }
        } catch (err) {
            showError('Failed to delete service request');
        } finally {
            setDeletingRequest(false);
        }
    }, [selectedRequest]);

    const formatDate = useCallback((dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }, []);

    // Search functionality handlers
    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            // If search is empty, fetch all requests
            fetchServiceRequests();
            return;
        }

        setIsSearching(true);
        try {
            await fetchServiceRequests(null, searchQuery, searchType);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchTypeChange = (e) => {
        setSearchType(e.target.value);
    };

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Export to Excel function
    const exportToExcel = useCallback(async () => {
        try {
            setExportLoading(true);

            // Use current service requests data
            const allRequests = serviceRequests;

            // Prepare data for Excel export
            const excelData = allRequests.map((request, index) => ({
                'No.': index + 1,
                'ឈ្មោះអតិថិជន': request.name || '',
                'លេខទូរសព្ទ': request.phone || '',
                'ប្រភេទសេវាកម្ម': request.service_type || '',
                'ចំនួនសមាជិកគ្រួសារ': request.family_members || '',
                'ស្រីចំនួន': request.female_members || '',
                'ភូមិ': request.village || '',
                'ខេត្ត': request.province?.name || '',
                'ស្រុក': request.district?.name || '',
                'ឃុំ/សង្កាត់': request.commune?.name || '',
                'មុខរបរ': request.occupation?.name || '',
                'ប្រភេទនៃការប្រើប្រាស់': request.usage_type?.name || '',
                'Details': request.details || '',
                'Status': request.status?.name || 'Pending',
                'Created Date': formatDate(request.created_at),
                'Updated Date': request.updated_at ? formatDate(request.updated_at) : '',
            }));

            // Create workbook and worksheet
            const ws = XLSX.utils.json_to_sheet(excelData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Service Requests');

            // Auto-size columns
            const cols = [
                { wch: 5 },   // No.
                { wch: 20 },  // Customer Name
                { wch: 15 },  // Phone
                { wch: 25 },  // Email
                { wch: 20 },  // Service Type
                { wch: 15 },  // Family Members
                { wch: 15 },  // Female Members
                { wch: 20 },  // Village
                { wch: 20 },  // Province
                { wch: 20 },  // District
                { wch: 20 },  // Commune
                { wch: 20 },  // Occupation
                { wch: 20 },  // Usage Type
                { wch: 40 },  // Details
                { wch: 15 },  // Status
                { wch: 20 },  // Created Date
                { wch: 20 },  // Updated Date
            ];
            ws['!cols'] = cols;

            // Generate Excel file
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            // Generate filename with current date
            const currentDate = new Date().toISOString().split('T')[0];
            const filename = `service_requests_${currentDate}.xlsx`;

            // Save file
            saveAs(data, filename);

            // Show success message
            showSuccess(`Successfully exported ${allRequests.length} service requests to Excel!`);

        } catch (error) {
            showError('Failed to export data. Please try again.');
        } finally {
            setExportLoading(false);
        }
    }, [serviceRequests, formatDate]);



    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                            <div>
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Service Requests Management</h1>
                                <p className="mt-2 text-gray-600 text-sm sm:text-base">Manage customer service requests and update their status</p>
                            </div>
                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* Refresh Button */}
                                <button
                                    onClick={refreshData}
                                    disabled={loading}
                                    className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Refreshing...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Refresh
                                        </>
                                    )}
                                </button>

                                {/* Export Button */}
                                <button
                                    onClick={exportToExcel}
                                    disabled={exportLoading || loading || serviceRequests.length === 0}
                                    className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {exportLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Exporting...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Export to Excel
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mb-6 p-4 bg-white rounded-lg shadow">
                        {loading ? (
                            <div className="animate-pulse">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                                        <div className="h-8 bg-gray-200 rounded w-32"></div>
                                    </div>
                                    <div className="h-8 bg-gray-200 rounded w-28"></div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-gray-700">Filter by:</h3>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Status Filter with Clear Button */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm text-gray-600 font-medium">Status:</label>
                                        <div className="flex gap-2">
                                            <select
                                                value={selectedStatus}
                                                onChange={(e) => setSelectedStatus(e.target.value)}
                                                className="flex-1 p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            >
                                                <option value="all">All Statuses</option>
                                                {statuses.map((status) => (
                                                    <option key={status.id} value={status.id}>
                                                        {status.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={() => {
                                                    setSelectedStatus('all');
                                                    setSearchQuery('');
                                                    setSearchType('name');
                                                    // Refetch data
                                                    fetchServiceRequests('all');
                                                }}
                                                className="px-3 py-2.5 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium whitespace-nowrap"
                                                title="Clear All Filters"
                                            >
                                                <i className="fas fa-times"></i>
                                                <span className="hidden sm:inline ml-2">Clear</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Search Filter */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm text-gray-600 font-medium">Search:</label>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            {/* Search Type Selector */}
                                            <div className="w-full sm:w-auto">
                                                <select
                                                    value={searchType}
                                                    onChange={handleSearchTypeChange}
                                                    className="w-full sm:w-32 p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                >
                                                    <option value="name">Name</option>
                                                    <option value="phone">Phone</option>
                                                </select>
                                            </div>
                                            
                                            {/* Search Input */}
                                            <div className="relative flex-1 sm:min-w-64">
                                                <input
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={handleSearchInputChange}
                                                    onKeyPress={handleSearchKeyPress}
                                                    placeholder={`Search by ${searchType}...`}
                                                    className="w-full pl-4 pr-20 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                />
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-1">
                                                    <button
                                                        onClick={handleSearch}
                                                        disabled={isSearching}
                                                        className="p-1.5 ml-1 text-blue-600 hover:text-blue-800 disabled:text-gray-400 rounded-full hover:bg-blue-50"
                                                        title="Search"
                                                    >
                                                        {isSearching ? (
                                                            <i className="fas fa-spinner fa-spin text-xs"></i>
                                                        ) : (
                                                            <i className="fas fa-search text-xs"></i>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Results Info */}
                                <div className="text-sm text-blue-600 px-3 py-2 rounded-md text-end">
                                    <i className="fas fa-info-circle mr-1"></i>
                                    Showing {serviceRequests.length} results
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}




                    {/* Statistics Cards */}
                    {loading ? (
                        // Loading skeleton for statistics cards
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-white rounded-lg shadow p-6">
                                    <div className="animate-pulse">
                                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Actual statistics cards when data is loaded
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            {['Pending', 'In Progress', 'Completed', 'Rejected'].map((status) => {
                                const count = serviceRequests.filter(req =>
                                    req.status?.name?.toLowerCase() === status.toLowerCase() ||
                                    req.status?.name?.toLowerCase() === status.toLowerCase().replace(' ', '-')
                                ).length;

                                return (
                                    <div key={status} className="bg-white rounded-lg shadow p-6">
                                        <div className="flex items-center">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-600">{status}</p>
                                                <p className="text-2xl font-bold text-gray-900">{count}</p>
                                            </div>
                                            <div className={`w-3 h-3 rounded-full ${getStatusColor(status).split(' ')[0]}`}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Error Display */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">Error Loading Service Requests</h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>{error}</p>
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            onClick={() => fetchServiceRequests(selectedStatus)}
                                            className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Service Requests Table */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        

                        <ServiceRequestsList
                            serviceRequests={serviceRequests}
                            loading={loading}
                            getStatusColor={getStatusColor}
                            formatDate={formatDate}
                            openDetailModal={openDetailModal}
                            openStatusModal={openStatusModal}
                            openDeleteModal={openDeleteModal}
                        />
                    </div>
                </div>

                {/* Status Update Modal */}
                {showModal && selectedRequest && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                            <div className="mt-3">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Update Status for {selectedRequest.name}
                                </h3>


                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select New Status:
                                    </label>
                                    <div className="space-y-2">
                                        {statuses.map((status) => (
                                            <button
                                                key={status.id}
                                                onClick={() => handleStatusUpdate(selectedRequest.id, status.id)}
                                                disabled={updatingStatus || status.id === selectedRequest.status_id}
                                                className={`w-full text-left px-3 py-2 rounded-md border text-sm font-medium transition-colors ${status.id === selectedRequest.status_id
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                                                    }`}
                                            >
                                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border mr-2 ${getStatusColor(status.name)}`}>
                                                    {status.name}
                                                </span>
                                                {status.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => {
                                            setShowModal(false);
                                            setSelectedRequest(null);
                                        }}
                                        disabled={updatingStatus}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && selectedRequest && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                            <div className="mt-3">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                    <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>

                                <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">
                                    Delete Service Request
                                </h3>

                                <div className="text-center mb-6">
                                    <p className="text-sm text-gray-600 mb-2">
                                        Are you sure you want to delete this service request?
                                    </p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {selectedRequest.name} - Request #{selectedRequest.id}
                                    </p>
                                    <p className="text-xs text-red-600 mt-1">
                                        This action cannot be undone.
                                    </p>
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => {
                                            setShowDeleteModal(false);
                                            setSelectedRequest(null);
                                        }}
                                        disabled={deletingRequest}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeleteRequest}
                                        disabled={deletingRequest}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {deletingRequest ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Deleting...
                                            </>
                                        ) : (
                                            'Delete Request'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );

}

export default ServiceRequestsManagement;
