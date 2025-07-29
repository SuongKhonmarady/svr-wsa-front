import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import apiService from '../../../../services/api';
import AdminLayout from '../../components/AdminLayout';

// Helper component for form fields to reduce repetition
const FormField = ({ label, children, error }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {children}
        {error && <p className="text-red-500 text-xs mt-1">{error[0]}</p>}
    </div>
);

function ReportForm() {
    const navigate = useNavigate();
    const { type: initialType, id } = useParams();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        title: '',
        type: initialType || 'monthly',
        status: 'draft',
        year_id: '',
        month_id: '',
        description: '',
        file: null,
    });

    const [years, setYears] = useState([]);
    const [months, setMonths] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [isDataReady, setIsDataReady] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [currentFileUrl, setCurrentFileUrl] = useState(null);
    const [generalError, setGeneralError] = useState('');


    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setIsDataReady(false);
            try {
                const [yearsRes, monthsRes] = await Promise.all([
                    apiService.getReportYears(),
                    apiService.getReportMonths(),
                ]);

                if (yearsRes.data && yearsRes.data.data) setYears(yearsRes.data.data);
                if (monthsRes.data && monthsRes.data.data) setMonths(monthsRes.data.data);
                
                setIsDataReady(true);

                if (isEditing) {
                    const reportRes = await (initialType === 'monthly'
                        ? apiService.getMonthlyReport(id)
                        : apiService.getYearlyReport(id));

                    if (reportRes.data && reportRes.data.data) {
                        const report = reportRes.data.data;
                        setFormData({
                            title: report.title || '',
                            type: initialType,
                            status: report.status || 'draft',
                            year_id: report.year_id ? report.year_id.toString() : '',
                            month_id: report.month_id ? report.month_id.toString() : '',
                            description: report.description || '',
                            file: null,
                        });
                        setCurrentFileUrl(report.file_url);
                    } else {
                         setGeneralError(reportRes.error || 'Failed to load report data.');
                    }
                }
            } catch (error) {
                setGeneralError('Failed to load initial form data.');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id, isEditing, initialType]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, file: e.target.files[0] }));
         if (errors.file) {
            setErrors(prev => ({ ...prev, file: null }));
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitLoading) return;
        
        setSubmitLoading(true);
        setErrors({});
        setGeneralError('');
        
        // --- FINAL, ROBUST FIX: Build FormData directly from the form element ---
        // This is the most reliable method and avoids React state timing issues.
        const formElement = e.currentTarget;
        const data = new FormData(formElement);

        // Your backend controller requires this field, which is not in the form.
        const user = JSON.parse(localStorage.getItem('user'));
        data.append('created_by', user ? user.name : 'Admin');
        
        // Since your API routes for update now correctly use POST,
        // we no longer need to spoof the method. This was a likely source of the error.
        // if (isEditing) {
        //     data.append('_method', 'PUT');
        // }

        try {
            const response = await (isEditing
                ? (formData.type === 'monthly' ? apiService.updateMonthlyReport(id, data) : apiService.updateYearlyReport(id, data))
                : (formData.type === 'monthly' ? apiService.createMonthlyReport(data) : apiService.createYearlyReport(data))
            );

            if (response.error) {
                if (response.details) {
                    setErrors(response.details);
                } else {
                    setGeneralError(response.error);
                }
            } else {
                navigate('/admin/reports', { state: { message: `Report ${isEditing ? 'updated' : 'created'} successfully!` } });
            }
        } catch (error) {
            setGeneralError('An unexpected error occurred during submission.');
        } finally {
            setSubmitLoading(false);
        }
    };

    if (!isDataReady) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-64">
                    <p>Loading Form Data...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">
                    {isEditing ? `Edit ${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} Report` : 'Create New Report'}
                </h1>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Report Type */}
                        <div className="md:col-span-2">
                             <FormField label="Report Type" error={errors.type}>
                                <div className="flex items-center gap-x-6 mt-2">
                                    <div className="flex items-center">
                                        <input id="monthly" name="type" type="radio" value="monthly" checked={formData.type === 'monthly'} onChange={handleChange} className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600" disabled={isEditing} />
                                        <label htmlFor="monthly" className="ml-2 block text-sm text-gray-900">Monthly</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input id="yearly" name="type" type="radio" value="yearly" checked={formData.type === 'yearly'} onChange={handleChange} className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600" disabled={isEditing} />
                                        <label htmlFor="yearly" className="ml-2 block text-sm text-gray-900">Yearly</label>
                                    </div>
                                </div>
                             </FormField>
                        </div>
                        
                        {/* Title */}
                        <div className="md:col-span-2">
                            <FormField label="Report Title" error={errors.title}>
                                <input type="text" name="title" value={formData.title} onChange={handleChange} className={`w-full p-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`} />
                            </FormField>
                        </div>

                        {/* Year */}
                        <FormField label="Year" error={errors.year_id}>
                            <select name="year_id" value={formData.year_id} onChange={handleChange} className={`w-full p-2 border ${errors.year_id ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900`}>
                                <option value="">Select Year</option>
                                {years.map(year => <option key={year.id} value={year.id} className="text-black">{year.year_value}</option>)}
                            </select>
                        </FormField>

                        {/* Month (Conditional) */}
                        {formData.type === 'monthly' && (
                            <FormField label="Month" error={errors.month_id}>
                                <select name="month_id" value={formData.month_id} onChange={handleChange} className={`w-full p-2 border ${errors.month_id ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900`}>
                                    <option value="">Select Month</option>
                                    {months.map(month => <option key={month.id} value={month.id} className="text-black">{month.month}</option>)}
                                </select>
                            </FormField>
                        )}

                        {/* Status */}
                        <FormField label="Status" error={errors.status}>
                             <select name="status" value={formData.status} onChange={handleChange} className={`w-full p-2 border ${errors.status ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900`}>
                                <option value="draft" className="text-black">Draft</option>
                                <option value="published" className="text-black">Published</option>
                            </select>
                        </FormField>
                        
                        {/* File Upload */}
                        <div className="md:col-span-2">
                            <FormField label={isEditing ? "Upload New File (Optional)" : "Report File"} error={errors.file}>
                                <input type="file" name="file" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            </FormField>
                            {isEditing && currentFileUrl && (
                                <p className="text-xs text-gray-600 mt-2">
                                    Current file: <a href={currentFileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{currentFileUrl.split('/').pop()}</a>
                                </p>
                            )}
                             {formData.file && (
                                <p className="text-xs text-green-600 mt-2">
                                    New file selected: {formData.file.name}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <FormField label="Description" error={errors.description}>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </FormField>
                        </div>
                    </div>

                    {/* Global Error Message */}
                    {generalError && (
                        <div className="mt-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                            {generalError}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 mt-8">
                        <Link to="/admin/reports" className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                            Cancel
                        </Link>
                        <button type="submit" disabled={submitLoading} className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed">
                            {submitLoading ? 'Saving...' : (isEditing ? 'Update Report' : 'Create Report')}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

export default ReportForm;
