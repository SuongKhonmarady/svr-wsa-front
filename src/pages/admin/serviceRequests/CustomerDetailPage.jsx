import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../../../services/api';
import config from '../../../config/api';
import AdminLayout from '../components/AdminLayout';
import ImageModal from './components/ImageModal';

function CustomerDetailPage() {
    const { requestId } = useParams();
    const navigate = useNavigate();
    const [customerDetail, setCustomerDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);

    useEffect(() => {
        if (requestId) {
            fetchCustomerDetail();
        }
    }, [requestId]);

    const fetchCustomerDetail = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await apiService.getAdminServiceRequestById(requestId);
            
            if (response.data && response.data.success) {
                setCustomerDetail(response.data.data);
            } else if (response.error) {
                setError(response.error);
            } else {
                setError('Failed to load customer details');
            }
        } catch (err) {
            setError('Failed to fetch customer details');
            console.error('Error fetching customer details:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

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

    const openImageModal = (filename, type, title) => {
        setSelectedDocument({
            url: getImageUrl(filename, type),
            title: title,
            filename: filename,
            type: type
        });
        setShowImageModal(true);
    };

    const closeImageModal = () => {
        setShowImageModal(false);
        setSelectedDocument(null);
    };

    // Helper function to get document URL
    const getImageUrl = (filename, type) => {
        if (!filename || !type || !requestId) return '';
        
        const actualFilename = filename.split('/').pop();
        const routeType = type === 'id_card' ? 'id_card' : 'family_book';
        
        return `${config.BASE_URL}/admin/service-requests/${requestId}/documents/${routeType}/${actualFilename}`;
    };

    const DocumentViewer = ({ documents, type, title }) => {
        if (!documents || (Array.isArray(documents) && documents.length === 0)) {
            return (
                <div className="text-center py-8 text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg">No {title.toLowerCase()} uploaded</p>
                </div>
            );
        }

        const documentArray = Array.isArray(documents) ? documents : [];

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documentArray.map((filename, index) => {
                    const label = type === 'id_card' ? (index === 0 ? 'Front Side' : 'Back Side') : `Page ${index + 1}`;

                    return (
                        <div 
                            key={index} 
                            className="relative group bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => openImageModal(filename, type, title)}
                        >
                            <div className="relative w-full h-48">
                                {/* Document Placeholder Thumbnail */}
                                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                                    <div className="text-center">
                                        <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-sm font-medium">{type === 'id_card' ? 'ID Card' : 'Family Book'}</p>
                                        <p className="text-xs">{label}</p>
                                    </div>
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center pointer-events-none z-10">
                                    <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                            </div>
                            
                            {/* Document Label */}
                            <div className="p-4">
                                <p className="text-sm font-medium text-gray-700 truncate" title={filename}>
                                    {label}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Click to view document
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                            <h3 className="text-lg font-medium">Error</h3>
                            <p>{error}</p>
                            <button
                                onClick={() => navigate('/admin/service-requests')}
                                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                            >
                                Back to Service Requests
                            </button>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (!customerDetail) {
        return (
            <AdminLayout>
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center py-20">
                            <h3 className="text-lg font-medium text-gray-900">Customer not found</h3>
                            <button
                                onClick={() => navigate('/admin/service-requests')}
                                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Back to Service Requests
                            </button>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <button
                                    onClick={() => navigate('/admin/service-requests')}
                                    className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back to Service Requests
                                </button>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Request #{customerDetail.id} - {customerDetail.name}
                                </h1>
                                <p className="mt-2 text-gray-600">Customer details and uploaded documents</p>
                            </div>
                        </div>
                    </div>

                    {/* Privacy Warning */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
                        <div className="flex">
                            <svg className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <div>
                                <h3 className="text-sm font-medium text-yellow-800">Privacy Notice</h3>
                                <p className="text-sm text-yellow-700 mt-1">
                                    This page contains sensitive customer documents including ID cards and family books. 
                                    Handle all information with strict confidentiality.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Customer Information */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Full Name</label>
                                    <p className="mt-1 text-lg text-gray-900">{customerDetail.name}</p>
                                </div>
                                {customerDetail.email && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">Email</label>
                                        <p className="mt-1 text-lg text-gray-900">{customerDetail.email}</p>
                                    </div>
                                )}
                                {customerDetail.phone && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">Phone</label>
                                        <p className="mt-1 text-lg text-gray-900">{customerDetail.phone}</p>
                                    </div>
                                )}
                                {customerDetail.address && (
                                    <div className="md:col-span-2 lg:col-span-3">
                                        <label className="block text-sm font-medium text-gray-600">Address</label>
                                        <p className="mt-1 text-lg text-gray-900">{customerDetail.address}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Service Information */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Service Type</label>
                                    <p className="mt-1 text-lg text-gray-900">{customerDetail.service_type}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Current Status</label>
                                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(customerDetail.status?.name)}`}>
                                        {customerDetail.status?.name || 'Pending'}
                                    </span>
                                </div>
                                {customerDetail.details && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">Details</label>
                                        <p className="mt-1 text-lg text-gray-900 whitespace-pre-wrap">{customerDetail.details}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ID Documents */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                </svg>
                                ID Documents
                            </h2>
                            <DocumentViewer 
                                documents={customerDetail.id_card}
                                type="id_card"
                                title="ID Documents"
                            />
                        </div>

                        {/* Family Books */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                Family Books
                            </h2>
                            <DocumentViewer 
                                documents={customerDetail.family_book}
                                type="family_book"
                                title="Family Books"
                            />
                        </div>

                        {/* Timeline */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Request Timeline</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Created</label>
                                    <p className="mt-1 text-lg text-gray-900">{formatDate(customerDetail.created_at)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Last Updated</label>
                                    <p className="mt-1 text-lg text-gray-900">{formatDate(customerDetail.updated_at)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Modal */}
            <ImageModal 
                isOpen={showImageModal}
                onClose={closeImageModal}
                document={selectedDocument}
                title={selectedDocument?.title || "Document"}
            />
        </AdminLayout>
    );
}

export default CustomerDetailPage;
