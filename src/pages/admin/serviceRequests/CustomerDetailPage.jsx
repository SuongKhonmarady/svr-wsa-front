import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../../../services/api';
import config from '../../../config/api';
import AdminLayout from '../components/AdminLayout';
import ImageModal from './components/ImageModal';
import { isAuthenticatedAdmin, getAuthToken } from '../../../utils/auth';

function CustomerDetailPage() {
    const { requestId } = useParams();
    const navigate = useNavigate();
    const [customerDetail, setCustomerDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [categories, setCategories] = useState({});
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (requestId) {
            // Check authentication first
            if (!isAuthenticatedAdmin()) {
                console.error('User not authenticated as admin');
                setError('Authentication required. Please log in as admin.');
                return;
            }
            
            console.log('Auth token:', getAuthToken());
            console.log('LocalStorage admin_token:', localStorage.getItem('admin_token'));
            console.log('LocalStorage admin_user:', localStorage.getItem('admin_user'));
            
            // Test API connectivity first
            testApiConnection();
            
            fetchCustomerDetail();
            fetchCategories();
        }
    }, [requestId]);

    const testApiConnection = async () => {
        try {
            console.log('Testing API connection...');
            const response = await fetch(`${config.BASE_URL}/admin/service-requests`, {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Accept': 'application/json'
                }
            });
            console.log('API test response status:', response.status);
            console.log('API test response ok:', response.ok);
            
            if (!response.ok) {
                console.error('API test failed with status:', response.status);
            }
        } catch (err) {
            console.error('API test error:', err);
        }
    };

    const fetchCustomerDetail = async () => {
        try {
            setLoading(true);
            setError('');
            console.log('Fetching customer detail for request ID:', requestId);
            console.log('API Base URL:', config.BASE_URL);
            console.log('Full endpoint:', `${config.BASE_URL}/admin/service-requests/${requestId}`);
            const response = await apiService.getAdminServiceRequestById(requestId);
            console.log('Customer detail response:', response);
            
            if (response.data && response.data.success) {
                console.log('Setting customer detail from success response:', response.data.data);
                setCustomerDetail(response.data.data);
            } else if (response.data && response.data.id) {
                console.log('Setting customer detail from direct data:', response.data);
                setCustomerDetail(response.data);
            } else if (response.error) {
                console.error('API returned error:', response.error);
                setError(response.error);
            } else {
                console.error('Unexpected response format:', response);
                setError('Failed to load customer details - unexpected response format');
            }
        } catch (err) {
            console.error('Exception in fetchCustomerDetail:', err);
            setError('Failed to fetch customer details');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            console.log('Fetching categories...');
            const response = await apiService.getServiceRequestCategories();
            console.log('Categories response:', response);
            
            if (response.data && response.data.success) {
                console.log('Setting categories from success response:', response.data.data);
                setCategories(response.data.data);
            } else if (response.data) {
                console.log('Setting categories from direct data:', response.data);
                setCategories(response.data);
            } else if (response.error) {
                console.error('Error fetching categories:', response.error);
                // Set empty categories to prevent further errors
                setCategories({});
            } else {
                console.error('Unexpected response format for categories:', response);
                setCategories({});
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
            // Set empty categories to prevent further errors
            setCategories({});
        } finally {
            setCategoriesLoading(false);
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
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'in progress':
            case 'in-progress':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'completed':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-slate-100 text-slate-800 border-slate-200';
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

    // Helper function to get display name from ID
    const getDisplayName = (id, categoryType) => {
        if (!id) {
            return 'N/A';
        }
        
        if (!categories[categoryType] || !Array.isArray(categories[categoryType])) {
            if (categoriesLoading) {
                return `${id} (Loading...)`;
            }
            // If categories failed to load, just return the ID
            return id;
        }
        
        const categoryArray = categories[categoryType];
        
        const category = categoryArray.find(cat => cat.id === parseInt(id));
        
        if (!category) {
            console.warn(`CustomerDetailPage Category not found for ${categoryType} with id ${id}. Available categories:`, categoryArray);
        }
        
        return category ? category.name : id;
    };

    const DocumentViewer = ({ documents, type, title }) => {
        if (!documents || (Array.isArray(documents) && documents.length === 0)) {
            return (
                <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <svg className="mx-auto h-16 w-16 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg font-medium">No {title.toLowerCase()} uploaded</p>
                    <p className="text-sm text-slate-400 mt-1">Documents will appear here once uploaded</p>
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
                            className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden cursor-pointer hover:shadow-lg hover:border-slate-300 transition-all duration-200"
                            onClick={() => openImageModal(filename, type, title)}
                        >
                            <div className="relative w-full h-48">
                                {/* Document Placeholder Thumbnail */}
                                <div className="w-full h-48 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-slate-400 group-hover:from-slate-100 group-hover:to-slate-200 transition-all duration-200">
                                    <div className="text-center">
                                        <div className="w-16 h-16 mx-auto mb-3 bg-white rounded-lg shadow-sm flex items-center justify-center">
                                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-600">{type === 'id_card' ? 'ID Card' : 'Family Book'}</p>
                                        <p className="text-xs text-slate-500">{label}</p>
                                    </div>
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center pointer-events-none">
                                    <svg className="w-8 h-8 text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                            </div>
                            
                            {/* Document Label */}
                            <div className="p-4 bg-white">
                                <p className="text-sm font-semibold text-slate-700 truncate" title={filename}>
                                    {label}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    Click to view document
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const InfoCard = ({ title, children, icon, className = "" }) => (
        <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}>
            <div className="flex items-center mb-4">
                {icon && (
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                        {icon}
                    </div>
                )}
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            </div>
            {children}
        </div>
    );

    const InfoRow = ({ label, value, className = "" }) => (
        <div className={`flex flex-col sm:flex-row sm:items-center py-3 border-b border-slate-100 last:border-b-0 ${className}`}>
            <dt className="text-sm font-medium text-slate-600 min-w-[120px] mb-1 sm:mb-0">{label}</dt>
            <dd className="text-sm text-slate-900 font-medium">{value || 'N/A'}</dd>
        </div>
    );

    if (loading) {
        return (
            <AdminLayout>
                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="relative">
                                <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                            </div>
                            <p className="mt-6 text-lg text-slate-600 font-medium">Loading customer details...</p>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-xl shadow-lg border border-red-200 p-8 max-w-2xl mx-auto">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900 mb-2">Error Loading Customer Details</h3>
                                <p className="text-slate-600 mb-6">{error}</p>
                                
                                {/* Debug Information */}
                                <div className="bg-slate-50 rounded-lg p-4 text-left text-sm mb-6">
                                    <h4 className="font-medium mb-3 text-slate-700">Debug Information:</h4>
                                    <div className="space-y-2">
                                        <p><strong>Request ID:</strong> <span className="font-mono text-slate-600">{requestId}</span></p>
                                        <p><strong>Auth Token:</strong> <span className={getAuthToken() ? 'text-green-600' : 'text-red-600'}>{getAuthToken() ? 'Present' : 'Missing'}</span></p>
                                        <p><strong>Admin User:</strong> <span className={localStorage.getItem('admin_user') ? 'text-green-600' : 'text-red-600'}>{localStorage.getItem('admin_user') ? 'Present' : 'Missing'}</span></p>
                                        <p><strong>Is Authenticated Admin:</strong> <span className={isAuthenticatedAdmin() ? 'text-green-600' : 'text-red-600'}>{isAuthenticatedAdmin() ? 'Yes' : 'No'}</span></p>
                                        <p><strong>API Base URL:</strong> <span className="font-mono text-slate-600">{config.BASE_URL}</span></p>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <button
                                        onClick={() => {
                                            console.log('Current localStorage:', {
                                                admin_token: localStorage.getItem('admin_token'),
                                                admin_user: localStorage.getItem('admin_user')
                                            });
                                            console.log('Auth check:', isAuthenticatedAdmin());
                                        }}
                                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                    >
                                        Debug Auth Status
                                    </button>
                                    <button
                                        onClick={() => navigate('/admin/service-requests')}
                                        className="bg-slate-600 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors font-medium"
                                    >
                                        Back to Service Requests
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (!customerDetail) {
        return (
            <AdminLayout>
                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">Customer Not Found</h3>
                            <p className="text-slate-600 mb-6">The requested customer details could not be found.</p>
                            <button
                                onClick={() => navigate('/admin/service-requests')}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Back to Service Requests
                            </button>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '📋' },
        { id: 'documents', label: 'Documents', icon: '📄' },
        { id: 'timeline', label: 'Timeline', icon: '⏰' }
    ];

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div className="mb-4 lg:mb-0">
                                <button
                                    onClick={() => navigate('/admin/service-requests')}
                                    className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back to Service Requests
                                </button>
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                                        {customerDetail.name?.charAt(0)?.toUpperCase() || 'C'}
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-slate-900">
                                            {customerDetail.name}
                                        </h1>
                                        <p className="text-slate-600">Request #{customerDetail.id} • Customer Details</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Status Badge */}
                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <p className="text-sm text-slate-500">Current Status</p>
                                    <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full border ${getStatusColor(customerDetail.status?.name)}`}>
                                        {customerDetail.status?.name || 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Privacy Notice */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
                        <div className="flex items-start">
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-amber-800 mb-2">Privacy Notice</h3>
                                <p className="text-amber-700">
                                    This page contains sensitive customer documents including ID cards and family books. 
                                    Handle all information with strict confidentiality and in accordance with data protection regulations.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 mb-8">
                        <div className="flex space-x-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                                        activeTab === tab.id
                                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            {/* Customer Information */}
                            <InfoCard 
                                title="Customer Information" 
                                icon={<svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Full Name</p>
                                        <p className="text-lg font-semibold text-slate-900">{customerDetail.name}</p>
                                    </div>
                                    {customerDetail.phone && (
                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Phone</p>
                                            <p className="text-lg font-semibold text-slate-900">{customerDetail.phone}</p>
                                        </div>
                                    )}
                                    {customerDetail.email && (
                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Email</p>
                                            <p className="text-lg font-semibold text-slate-900">{customerDetail.email}</p>
                                        </div>
                                    )}
                                </div>
                            </InfoCard>

                            {/* Family Information */}
                            <InfoCard 
                                title="Family Information" 
                                icon={<svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {customerDetail.family_members && (
                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Total Family Members</p>
                                            <p className="text-2xl font-bold text-green-600">{customerDetail.family_members}</p>
                                            <p className="text-sm text-slate-500">members</p>
                                        </div>
                                    )}
                                    {customerDetail.female_members && (
                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Female Members</p>
                                            <p className="text-2xl font-bold text-pink-600">{customerDetail.female_members}</p>
                                            <p className="text-sm text-slate-500">members</p>
                                        </div>
                                    )}
                                </div>
                            </InfoCard>

                            {/* Location Information */}
                            <InfoCard 
                                title="Location Information" 
                                icon={<svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    {categoriesLoading && (
                                        <div className="flex items-center text-sm text-blue-600">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                            Loading categories...
                                        </div>
                                    )}
                                    {!categoriesLoading && Object.keys(categories).length === 0 && (
                                        <div className="flex items-center text-sm text-amber-600">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                            Categories unavailable
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {customerDetail.village && (
                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Village</p>
                                            <p className="font-semibold text-slate-900">{customerDetail.village}</p>
                                        </div>
                                    )}
                                    {customerDetail.province_id && (
                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Province</p>
                                            <p className="font-semibold text-slate-900">{getDisplayName(customerDetail.province_id, 'provinces')}</p>
                                        </div>
                                    )}
                                    {customerDetail.district_id && (
                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">District</p>
                                            <p className="font-semibold text-slate-900">{getDisplayName(customerDetail.district_id, 'districts')}</p>
                                        </div>
                                    )}
                                    {customerDetail.commune_id && (
                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Commune</p>
                                            <p className="font-semibold text-slate-900">{getDisplayName(customerDetail.commune_id, 'communes')}</p>
                                        </div>
                                    )}
                                </div>
                            </InfoCard>

                            {/* Additional Information */}
                            <InfoCard 
                                title="Additional Information" 
                                icon={<svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {customerDetail.occupation_id && (
                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Occupation</p>
                                            <p className="font-semibold text-slate-900">{getDisplayName(customerDetail.occupation_id, 'occupations')}</p>
                                        </div>
                                    )}
                                    {customerDetail.usage_type_id && (
                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Usage Type</p>
                                            <p className="font-semibold text-slate-900">{getDisplayName(customerDetail.usage_type_id, 'usage_types')}</p>
                                        </div>
                                    )}
                                </div>
                            </InfoCard>

                            {/* Service Information */}
                            <InfoCard 
                                title="Service Information" 
                                icon={<svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>}
                            >
                                <div className="space-y-4">
                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Service Type</p>
                                        <p className="font-semibold text-slate-900">{customerDetail.service_type}</p>
                                    </div>
                                    {customerDetail.details && (
                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Details</p>
                                            <p className="text-slate-900 whitespace-pre-wrap">{customerDetail.details}</p>
                                        </div>
                                    )}
                                </div>
                            </InfoCard>
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div className="space-y-8">
                            {/* ID Documents */}
                            <InfoCard 
                                title="ID Documents" 
                                icon={<svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                </svg>}
                            >
                                <DocumentViewer 
                                    documents={customerDetail.id_card}
                                    type="id_card"
                                    title="ID Documents"
                                />
                            </InfoCard>

                            {/* Family Books */}
                            <InfoCard 
                                title="Family Books" 
                                icon={<svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>}
                            >
                                <DocumentViewer 
                                    documents={customerDetail.family_book}
                                    type="family_book"
                                    title="Family Books"
                                />
                            </InfoCard>
                        </div>
                    )}

                    {activeTab === 'timeline' && (
                        <div className="space-y-8">
                            <InfoCard 
                                title="Request Timeline" 
                                icon={<svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                                        <div className="flex items-center mb-3">
                                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Created</p>
                                                <p className="text-lg font-semibold text-blue-900">{formatDate(customerDetail.created_at)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
                                        <div className="flex items-center mb-3">
                                            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Last Updated</p>
                                                <p className="text-lg font-semibold text-emerald-900">{formatDate(customerDetail.updated_at)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </InfoCard>
                        </div>
                    )}
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
