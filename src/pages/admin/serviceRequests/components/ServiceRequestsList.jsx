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
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100 hidden md:table-header-group">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">លេខសម្គាល់</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ឈ្មោះអតិថិជន</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ស្ថានភាព</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">លេខទូរស័ព្ទ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ប្រភេទសេវាកម្ម</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ទីតាំង</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">សកម្មភាព</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <tr key={i} className="animate-pulse">
                                <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                                <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                                <td className="px-6 py-4 whitespace-nowrap"><div className="h-6 bg-gray-200 rounded w-20"></div></td>
                                <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                                <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
                                <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-28"></div></td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex space-x-2">
                                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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

    // Helper function to get status styling
    const getStatusStyling = (status) => {
        const statusName = status?.name?.toLowerCase() || 'pending';

        switch (statusName) {
            case 'pending':
            case 'រង់ចាំ':
                return {
                    className: "inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full",
                    style: { backgroundColor: '#fef3c7', color: '#d97706' },
                    icon: "fas fa-clock",
                    text: "រង់ចាំ"
                };
            case 'progressing':
            case 'in_progress':
            case 'in progress':
            case 'in-progress':
            case 'កំពុងដំណើរការ':
                return {
                    className: "inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full",
                    style: { backgroundColor: '#dbeafe', color: '#2563eb' },
                    icon: "fas fa-sync-alt fa-spin",
                    text: "កំពុងដំណើរការ"
                };
            case 'completed':
            case 'បានបញ្ចប់':
                return {
                    className: "inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full",
                    style: { backgroundColor: '#d1fae5', color: '#047857' },
                    icon: "fas fa-check-circle",
                    text: "បានបញ្ចប់"
                };
            case 'rejected':
            case 'បដិសេធ':
                return {
                    className: "inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full",
                    style: { backgroundColor: '#fee2e2', color: '#dc2626' },
                    icon: "fas fa-times-circle",
                    text: "បដិសេធ"
                };
            default:
                return {
                    className: "inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full",
                    style: { backgroundColor: '#fef3c7', color: '#d97706' },
                    icon: "fas fa-clock",
                    text: "រង់ចាំ"
                };
        }
    };

    return (
        <div className="w-full">
            {/* Mobile Card View */}
            <div className="block md:hidden">
                <div className="space-y-4">
                    {validRequests.map((request) => {
                        const statusStyling = getStatusStyling(request.status);
                        return (
                            <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                <div className="space-y-3">
                                    {/* Header with ID and Status */}
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">#{request.id}</p>
                                            <p className="text-lg font-medium text-gray-900">{request.name}</p>
                                        </div>
                                        <span className={statusStyling.className} style={statusStyling.style}>
                                            <i className={`${statusStyling.icon} mr-2`}></i>
                                            {statusStyling.text}
                                        </span>
                                    </div>
                                    
                                    {/* Details Grid */}
                                    <div className="grid grid-cols-1 gap-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="font-bold text-gray-700">លេខទូរស័ព្ទ:</span>
                                            <span className="text-gray-900">{request.phone || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-bold text-gray-700">ប្រភេទសេវាកម្ម:</span>
                                            <span className="text-gray-900 text-right">{request.service_type || 'ការដាក់ពាក្រស្នើសុំប្រើប្រាស់ទឹកស្អាត'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-bold text-gray-700">ភូមិ:</span>
                                            <span className="text-gray-900">{request.village || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-bold text-gray-700">ឃុំ/សង្កាត់:</span>
                                            <span className="text-gray-900">{request.commune?.name || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-bold text-gray-700">ស្រុក:</span>
                                            <span className="text-gray-900">{request.district?.name || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-bold text-gray-700">ខេត្ត:</span>
                                            <span className="text-gray-900">{request.province?.name || 'N/A'}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="pt-3 border-t border-gray-200">
                                        <div className="flex justify-center space-x-3">
                                            <button
                                                onClick={() => openStatusModal(request)}
                                                title="Update Status"
                                                className="flex items-center justify-center px-3 py-2 text-blue-600 hover:text-blue-800 transition duration-300 rounded-lg hover:bg-blue-50 border border-blue-200"
                                            >
                                                <i className="fas fa-edit mr-1"></i>
                                                <span className="text-xs">កែប្រែ</span>
                                            </button>
                                            <button
                                                onClick={() => openDetailModal(request)}
                                                title="View Details"
                                                className="flex items-center justify-center px-3 py-2 text-gray-600 hover:text-gray-800 transition duration-300 rounded-lg hover:bg-gray-50 border border-gray-200"
                                            >
                                                <i className="fas fa-eye mr-1"></i>
                                                <span className="text-xs">មើល</span>
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(request)}
                                                title="Delete"
                                                className="flex items-center justify-center px-3 py-2 text-red-600 hover:text-red-800 transition duration-300 rounded-lg hover:bg-red-50 border border-red-200"
                                            >
                                                <i className="fas fa-trash-alt mr-1"></i>
                                                <span className="text-xs">លុប</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
                <div className="rounded-xl border border-gray-200 shadow-md">
                    <div className="overflow-x-auto overflow-y-auto w-full" style={{ maxHeight: '600px' }}>
                        <table className="min-w-full divide-y divide-gray-200 table-fixed w-full" style={{ minWidth: '1400px' }}>
                            <thead className="bg-gray-100 sticky top-0 z-10 border-b-2 border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                                        លេខសម្គាល់
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                                        ឈ្មោះអតិថិជន
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                                        ស្ថានភាព
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                        លេខទូរស័ព្ទ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-70">
                                        ប្រភេទសេវាកម្ម
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                                        ភូមិ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                                        ឃុំ/សង្កាត់
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                                        ស្រុក
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                                        ខេត្ត
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
                                        សកម្មភាព
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {validRequests.map((request) => {
                                    const statusStyling = getStatusStyling(request.status);

                                    return (
                                        <tr key={request.id} className="hover:bg-gray-50 transition duration-200 ease-in-out">
                                            {/* ID */}
                                            <td className="px-6 py-3 text-sm text-gray-500 whitespace-nowrap">
                                                {request.id}
                                            </td>

                                            {/* Customer Name */}
                                            <td className="px-6 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                {request.name}
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-3 text-sm text-gray-500 whitespace-nowrap">
                                                <span className={statusStyling.className} style={statusStyling.style}>
                                                    <i className={`${statusStyling.icon} mr-2`}></i>
                                                    {statusStyling.text}
                                                </span>
                                            </td>

                                            {/* Phone */}
                                            <td className="px-6 py-3 text-sm text-gray-500 whitespace-nowrap">
                                                {request.phone || 'N/A'}
                                            </td>

                                            {/* Service Type */}
                                            <td className="px-6 py-3 text-sm text-gray-500 whitespace-nowrap">
                                                {request.service_type || 'ការដាក់ពាក្រស្នើសុំប្រើប្រាស់ទឹកស្អាត'}
                                            </td>

                                            {/* Village */}
                                            <td className="px-6 py-3 text-sm text-gray-500 whitespace-nowrap">
                                                {request.village || 'N/A'}
                                            </td>

                                            {/* Commune */}
                                            <td className="px-6 py-3 text-sm text-gray-500 whitespace-nowrap">
                                                {request.commune?.name || 'N/A'}
                                            </td>

                                            {/* District */}
                                            <td className="px-6 py-3 text-sm text-gray-500 whitespace-nowrap">
                                                {request.district?.name || 'N/A'}
                                            </td>

                                            {/* Province */}
                                            <td className="px-6 py-3 text-sm text-gray-500 whitespace-nowrap">
                                                {request.province?.name || 'N/A'}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                                <div className="flex space-x-2 justify-center">
                                                    <button
                                                        onClick={() => openStatusModal(request)}
                                                        title="Update Status"
                                                        className="text-blue-600 hover:text-blue-800 transition duration-300 p-3 rounded-lg hover:bg-blue-50 border border-blue-200"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => openDetailModal(request)}
                                                        title="View Details"
                                                        className="text-gray-600 hover:text-gray-800 transition duration-300 p-3 rounded-lg hover:bg-gray-50 border border-gray-200"
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(request)}
                                                        title="Delete"
                                                        className="text-red-600 hover:text-red-800 transition duration-300 p-3 rounded-lg hover:bg-red-50 border border-red-200"
                                                    >
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceRequestsList;
