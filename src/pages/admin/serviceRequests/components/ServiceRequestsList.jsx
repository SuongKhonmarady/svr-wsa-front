import React from 'react';

const ServiceRequestsList = ({ 
    serviceRequests, 
    loading, 
    getStatusColor, 
    formatDate,
    openDetailModal,
    openStatusModal,
    openDeleteModal
}) => {

    // Handle loading state first
    if (loading) {
        return (
            <div className="mb-6">
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    // Handle case where serviceRequests is undefined, null, or empty
    if (!serviceRequests || serviceRequests.length === 0) {
        return (
            <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No service requests</h3>
                <p className="mt-1 text-sm text-gray-500">
                    No service requests have been submitted yet.
                </p>
            </div>
        );
    }

    // Validate that each request has the required structure
    const validRequests = serviceRequests.filter(request => {
        if (!request || typeof request !== 'object') {
            return false;
        }
        if (!request.id) {
            return false;
        }
        return true;
    });

    if (validRequests.length === 0) {
        return (
            <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Invalid Data Format</h3>
                <p className="mt-1 text-sm text-gray-500">
                    The server returned data in an unexpected format. Please contact support.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="p-6">
                <div className="grid gap-6">
                    {validRequests.map((request) => (
                        <div key={request.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors duration-200 border border-gray-200">
                            {/* Header Row */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">{request.name}</h3>
                                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(request.status?.name)}`}>
                                            {request.status?.name || 'Pending'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">Request #{request.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Created</p>
                                    <p className="text-sm font-medium text-gray-900">{formatDate(request.created_at)}</p>
                                </div>
                            </div>

                            {/* Main Content Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Customer & Service Info */}
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Customer Information</h4>
                                        <div className="space-y-2">
                                            {request.phone && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    <span className="text-gray-900">{request.phone}</span>
                                                </div>
                                            )}
                                            {request.email && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="text-gray-900">{request.email}</span>
                                                </div>
                                            )}
                                            {request.occupation && request.occupation.name && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 0 18 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    <span className="text-gray-900">{request.occupation.name}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Service Details</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                                <span className="text-gray-900 font-medium">{request.service_type}</span>
                                            </div>
                                            {request.details && (
                                                <p className="text-sm text-gray-600" style={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}>{request.details}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Family & Location Info */}
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Family Information</h4>
                                        <div className="space-y-2">
                                            {request.family_members && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 0 16 0zm6 3a2 2 0 11-4 0 2 2 0 0 14 0zM7 10a2 2 0 11-4 0 2 2 0 0 14 0z" />
                                                    </svg>
                                                    <span className="text-gray-900">{request.family_members} members</span>
                                                </div>
                                            )}
                                            {request.female_members && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 0 18 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    <span className="text-gray-900">{request.female_members} female members</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Location</h4>
                                        <div className="space-y-2">
                                            {request.village && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                    <span className="text-gray-900">{request.village}</span>
                                                </div>
                                            )}
                                            {request.province && request.province.name && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 0 16 0z" />
                                                    </svg>
                                                    <span className="text-gray-900">{request.province.name}</span>
                                                </div>
                                            )}
                                            {request.district && request.district.name && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 0 16 0z" />
                                                    </svg>
                                                    <span className="text-gray-900">{request.district.name}</span>
                                                </div>
                                            )}
                                            {request.commune && request.commune.name && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 0 16 0z" />
                                                    </svg>
                                                    <span className="text-gray-900">{request.commune.name}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Info & Actions */}
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Information</h4>
                                        <div className="space-y-2">
                                            {request.usage_type && request.usage_type.name && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                    </svg>
                                                    <span className="text-gray-900">{request.usage_type.name}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => openDetailModal(request)}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors duration-200"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 0 16 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                View Details
                                            </button>
                                            <button
                                                onClick={() => openStatusModal(request)}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                Update Status
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(request)}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors duration-200"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 01 16.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete Request
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


        </>
    );
};

export default ServiceRequestsList;
