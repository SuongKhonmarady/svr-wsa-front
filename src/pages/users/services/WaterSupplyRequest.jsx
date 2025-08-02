import React, { useState } from 'react';
import apiService from '../../../services/api';

function WaterSupplyRequest() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        service_type: 'Water Supply',
        details: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage({ type: '', text: '' });

        try {
            const response = await apiService.submitServiceRequest(formData);
            if (response.data && response.data.success) {
                setSubmitMessage({ 
                    type: 'success', 
                    text: response.data.message || 'Your service request has been submitted successfully!' 
                });
                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    address: '',
                    service_type: 'Water Supply',
                    details: ''
                });
            } else if (response.error) {
                setSubmitMessage({ 
                    type: 'error', 
                    text: response.error || 'Failed to submit service request. Please try again.' 
                });
            }
        } catch (error) {
            setSubmitMessage({ 
                type: 'error', 
                text: error.message || 'Failed to submit service request. Please try again.' 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1577495508048-b635879837f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')"
            }}
        >
            {/* Page Header */}
            <div className="relative bg-gradient-to-r from-blue-600/30 via-blue-800/80 to-blue-800/50 text-white py-16 lg:py-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-khmer-title">
                            សំណើសេវាកម្មផ្គត់ផ្គង់ទឹកស្អាត
                        </h1>
                        <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                            ដាក់ពាក្យសុំសេវាកម្មផ្គត់ផ្គង់ទឹកស្អាតសម្រាប់ផ្ទះ ឬអាជីវកម្មរបស់អ្នក
                        </p>
                    </div>
                </div>

                {/* Decorative wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg className="w-full h-8" viewBox="0 0 100 20" fill="none" preserveAspectRatio="none">
                        <path d="M0 20L100 0V20H0Z" fill="rgb(255 255 255)" />
                    </svg>
                </div>
            </div>

            {/* Service Request Form */}
            <div className="bg-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                        {/* Form Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                            <h2 className="text-2xl font-bold text-white">សំណើសេវាកម្មផ្គត់ផ្គង់ទឹកស្អាត</h2>
                            <p className="text-blue-100 mt-2">
                                សូមបំពេញព័ត៌មានខាងក្រោម ដើម្បីដាក់ពាក្យសុំសេវាកម្មផ្គត់ផ្គង់ទឹកស្អាត
                            </p>
                        </div>

                        {/* Form Content */}
                        <div className="px-8 py-6">
                            {/* Service Information */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">ព័ត៌មានសេវាកម្ម</h3>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-blue-800">សេវាកម្មផ្គត់ផ្គង់ទឹកស្អាត</h4>
                                            <p className="text-blue-700 text-sm mt-1">
                                                • ទឹកស្អាតគុណភាពខ្ពស់តាមស្តង់ដារអន្តរជាតិ<br/>
                                                • ការផ្គត់ផ្គង់ទៀងទាត់ ២៤/៧<br/>
                                                • ប្រព័ន្ធបំពង់ទំនើប និងសុវត្ថិភាព<br/>
                                                • តម្លៃសមរម្យ ចាប់ពី 1200 រៀល/ម³
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Message */}
                            {submitMessage.text && (
                                <div className={`mb-6 p-4 rounded-lg ${
                                    submitMessage.type === 'success' 
                                        ? 'bg-green-50 border border-green-200 text-green-800' 
                                        : 'bg-red-50 border border-red-200 text-red-800'
                                }`}>
                                    <div className="flex items-center">
                                        {submitMessage.type === 'success' ? (
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        )}
                                        {submitMessage.text}
                                    </div>
                                </div>
                            )}

                            {/* Request Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            ឈ្មោះពេញ <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                            placeholder="បញ្ចូលឈ្មោះពេញរបស់អ្នក"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            អ៊ីម៉ែល (បំពេញប្រសិនមាន - បើអត់អាចរំលងបាន)
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                            placeholder="example@email.com"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                            លេខទូរស័ព្ទ
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                            placeholder="010 123 456"
                                        />
                                    </div>

                                    {/* Service Type */}
                                    <div>
                                        <label htmlFor="service_type" className="block text-sm font-medium text-gray-700 mb-2">
                                            ប្រភេទសេវាកម្ម <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="service_type"
                                            name="service_type"
                                            value={formData.service_type}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        >
                                            <option value="Water Supply">ការផ្គត់ផ្គង់ទឹកស្អាត</option>
                                            <option value="Water Connection">ការតភ្ជាប់ប្រព័ន្ធទឹក</option>
                                            <option value="Water Meter Installation">ការដំឡើងឧបករណ៍វាស់ទឹក</option>
                                            <option value="Water Quality Testing">ការតេស្តគុណភាពទឹក</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Address */}
                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                        អាសយដ្ឋាន
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        placeholder="បញ្ចូលអាសយដ្ឋានពេញលេញ"
                                    />
                                </div>

                                {/* Details */}
                                <div>
                                    <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">
                                        ព័ត៌មានលម្អិត
                                    </label>
                                    <textarea
                                        id="details"
                                        name="details"
                                        value={formData.details}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                                        placeholder="បញ្ចូលព័ត៌មានលម្អិតអំពីការស្នើសុំរបស់អ្នក..."
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end pt-6">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
                                            isSubmitting
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transform hover:-translate-y-0.5'
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                កំពុងដាក់ស្នើ...
                                            </div>
                                        ) : (
                                            'ដាក់ស្នើសុំសេវាកម្ម'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">ព័ត៌មានបន្ថែម</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-2">ពេលវេលាដំណើរការ</h4>
                                <p className="text-gray-600">
                                    • ច័ន្ទ - សុក្រ: ៧:០០ - ១៧:០០<br/>
                                    • សៅរ៍: ៧:០០ - ១២:០០<br/>
                                    • អាទិត្យ: បិទ
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-2">ការទាក់ទងបន្ទាន់</h4>
                                <p className="text-gray-600">
                                    • ទូរស័ព្ទ: 023 123 456<br/>
                                    • Hotline: 1800 (ឥតគិតថ្លៃ)<br/>
                                    • អ៊ីម៉ែល: info@watersupply.gov.kh
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WaterSupplyRequest;
