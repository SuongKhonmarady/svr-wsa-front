import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../../../services/api';

function RepairServiceForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState({});
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        province_id: '',
        district_id: '',
        commune_id: '',
        village: '',
        address: '',
        repair_type: '',
        problem_description: '',
        urgency_level: 'medium',
        preferred_contact_time: 'anytime',
        additional_notes: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await apiService.getServiceRequestCategories();
            if (response.data && response.data.success) {
                setCategories(response.data.data);
            } else if (response.data) {
                setCategories(response.data);
            }
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        } finally {
            setCategoriesLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Reset dependent fields when province/district changes
        if (name === 'province_id') {
            setFormData(prev => ({
                ...prev,
                district_id: '',
                commune_id: ''
            }));
        } else if (name === 'district_id') {
            setFormData(prev => ({
                ...prev,
                commune_id: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await apiService.submitRepairServiceRequest(formData);
            
            if (response.data && response.data.success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/services');
                }, 3000);
            } else {
                setError(response.error || 'Failed to submit repair request');
            }
        } catch (err) {
            setError('Failed to submit repair request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getDisplayName = (id, categoryType) => {
        if (!id || !categories[categoryType]) return '';
        const category = categories[categoryType].find(cat => cat.id === parseInt(id));
        return category ? category.name : id;
    };

    if (success) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">ស្នើសុំជោគជ័យ!</h3>
                <p className="text-gray-600 mb-4">យើងបានទទួលស្នើសុំជួសជុលរបស់អ្នកហើយ នឹងទាក់ទងអ្នកឆាប់ៗ</p>
                <div className="animate-pulse text-sm text-blue-600">កំពុងផ្លាស់ទីទៅទំព័រសេវាកម្ម...</div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="text-red-800">{error}</span>
                    </div>
                </div>
            )}

            {/* Personal Information */}
            <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    ព័ត៌មានផ្ទាល់ខ្លួន
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            ឈ្មោះពេញ <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            លេខទូរស័ព្ទ <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Location Information */}
            <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    ទីតាំង
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            ខេត្ត <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="province_id"
                            value={formData.province_id}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">សូមជ្រើសរើសខេត្ត</option>
                            {categories.provinces && categories.provinces.map(province => (
                                <option key={province.id} value={province.id}>
                                    {province.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            ស្រុក <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="district_id"
                            value={formData.district_id}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            disabled={!formData.province_id}
                        >
                            <option value="">សូមជ្រើសរើសស្រុក</option>
                            {categories.districts && categories.districts
                                .filter(district => !formData.province_id || district.province_id === parseInt(formData.province_id))
                                .map(district => (
                                    <option key={district.id} value={district.id}>
                                        {district.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            ឃុំ/សង្កាត់ <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="commune_id"
                            value={formData.commune_id}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            disabled={!formData.district_id}
                        >
                            <option value="">សូមជ្រើសរើសឃុំ/សង្កាត់</option>
                            {categories.communes && categories.communes
                                .filter(commune => !formData.district_id || commune.district_id === parseInt(formData.district_id))
                                .map(commune => (
                                    <option key={commune.id} value={commune.id}>
                                        {commune.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            ភូមិ
                        </label>
                        <input
                            type="text"
                            name="village"
                            value={formData.village}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    
                    <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            អាសយដ្ឋានលម្អិត <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="សូមបញ្ជាក់អាសយដ្ឋានលម្អិត..."
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Repair Information */}
            <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-emerald-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    ព័ត៌មានជួសជុល
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            ប្រភេទជួសជុល <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="repair_type"
                            value={formData.repair_type}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">សូមជ្រើសរើសប្រភេទជួសជុល</option>
                            <option value="pipe_leak">រន្ធទឹករលាយ</option>
                            <option value="water_meter">ម៉ែត្រទឹក</option>
                            <option value="valve">វាល</option>
                            <option value="pump">ម៉ាស៊ីនបូមទឹក</option>
                            <option value="connection">ការតភ្ជាប់</option>
                            <option value="other">ផ្សេងទៀត</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            កម្រិតភាពអាសន្ន <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="urgency_level"
                            value={formData.urgency_level}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="low">ទាប (អាចរង់ចាំបាន)</option>
                            <option value="medium">មធ្យម (ធម្មតា)</option>
                            <option value="high">ខ្ពស់ (អាសន្ន)</option>
                            <option value="emergency">អាសន្នខ្លាំង (គ្រោះថ្នាក់)</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            ពេលវេលាចូលចិត្តទាក់ទង
                        </label>
                        <select
                            name="preferred_contact_time"
                            value={formData.preferred_contact_time}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="anytime">ពេលណាក៏បាន</option>
                            <option value="morning">ព្រឹក (៨:០០ - ១២:០០)</option>
                            <option value="afternoon">រសៀល (១២:០០ - ៥:០០)</option>
                            <option value="evening">ល្ងាច (៥:០០ - ៨:០០)</option>
                        </select>
                    </div>
                </div>
                
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        ការពិពណ៌នាបញ្ហា <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="problem_description"
                        value={formData.problem_description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="សូមពិពណ៌នាបញ្ហាដែលអ្នកប្រឈមមុខ..."
                        required
                    />
                </div>
                
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        កំណត់សម្គាល់បន្ថែម
                    </label>
                    <textarea
                        name="additional_notes"
                        value={formData.additional_notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="ព័ត៌មានបន្ថែមផ្សេងទៀត..."
                    />
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={() => navigate('/services')}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                    បោះបង់
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            កំពុងដាក់ស្នើ...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            ដាក់ស្នើស្នើសុំ
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

export default RepairServiceForm;
