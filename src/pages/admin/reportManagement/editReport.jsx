import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import apiService from '../../../services/api'

function EditReport() {
    const navigate = useNavigate()
    const { type, id } = useParams()
    
    const [formData, setFormData] = useState({
        title: '',
        type: type || 'monthly',
        status: 'draft',
        year_id: '',
        month_id: '',
        report_date: '',
        description: '',
        file: null
    })
    
    const [years, setYears] = useState([])
    const [months, setMonths] = useState([])
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(true)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [currentFileUrl, setCurrentFileUrl] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)

    useEffect(() => {
        fetchInitialData()
    }, [id])

    const fetchInitialData = async () => {
        try {
            setLoading(true)
            
            // Fetch years, months, and report data in parallel
            const [yearsResult, monthsResult, reportResult] = await Promise.all([
                apiService.getReportYears(),
                apiService.getReportMonths(),
                type === 'monthly' ? apiService.getMonthlyReport(id) : apiService.getYearlyReport(id)
            ])
            
            // Handle years
            if (yearsResult.error) {
                console.error('Error fetching years:', yearsResult.error)
                setYears([
                    { id: 1, year_value: 2023, status: 'past' },
                    { id: 2, year_value: 2024, status: 'past' },
                    { id: 3, year_value: 2025, status: 'current' }
                ])
            } else {
                setYears(yearsResult.data || [])
            }
            
            // Handle months
            if (monthsResult.error) {
                console.error('Error fetching months:', monthsResult.error)
                setMonths([
                    { id: 1, name: 'January' }, { id: 2, name: 'February' },
                    { id: 3, name: 'March' }, { id: 4, name: 'April' },
                    { id: 5, name: 'May' }, { id: 6, name: 'June' },
                    { id: 7, name: 'July' }, { id: 8, name: 'August' },
                    { id: 9, name: 'September' }, { id: 10, name: 'October' },
                    { id: 11, name: 'November' }, { id: 12, name: 'December' }
                ])
            } else {
                setMonths(monthsResult.data || [])
            }
            
            // Handle report data
            if (reportResult.error) {
                setErrors({ submit: reportResult.error })
            } else {
                const report = reportResult.data
                setFormData({
                    title: report.title || '',
                    type: report.type || type || 'monthly',
                    status: report.status || 'draft',
                    year_id: report.year_id?.toString() || '',
                    month_id: report.month_id?.toString() || '',
                    report_date: report.report_date || '',
                    description: report.description || '',
                    file: null
                })
                setCurrentFileUrl(report.file_url || null)
            }
            
        } catch (error) {
            console.error('Error fetching data:', error)
            setErrors({ submit: 'Failed to load report data' })
        } finally {
            setLoading(false)
        }
    }

    const validateFile = (file) => {
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ]
        
        if (!allowedTypes.includes(file.type)) {
            throw new Error('Invalid file type. Allowed: PDF, DOC, DOCX, TXT')
        }
        
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            throw new Error('File too large. Maximum size is 10MB')
        }
    }

    const handleFileSelect = (e) => {
        const file = e.target.files[0]
        if (file) {
            try {
                validateFile(file)
                setSelectedFile(file)
                setFormData(prev => ({
                    ...prev,
                    file: file
                }))
                setErrors(prev => ({
                    ...prev,
                    file: ''
                }))
            } catch (error) {
                setErrors(prev => ({
                    ...prev,
                    file: error.message
                }))
                e.target.value = ''
                setSelectedFile(null)
                setFormData(prev => ({
                    ...prev,
                    file: null
                }))
            }
        }
    }

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const validateForm = () => {
        const newErrors = {}
        
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required'
        }
        
        if (!formData.type) {
            newErrors.type = 'Report type is required'
        }
        
        if (!formData.year_id) {
            newErrors.year_id = 'Year is required'
        }
        
        if (formData.type === 'monthly' && !formData.month_id) {
            newErrors.month_id = 'Month is required for monthly reports'
        }
        
        if (!formData.status) {
            newErrors.status = 'Status is required'
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validateForm()) {
            return
        }
        
        setSubmitLoading(true)
        setErrors({})
        
        try {
            // Create FormData for file upload
            const submitData = new FormData()
            submitData.append('title', formData.title)
            submitData.append('type', formData.type)
            submitData.append('status', formData.status)
            submitData.append('year_id', formData.year_id)
            if (formData.type === 'monthly' && formData.month_id) {
                submitData.append('month_id', formData.month_id)
            }
            if (formData.description) {
                submitData.append('description', formData.description)
            }
            if (formData.file) {
                submitData.append('file', formData.file)
            }
            
            // Auto-generate report date if needed
            if (!formData.report_date) {
                const year = years.find(y => y.id.toString() === formData.year_id)
                if (year) {
                    let reportDate = ''
                    if (formData.type === 'monthly' && formData.month_id) {
                        // Set date to the last day of the selected month
                        const lastDay = new Date(year.year_value, parseInt(formData.month_id), 0).getDate()
                        reportDate = `${year.year_value}-${String(formData.month_id).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
                    } else if (formData.type === 'yearly') {
                        reportDate = `${year.year_value}-12-31`
                    }
                    if (reportDate) {
                        submitData.append('report_date', reportDate)
                    }
                }
            } else {
                submitData.append('report_date', formData.report_date)
            }
            
            // Call the appropriate API endpoint
            let result
            if (formData.type === 'monthly') {
                result = await apiService.updateMonthlyReport(id, submitData)
            } else {
                result = await apiService.updateYearlyReport(id, submitData)
            }
            
            if (result.error) {
                setErrors({ submit: result.error })
            } else {
                navigate('/admin/reports', { 
                    state: { message: 'Report updated successfully' } 
                })
            }
        } catch (error) {
            console.error('Error updating report:', error)
            setErrors({ submit: error.message || 'Failed to update report' })
        } finally {
            setSubmitLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const getMonthName = (monthId) => {
        const month = months.find(m => m.id.toString() === monthId)
        return month ? month.name : 'Unknown'
    }

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="ml-4 text-gray-600">Loading report data...</p>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <nav className="flex items-center space-x-2 mb-2">
                                <button
                                    onClick={() => navigate('/admin/reports')}
                                    className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                                >
                                    ← Back to Reports
                                </button>
                            </nav>
                            <h1 className="text-3xl font-bold text-gray-900">
                                ✏️ Edit Report
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Edit {type} report and manage file uploads
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Submit Error */}
                            {errors.submit && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-red-800">{errors.submit}</p>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Report Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Report Type *
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.type ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="monthly">📅 Monthly Report</option>
                                        <option value="yearly">🗓️ Yearly Report</option>
                                    </select>
                                    {errors.type && (
                                        <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                                    )}
                                </div>

                                {/* Year */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Year *
                                    </label>
                                    <select
                                        name="year_id"
                                        value={formData.year_id}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.year_id ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Select Year</option>
                                        {years.map(year => (
                                            <option key={year.id} value={year.id}>
                                                {year.year_value}
                                                {year.status === 'current' && ' (Current)'}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.year_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.year_id}</p>
                                    )}
                                </div>

                                {/* Month (only for monthly reports) */}
                                {formData.type === 'monthly' && (
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Month *
                                        </label>
                                        <select
                                            name="month_id"
                                            value={formData.month_id}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                errors.month_id ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        >
                                            <option value="">Select Month</option>
                                            {months.map(month => (
                                                <option key={month.id} value={month.id}>
                                                    {month.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.month_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.month_id}</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter report title"
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.title ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Enter report description (optional)"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status *
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.status ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="draft">📝 Draft</option>
                                        <option value="published">✅ Published</option>
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                                    )}
                                </div>

                                {/* File Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Report File {!currentFileUrl && '(Optional)'}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            onChange={handleFileSelect}
                                            accept=".pdf,.doc,.docx,.txt"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    {errors.file && (
                                        <p className="mt-1 text-sm text-red-600">{errors.file}</p>
                                    )}
                                    <p className="mt-1 text-sm text-gray-500">
                                        {currentFileUrl ? 'Upload new file to replace current file' : 'Supported formats: PDF, DOC, DOCX, TXT (Max: 10MB)'}
                                    </p>
                                </div>
                            </div>

                            {/* Current File Info */}
                            {currentFileUrl && !selectedFile && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="font-medium text-blue-900 mb-2">📁 Current File:</h4>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-blue-800">
                                            A file is currently attached to this report
                                        </p>
                                        <a
                                            href={currentFileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors duration-200"
                                        >
                                            👁️ View File
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* New File Info */}
                            {selectedFile && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h4 className="font-medium text-green-900 mb-2">📁 New File Selected:</h4>
                                    <p className="text-sm text-green-800">
                                        <strong>Name:</strong> {selectedFile.name}<br />
                                        <strong>Size:</strong> {formatFileSize(selectedFile.size)}<br />
                                        <strong>Type:</strong> {selectedFile.type}
                                    </p>
                                    {currentFileUrl && (
                                        <p className="text-sm text-green-700 mt-2">
                                            This will replace the current file when you save.
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3 pt-6 border-t">
                                <button
                                    type="button"
                                    onClick={() => navigate('/admin/reports')}
                                    className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitLoading}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    {submitLoading ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Updating...
                                        </span>
                                    ) : (
                                        '✏️ Update Report'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default EditReport
