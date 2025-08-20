import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import apiService from '../../../../services/api';
import AdminLayout from '../../components/AdminLayout';

// Helper component for form fields to reduce repetition
const FormField = ({ label, children, error }) => (
    <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">{label}</label>
        {children}
        {error && <p className="text-red-500 text-xs bg-red-50 p-2 rounded border border-red-200">{error[0]}</p>}
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
        created_by: 'Admin User', // Default value like in HTML test
        file: null, // Explicitly set to null
    });

    const [years, setYears] = useState([]);
    const [months, setMonths] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [isDataReady, setIsDataReady] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [currentFileUrl, setCurrentFileUrl] = useState(null);
    const [generalError, setGeneralError] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);


    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setIsDataReady(false);
            setGeneralError('');
            
            try {
                const [yearsRes, monthsRes] = await Promise.all([
                    apiService.getReportYears(),
                    apiService.getReportMonths(),
                ]);

                if (yearsRes.error) {
                    throw new Error(yearsRes.error);
                }
                if (monthsRes.error) {
                    throw new Error(monthsRes.error);
                }

                if (yearsRes.data && yearsRes.data.data) {
                    setYears(yearsRes.data.data);
                } else {
                    console.warn('No years data received');
                }
                
                if (monthsRes.data && monthsRes.data.data) {
                    setMonths(monthsRes.data.data);
                } else {
                    console.warn('No months data received');
                }
                
                setIsDataReady(true);

                // Load existing report data if editing
                if (isEditing) {
                    const reportRes = await (initialType === 'monthly'
                        ? apiService.getAdminMonthlyReportById(id)
                        : apiService.getAdminYearlyReportById(id));

                    if (reportRes.error) {
                        throw new Error(reportRes.error);
                    }
                    console.log('Report data loaded:', reportRes.data);

                    // Handle different response structures
                    let report = null;
                    if (reportRes.data && reportRes.data.data) {
                        report = reportRes.data.data;
                    } else if (reportRes.data) {
                        report = reportRes.data;
                    } else {
                        throw new Error('Failed to load report data');
                    }

                    setFormData({
                        title: report.title || '',
                        type: initialType,
                        status: report.status || 'draft',
                        year_id: report.year_id ? report.year_id.toString() : '',
                        month_id: report.month_id ? report.month_id.toString() : '',
                        description: report.description || '',
                        created_by: report.created_by || 'Admin', // Default fallback
                        file: null,
                    });
                    setCurrentFileUrl(report.file_url);
                }
            } catch (error) {
                console.error('Failed to load form data:', error);
                setGeneralError(error.message || 'Failed to load form data. Please refresh the page and try again.');
                setIsDataReady(false);
            } finally {
                setLoading(false);
            }
        }
        
        fetchData();
    }, [id, isEditing, initialType]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // If changing report type, clear month_id when switching to yearly
        if (name === 'type' && value === 'yearly') {
            setFormData(prev => ({ ...prev, [name]: value, month_id: '' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        
        // Clear errors for the field being edited
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
        
        // Clear month error when switching to yearly
        if (name === 'type' && value === 'yearly' && errors.month_id) {
            setErrors(prev => ({ ...prev, month_id: null }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        handleFileSelection(file);
    };

    const handleFileSelection = (file) => {
        if (!file) {
            setFormData(prev => ({ ...prev, file: null }));
            setErrors(prev => ({ ...prev, file: null }));
            return;
        }
        
        // Validate file type
        const allowedTypes = [
            'application/pdf', 
            'application/msword', 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
            'application/vnd.ms-excel', 
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
        const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'];
        
        const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
        
        if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
            setErrors(prev => ({ 
                ...prev, 
                file: ['Please select a valid file type (PDF, DOC, DOCX, XLS, XLSX)'] 
            }));
            // Clear the input
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = '';
            setFormData(prev => ({ ...prev, file: null }));
            return;
        }
        
        // Validate file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
            setErrors(prev => ({ 
                ...prev, 
                file: ['File size must be less than 10MB'] 
            }));
            // Clear the input
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = '';
            setFormData(prev => ({ ...prev, file: null }));
            return;
        }
        
        setFormData(prev => ({ ...prev, file: file }));
        
        // Clear any existing file errors
        if (errors.file) {
            setErrors(prev => ({ ...prev, file: null }));
        }
    };

    // Drag and drop handlers
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelection(e.dataTransfer.files[0]);
        }
    };

    // Clear file selection
    const clearFileSelection = () => {
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
        setFormData(prev => ({ ...prev, file: null }));
        setErrors(prev => ({ ...prev, file: null }));
    };

    // Format file size helper
    const formatFileSize = (bytes) => {
        if (bytes === 0 || !bytes) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Auto-generate title based on year and month
    const generateTitle = () => {
        if (!formData.year_id || (formData.type === 'monthly' && !formData.month_id)) {
            return '';
        }

        const year = years.find(y => y.id.toString() === formData.year_id);
        const month = months.find(m => m.id.toString() === formData.month_id);

        if (formData.type === 'monthly' && year && month) {
            return `Monthly Water Quality Report - ${month.month} ${year.year_value}`;
        } else if (formData.type === 'yearly' && year) {
            return `Annual Water Quality Report - ${year.year_value}`;
        }
        return '';
    };

    // Auto-generate title when year/month changes
    useEffect(() => {
        if (!isEditing && !formData.title) {
            const autoTitle = generateTitle();
            if (autoTitle) {
                setFormData(prev => ({ ...prev, title: autoTitle }));
            }
        }
    }, [formData.year_id, formData.month_id, formData.type, years, months, isEditing]);

    // Set default created_by from user info if available
    useEffect(() => {
        if (!formData.created_by || formData.created_by === 'Admin User') {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}');
            const createdBy = user?.name || adminUser?.name || user?.username || adminUser?.username || 'Admin User';
            if (createdBy !== formData.created_by) {
                setFormData(prev => ({ ...prev, created_by: createdBy }));
            }
        }
    }, [formData.created_by]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitLoading) return;
        
        setSubmitLoading(true);
        setErrors({});
        setGeneralError('');
        
        // Client-side validation
        const newErrors = {};
        
        if (!formData.year_id || formData.year_id === '') {
            newErrors.year_id = ['Please select a year.'];
        }
        
        if (formData.type === 'monthly' && (!formData.month_id || formData.month_id === '')) {
            newErrors.month_id = ['Please select a month.'];
        }
        
        if (!formData.created_by || formData.created_by.trim() === '') {
            newErrors.created_by = ['Created by field is required.'];
        }
        
        if (!formData.title || formData.title.trim() === '') {
            newErrors.title = ['Title is required.'];
        }
        
        if (!isEditing && (!formData.file || !(formData.file instanceof File))) {
            newErrors.file = ['File is required when creating a new report'];
        }
        
        // Remove the created_by validation - let the backend handle it
        // The backend will use 'Admin' as default if not provided
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setSubmitLoading(false);
            return;
        }
        
        try {
            // Frontend validation - check required fields before building FormData
            console.log('Pre-submission validation check:');
            console.log('- year_id:', formData.year_id, 'Type:', typeof formData.year_id);
            console.log('- month_id:', formData.month_id, 'Type:', typeof formData.month_id, 'Report type:', formData.type);
            console.log('- created_by:', formData.created_by, 'Type:', typeof formData.created_by);
            
            // Build FormData properly - different structure for monthly vs yearly
            const data = new FormData();
            
            // Add common form fields
            data.append('title', formData.title.trim());
            data.append('type', formData.type);
            data.append('status', formData.status);
            data.append('description', formData.description.trim());
            
            // Add year_id (always include, let backend validate)
            data.append('year_id', formData.year_id ? formData.year_id.toString() : '');
            
            // Add month_id ONLY for monthly reports (always include for monthly, completely omit for yearly)
            if (formData.type === 'monthly') {
                data.append('month_id', formData.month_id ? formData.month_id.toString() : '');
            }
            // Note: month_id completely omitted for yearly reports
            
            // Add created_by (always include, use fallback if empty)
            const createdBy = formData.created_by && formData.created_by.trim() !== '' 
                ? formData.created_by.trim() 
                : 'Admin User';
            data.append('created_by', createdBy);
            
            // Add file
            if (formData.file && formData.file instanceof File) {
                data.append('file', formData.file);
            }

            // Debug: Log what we're sending
            console.log('=== FORM SUBMISSION DEBUG ===');
            console.log('isEditing:', isEditing);
            console.log('Report ID:', id);
            console.log('Form Data State:', formData);
            console.log('FormData contents:');
            for (let pair of data.entries()) {
                console.log(`${pair[0]}:`, pair[1]);
            }
            console.log('=== END DEBUG ===');

            console.log('Making API call...');
            
            // Set uploading state if there's a file
            if (formData.file && formData.file instanceof File) {
                setIsUploading(true);
                setUploadProgress(0);
            }

            // Simulate upload progress for better UX
            if (isUploading) {
                const progressInterval = setInterval(() => {
                    setUploadProgress(prev => {
                        if (prev < 90) return prev + 10;
                        return prev;
                    });
                }, 200);
                
                setTimeout(() => clearInterval(progressInterval), 3000);
            }
            
            // Make API call using the fixed API service
            let response;
            
            if (formData.type === 'monthly') {
                if (isEditing) {
                    response = await apiService.updateMonthlyReport(id, data);
                } else {
                    response = await apiService.createMonthlyReport(data);
                }
            } else {
                if (isEditing) {
                    response = await apiService.updateYearlyReport(id, data);
                } else {
                    response = await apiService.createYearlyReport(data);
                }
            }

            // Complete progress
            if (isUploading) {
                setUploadProgress(100);
                setTimeout(() => {
                    setIsUploading(false);
                    setUploadProgress(0);
                }, 500);
            }

            if (response.error) {
                console.error('API Error:', response.error, '| Report type:', formData.type);
                
                // Parse the error response data to extract validation errors
                let errorData = null;
                try {
                    if (typeof response.error === 'string' && response.error.includes('{')) {
                        // Try to parse JSON from error string
                        const jsonMatch = response.error.match(/\{.*\}/);
                        if (jsonMatch) {
                            errorData = JSON.parse(jsonMatch[0]);
                        }
                    }
                } catch (parseError) {
                    console.warn('Could not parse error JSON:', parseError);
                }
                
                // Handle different types of error responses
                if (errorData && errorData.errors) {
                    // Laravel validation errors format from parsed JSON
                    setErrors(errorData.errors);
                    setGeneralError(`${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} report validation failed. Please correct the errors below.`);
                } else if (response.error.includes('errors')) {
                    // Try to extract validation errors from error string
                    const newErrors = {};
                    if (response.error.includes('year_id')) {
                        newErrors.year_id = ['Please select a year.'];
                    }
                    if (response.error.includes('month_id') && formData.type === 'monthly') {
                        newErrors.month_id = ['Please select a month.'];
                    }
                    if (response.error.includes('created_by')) {
                        newErrors.created_by = ['Created by field is required.'];
                    }
                    
                    if (Object.keys(newErrors).length > 0) {
                        setErrors(newErrors);
                        setGeneralError(`${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} report validation failed. Please correct the errors below.`);
                    } else {
                        setGeneralError(response.error);
                    }
                } else {
                    // Generic error
                    setGeneralError(`Failed to ${isEditing ? 'update' : 'create'} ${formData.type} report: ${response.error}`);
                }
            } else if (response.data && response.data.success) {
                navigate('/admin/reports', { 
                    state: { 
                        message: `Report ${isEditing ? 'updated' : 'created'} successfully!`,
                        type: 'success'
                    } 
                });
            } else {
                console.warn('Unexpected response format:', response);
                setGeneralError('An unexpected error occurred during submission.');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            setGeneralError('An unexpected error occurred during submission.');
        } finally {
            setSubmitLoading(false);
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading form data...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (!isDataReady || generalError) {
        return (
            <AdminLayout>
                <div className="max-w-4xl mx-auto p-6">
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    Error Loading Form
                                </h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>{generalError || 'Failed to load form data.'}</p>
                                </div>
                                <div className="mt-4">
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="bg-red-100 px-4 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                                    >
                                        Reload Page
                                    </button>
                                    <Link
                                        to="/admin/reports"
                                        className="ml-3 bg-gray-100 px-4 py-2 rounded-md text-sm font-medium text-gray-800 hover:bg-gray-200"
                                    >
                                        Back to Reports
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
                    <h1 className="text-2xl font-bold">
                        📊 {isEditing ? `Edit ${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} Report` : 'Create New Report'}
                    </h1>
                    <p className="text-blue-100 mt-2">
                        {isEditing ? 'Update the report information and upload a new file if needed' : 'Fill in the details below to create a new water quality report'}
                    </p>
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-b-lg shadow-lg">
                    <form onSubmit={handleSubmit} noValidate className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Report Type */}
                        <div className="md:col-span-2">
                             <FormField label="Report Type" error={errors.type}>
                                <div className="flex items-center gap-x-8 mt-3">
                                    <div className="flex items-center">
                                        <input 
                                            id="monthly" 
                                            name="type" 
                                            type="radio" 
                                            value="monthly" 
                                            checked={formData.type === 'monthly'} 
                                            onChange={handleChange} 
                                            className="h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-600" 
                                            disabled={isEditing} 
                                        />
                                        <label htmlFor="monthly" className="ml-3 flex items-center text-sm font-medium text-gray-900">
                                            📅 Monthly Report
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input 
                                            id="yearly" 
                                            name="type" 
                                            type="radio" 
                                            value="yearly" 
                                            checked={formData.type === 'yearly'} 
                                            onChange={handleChange} 
                                            className="h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-600" 
                                            disabled={isEditing} 
                                        />
                                        <label htmlFor="yearly" className="ml-3 flex items-center text-sm font-medium text-gray-900">
                                            📆 Yearly Report
                                        </label>
                                    </div>
                                </div>
                                {isEditing && (
                                    <p className="text-xs text-gray-500 mt-2">
                                        Report type cannot be changed when editing
                                    </p>
                                )}
                             </FormField>
                        </div>
                        
                        {/* Title */}
                        <div className="md:col-span-2">
                            <FormField label="Report Title *" error={errors.title}>
                                <input 
                                    type="text" 
                                    name="title" 
                                    value={formData.title} 
                                    onChange={handleChange} 
                                    placeholder={
                                        !isEditing && generateTitle() 
                                            ? generateTitle()
                                            : formData.type === 'monthly' ? 'e.g., Monthly Water Quality Report - January 2024' : 'e.g., Annual Water Quality Report - 2024'
                                    }
                                    className={`w-full p-3 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`} 
                                    required
                                />
                                <div className="flex items-center justify-between mt-2">
                                    <p className="text-xs text-gray-500">
                                        Required field. Auto-generates based on selected year/month
                                    </p>
                                    {!isEditing && formData.year_id && (formData.type === 'yearly' || formData.month_id) && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const autoTitle = generateTitle();
                                                if (autoTitle) {
                                                    setFormData(prev => ({ ...prev, title: autoTitle }));
                                                }
                                            }}
                                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                                        >
                                            Auto-generate title
                                        </button>
                                    )}
                                </div>
                            </FormField>
                        </div>

                        {/* Year */}
                        <FormField label="Year *" error={errors.year_id}>
                            <select 
                                name="year_id" 
                                value={formData.year_id} 
                                onChange={handleChange} 
                                required
                                className={`w-full p-3 border ${errors.year_id ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-colors`}
                            >
                                <option value="">Select Year</option>
                                {years.map(year => (
                                    <option key={year.id} value={year.id} className="text-black">
                                        {year.year_value}
                                    </option>
                                ))}
                            </select>
                            {!formData.year_id && (
                                <p className="text-xs text-red-500 mt-1">Please select a year</p>
                            )}
                        </FormField>

                        {/* Month (Conditional) */}
                        {formData.type === 'monthly' && (
                            <FormField label="Month *" error={errors.month_id}>
                                <select 
                                    name="month_id" 
                                    value={formData.month_id} 
                                    onChange={handleChange} 
                                    required
                                    className={`w-full p-3 border ${errors.month_id ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-colors`}
                                >
                                    <option value="">Select Month</option>
                                    {months.map(month => (
                                        <option key={month.id} value={month.id} className="text-black">
                                            {month.month}
                                        </option>
                                    ))}
                                </select>
                                {!formData.month_id && (
                                    <p className="text-xs text-red-500 mt-1">Please select a month</p>
                                )}
                            </FormField>
                        )}

                        {/* Status and Created By in same row */}
                        <FormField label="Status" error={errors.status}>
                             <select 
                                name="status" 
                                value={formData.status} 
                                onChange={handleChange} 
                                className={`w-full p-3 border ${errors.status ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-colors`}
                            >
                                <option value="draft" className="text-black">Draft</option>
                                <option value="published" className="text-black">Published</option>
                            </select>
                        </FormField>

                        <FormField label="Created By *" error={errors.created_by}>
                            <input 
                                type="text" 
                                name="created_by" 
                                value={formData.created_by} 
                                onChange={handleChange} 
                                placeholder="Enter creator name"
                                required
                                className={`w-full p-3 border ${errors.created_by ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`} 
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Name of the person creating this report
                            </p>
                        </FormField>
                        
                        {/* File Upload */}
                        <div className="md:col-span-2">
                            <FormField label={isEditing ? "Upload New File (Optional)" : "Report File *"} error={errors.file}>
                                <div 
                                    className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-300 cursor-pointer ${
                                        dragActive 
                                            ? 'border-blue-500 bg-blue-50' 
                                            : errors.file 
                                                ? 'border-red-300 bg-red-50' 
                                                : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
                                    }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={() => document.getElementById('file-input').click()}
                                >
                                    <input 
                                        id="file-input"
                                        type="file" 
                                        onChange={handleFileChange} 
                                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                                        className="hidden"
                                    />
                                    
                                    {!formData.file ? (
                                        <div className="text-center">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <div className="mt-4">
                                                <p className="text-lg font-medium text-gray-700">
                                                    📁 Click to select file or drag & drop here
                                                </p>
                                                <p className="text-sm text-gray-500 mt-2">
                                                    Supported formats: PDF, DOC, DOCX, XLS, XLSX (Max: 10MB)
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <svg className="mx-auto h-12 w-12 text-green-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <div className="mt-4">
                                                <p className="text-lg font-medium text-green-700">
                                                    📎 File selected. Click to change
                                                </p>
                                                <p className="text-sm text-gray-500 mt-2">
                                                    Or drag & drop a new file to replace
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Upload Progress */}
                                {isUploading && (
                                    <div className="mt-4">
                                        <div className="bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Uploading... {uploadProgress}%
                                        </p>
                                    </div>
                                )}
                                
                                {/* Current file display for editing */}
                                {isEditing && currentFileUrl && !formData.file && (
                                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-blue-800">
                                                    📄 Current file:
                                                </p>
                                                <a 
                                                    href={currentFileUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                                >
                                                    {currentFileUrl.split('/').pop()}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Selected file display */}
                                {formData.file && formData.file instanceof File && (
                                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-green-800">
                                                    📄 Selected file:
                                                </p>
                                                <p className="text-sm text-green-700 font-medium">
                                                    {formData.file.name}
                                                </p>
                                                <div className="flex gap-4 mt-1">
                                                    <p className="text-xs text-green-600">
                                                        Size: {formatFileSize(formData.file.size)}
                                                    </p>
                                                    <p className="text-xs text-green-600">
                                                        Type: {formData.file.type || 'Unknown'}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    clearFileSelection();
                                                }}
                                                className="ml-4 px-3 py-1 text-xs text-red-600 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Invalid file display */}
                                {formData.file && !(formData.file instanceof File) && (
                                    <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-red-700">
                                                ⚠️ Invalid file object detected. Please select a file again.
                                            </p>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    clearFileSelection();
                                                }}
                                                className="ml-4 px-3 py-1 text-xs text-red-600 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
                                            >
                                                Clear
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </FormField>
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <FormField label="Description" error={errors.description}>
                                <textarea 
                                    name="description" 
                                    value={formData.description} 
                                    onChange={handleChange} 
                                    rows="4" 
                                    placeholder="Enter a brief description of the report content..."
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Optional: Provide additional context about this report
                                </p>
                            </FormField>
                        </div>
                    </div>

                        {/* Global Error Message */}
                        {generalError && (
                            <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                                <div className="flex items-center">
                                    <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    {generalError}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                            <Link 
                                to="/admin/reports" 
                                className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </Link>
                            <button 
                                type="submit" 
                                disabled={submitLoading || isUploading} 
                                className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                            >
                                {submitLoading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </div>
                                ) : (isEditing ? '💾 Update Report' : '✨ Create Report')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}

export default ReportForm;
