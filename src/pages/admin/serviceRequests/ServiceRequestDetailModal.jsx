import React from 'react';

function ServiceRequestDetailModal({ request, isOpen, onClose }) {
    if (!isOpen || !request) return null;

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

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">
                            Service Request Details
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                        {/* Customer Information */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Full Name</label>
                                    <p className="text-gray-900">{request.name}</p>
                                </div>
                                {request.email && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">Email</label>
                                        <p className="text-gray-900">{request.email}</p>
                                    </div>
                                )}
                                {request.phone && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">Phone</label>
                                        <p className="text-gray-900">{request.phone}</p>
                                    </div>
                                )}
                                {request.address && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">Address</label>
                                        <p className="text-gray-900">{request.address}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Service Information */}
                        <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-3">Service Information</h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Service Type</label>
                                    <p className="text-gray-900">{request.service_type}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Current Status</label>
                                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(request.status?.name)}`}>
                                        {request.status?.name || 'Pending'}
                                    </span>
                                </div>
                                {request.details && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">Details</label>
                                        <p className="text-gray-900 whitespace-pre-wrap">{request.details}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Timestamps */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-3">Request Timeline</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Created</label>
                                    <p className="text-gray-900">{formatDate(request.created_at)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Last Updated</label>
                                    <p className="text-gray-900">{formatDate(request.updated_at)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ServiceRequestDetailModal;
