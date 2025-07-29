import React from 'react';
import { Link } from 'react-router-dom';

function ReportsTable({ reports, onDelete, loading }) {
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
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                        </th>
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
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                {/* 5. Action Buttons */}
                                <Link to={`/admin/reports/edit/${report.type}/${report.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                                <button onClick={() => onDelete(report)} className="text-red-600 hover:text-red-900">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ReportsTable;
