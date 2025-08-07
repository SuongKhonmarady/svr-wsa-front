import React from 'react';

function BasicInformationStep({ formData, handleInputChange }) {
    return (
        <div>
            {/* Service Information */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">ព័ត៌មានអំពីសេវាកម្ម</h3>
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
                                • ទឹកស្អាតគុណភាពខ្ពស់តាមស្តង់ដារអន្តរជាតិ<br />
                                • ការផ្គត់ផ្គង់ទៀងទាត់ ២៤/៧<br />
                                • ប្រព័ន្ធបំពង់ទំនើប និងសុវត្ថិភាព<br />
                                • តម្លៃសមរម្យ ចាប់ពី 1200 រៀល/ម³
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            ឈ្មោះជាភាសាខ្មែរ <span className="text-red-500">*</span>
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
            </form>
            
        </div>
    );
}

export default BasicInformationStep;
