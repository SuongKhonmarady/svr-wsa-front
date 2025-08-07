import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../../services/api';
import AdminLayout from '../components/AdminLayout';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function ServiceRequestsManagement() {
    const navigate = useNavigate();
    const [serviceRequests, setServiceRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [statuses, setStatuses] = useState([]);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedMonth, setSelectedMonth] = useState('all');

    // Status color mapping
    const getStatusColor = (statusName) => {
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
    };

    // Fetch service requests and statuses
    useEffect(() => {
        fetchServiceRequests();
        fetchStatuses();
    }, []);

    // Filter requests based on status and month
    useEffect(() => {
        let filtered = serviceRequests;

        // Filter by status
        if (selectedStatus !== 'all') {
            filtered = filtered.filter(request => 
                request.status?.id?.toString() === selectedStatus
            );
        }

        // Filter by month
        if (selectedMonth !== 'all') {
            filtered = filtered.filter(request => {
                const requestDate = new Date(request.created_at);
                return requestDate.getMonth() + 1 === parseInt(selectedMonth);
            });
        }

        setFilteredRequests(filtered);
    }, [serviceRequests, selectedStatus, selectedMonth]);

    const fetchServiceRequests = async () => {
        try {
            setLoading(true);
            const response = await apiService.getAdminServiceRequests();
            console.log('Admin Service Requests Response:', response); // Debug log
            
            if (response.data && response.data.success) {
                console.log('Admin Service Requests Data:', response.data.data); // Debug log
                setServiceRequests(response.data.data || []);
            } else if (response.error) {
                setError(response.error);
            }
        } catch (err) {
            setError('Failed to fetch service requests');
            console.error('Error fetching service requests:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStatuses = async () => {
        try {
            const response = await apiService.get('/statuses');
            if (response.data) {
                setStatuses(response.data);
            }
        } catch (err) {
            console.error('Error fetching statuses:', err);
        }
    };

    const handleStatusUpdate = async (requestId, newStatusId) => {
        try {
            setUpdatingStatus(true);
            const response = await apiService.updateServiceRequestStatus(requestId, {
                status_id: newStatusId
            });
            
            if (response.data && response.data.success) {
                // Update the local state with the full updated service request
                setServiceRequests(prev => 
                    prev.map(request => 
                        request.id === requestId 
                            ? response.data.data // Use the full updated object from backend
                            : request
                    )
                );
                setShowModal(false);
                setSelectedRequest(null);
                
                // Show success message
                alert('Status updated successfully!');
            } else if (response.error) {
                alert('Error updating status: ' + response.error);
            }
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const openStatusModal = (request) => {
        setSelectedRequest(request);
        setShowModal(true);
    };

    const openDetailModal = (request) => {
        navigate(`/admin/service-requests/${request.id}`);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Export to Excel function
    const exportToExcel = async () => {
        try {
            setExportLoading(true);
            
            // Use existing service requests data
            const allRequests = (selectedStatus !== 'all' || selectedMonth !== 'all') ? filteredRequests : serviceRequests;

            // Prepare data for Excel export
            const excelData = allRequests.map((request, index) => ({
                'No.': index + 1,
                'Customer Name': request.name || '',
                'Email': request.email || '',
                'Phone': request.phone || '',
                'Address': request.address || '',
                'Service Type': request.service_type || '',
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
                { wch: 25 },  // Email
                { wch: 15 },  // Phone
                { wch: 30 },  // Address
                { wch: 20 },  // Service Type
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
            alert(`Successfully exported ${allRequests.length} service requests to Excel!`);
            
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            alert('Failed to export data. Please try again.');
        } finally {
            setExportLoading(false);
        }
    };

    return (
        <AdminLayout>
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Service Requests Management</h1>
                            <p className="mt-2 text-gray-600">Manage customer service requests and update their status</p>
                        </div>
                        {/* Export Button */}
                        <button
                            onClick={exportToExcel}
                            disabled={exportLoading || loading || serviceRequests.length === 0}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
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

                {/* Filters */}
                <div className="mb-6 p-4 bg-white rounded-lg shadow">
                    <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-sm font-medium text-gray-700">Filter by:</span>
                        
                        {/* Status Filter */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600">Status:</label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Statuses</option>
                                {statuses.map((status) => (
                                    <option key={status.id} value={status.id}>
                                        {status.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Month Filter */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600">Month:</label>
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Months</option>
                                {Array.from({ length: 12 }, (_, i) => {
                                    const monthNumber = i + 1;
                                    const monthName = new Date(0, i).toLocaleString('default', { month: 'long' });
                                    return (
                                        <option key={monthNumber} value={monthNumber}>
                                            {monthName}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        {/* Clear Filters Button */}
                        <button
                            onClick={() => {
                                setSelectedStatus('all');
                                setSelectedMonth('all');
                            }}
                            className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Clear All Filters
                        </button>

                        {/* Filter Results Info */}
                        {(selectedStatus !== 'all' || selectedMonth !== 'all') && (
                            <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
                                Showing {filteredRequests.length} of {serviceRequests.length} requests
                            </div>
                        )}
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}
                

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {['Pending', 'In Progress', 'Completed', 'Rejected'].map((status) => {
                        const displayRequests = (selectedStatus !== 'all' || selectedMonth !== 'all') ? filteredRequests : serviceRequests;
                        const count = displayRequests.filter(req => 
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

                {/* Service Requests Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">All Service Requests</h2>
                    </div>
                    
                {(() => {
                    const displayRequests = (selectedStatus !== 'all' || selectedMonth !== 'all') ? filteredRequests : serviceRequests;
                    return displayRequests.length === 0 ? (
                    loading ? (
                        <div className="mb-6">
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No service requests</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {(selectedStatus !== 'all' || selectedMonth !== 'all') 
                                    ? 'No service requests match the selected filters.' 
                                    : 'No service requests have been submitted yet.'
                                }
                            </p>
                        </div>
                    )
                ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {displayRequests.map((request) => (
                                        <tr key={request.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{request.name}</div>
                                                    {request.address && (
                                                        <div className="text-sm text-gray-500">{request.address}</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{request.service_type}</div>
                                                {request.details && (
                                                    <div className="text-sm text-gray-500 max-w-xs truncate">
                                                        {request.details}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {request.email && (
                                                        <div>{request.email}</div>
                                                    )}
                                                    {request.phone && (
                                                        <div>{request.phone}</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(request.status?.name)}`}>
                                                    {request.status?.name || 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(request.created_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => openDetailModal(request)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                >
                                                    View Details & Documents
                                                </button>
                                                <button
                                                    onClick={() => openStatusModal(request)}
                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                >
                                                    Update Status
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );
                })()}
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
                            
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2">Service Type: {selectedRequest.service_type}</p>
                                <p className="text-sm text-gray-600 mb-4">Current Status: {selectedRequest.status?.name || 'Pending'}</p>
                            </div>

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
                                            className={`w-full text-left px-3 py-2 rounded-md border text-sm font-medium transition-colors ${
                                                status.id === selectedRequest.status_id
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                                            }`}
                                        >
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border mr-2 ${getStatusColor(status.name)}`}>
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
        </div>
        </AdminLayout>
    );
    
}

export default ServiceRequestsManagement;
