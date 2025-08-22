import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingFallback from '../../../../components/LoadingPage';
import apiService from '../../../../services/api';

function ReportsTable({ reports, onDelete, loading, onStatusChange }) {
    const [publishingStatus, setPublishingStatus] = useState({});

    // Handle publish/unpublish action
    const handleStatusChange = async (report) => {
        const isPublishing = report.status === 'draft';
        const reportKey = `${report.type}-${report.id}`;
        
        setPublishingStatus(prev => ({ ...prev, [reportKey]: true }));
        
        try {
            let result;
            if (report.type === 'monthly') {
                result = isPublishing 
                    ? await apiService.publishMonthlyReport(report.id)
                    : await apiService.unpublishMonthlyReport(report.id);
            } else {
                result = isPublishing 
                    ? await apiService.publishYearlyReport(report.id)
                    : await apiService.unpublishYearlyReport(report.id);
            }
            
            if (result.error) {
                alert(`Error: ${result.error}`);
            } else {
                // Call parent callback to refresh the data
                if (onStatusChange) {
                    onStatusChange();
                }
            }
        } catch (error) {
            alert('Failed to change status. Please try again.');
        } finally {
            setPublishingStatus(prev => ({ ...prev, [reportKey]: false }));
        }
    };

    // 1. Show a loading message while data is being fetched
    if (loading) {
        return <p className="text-center py-8 text-gray-500">Loading reports...</p>;
    }

    // 2. Show a message if there are no reports to display
    if (!reports || reports.length === 0) {
        return (
            <div className="text-center py-8 bg-white rounded-lg shadow">
                <p className="text-gray-500">No reports found.</p>
                <p className="text-sm text-gray-400 mt-2">Click "Create Report" to get started.</p>
            </div>
        );
    }

    // Helper function to format dates
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
                {/* 3. Table Headers */}
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                {/* 4. Table Body */}
                <tbody className="bg-white divide-y divide-gray-200">
                    {reports.map((report) => (
                        <tr key={`${report.type}-${report.id}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{report.title}</div>
                            </td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {/* Display year and month (if available) */}
                                {report.year?.year_value} {report.month ? `- ${report.month.month}` : ''}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {/* Status badge with color coding */}
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    report.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {report.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(report.created_at)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                    {/* Status Toggle Button */}
                                    <button
                                        onClick={() => handleStatusChange(report)}
                                        disabled={publishingStatus[`${report.type}-${report.id}`]}
                                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                                            report.status === 'draft'
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {publishingStatus[`${report.type}-${report.id}`] ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                ...
                                            </span>
                                        ) : (
                                            report.status === 'draft' ? 'Publish' : 'Unpublish'
                                        )}
                                    </button>
                                    
                                    {/* Edit Button */}
                                    <Link 
                                        to={`/admin/reports/edit/${report.type}/${report.id}`} 
                                        className="text-indigo-600 hover:text-indigo-900 px-2 py-1 rounded"
                                    >
                                        Edit
                                    </Link>
                                    
                                    {/* Delete Button */}
                                    <button 
                                        onClick={() => onDelete(report)} 
                                        className="text-red-600 hover:text-red-900 px-2 py-1 rounded"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ReportsTable;
