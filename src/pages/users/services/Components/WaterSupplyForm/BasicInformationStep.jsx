import React from 'react';

function BasicInformationStep({ formData, handleInputChange, categories }) {
    return (
        <div>
            {/* Service Information */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">ព័ត៌មានអំពីសេវាកម្ម</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">សេវាកម្មដែលយើងផ្តល់ឱ្យ:</p>
                            <ul className="space-y-1">
                                <li>• ការដាក់ពាក្រស្នើសុំប្រើប្រាស់ទឹកស្អាត</li>
                                <li>• ការស្នើរសុំប្ដូរឈ្មោះប្រើប្រាស់ទឹកស្អាតរបស់អតិថិជន</li>
                                <li>• ការប្ដូរទំហំនាឡិការទឹក</li>
                                <li>• ការផ្លាស់ប្ដូរទីតាំងនាឡិការទឹក</li>
                                <li>• ថ្លៃទឹកសមរម្យ ចាប់ពី 1200 រៀល/ម³</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Personal Information */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">ព័ត៌មានផ្ទាល់ខ្លួន</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            ឈ្មោះ <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="សូមបញ្ចូលឈ្មោះពេញ"
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                            លេខទូរស័ព្ទ <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="012 345 678"
                            required
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">សូមជ្រើសរើសប្រភេទសេវាកម្ម</option>
                            <option value="ការដាក់ពាក្រស្នើសុំប្រើប្រាស់ទឹកស្អាត">ការដាក់ពាក្រស្នើសុំប្រើប្រាស់ទឹកស្អាត</option>
                            <option value="ការស្នើរសុំប្ដូរឈ្មោះប្រើប្រាស់ទឹកស្អាតរបស់អតិថិជន">ការស្នើរសុំប្ដូរឈ្មោះប្រើប្រាស់ទឹកស្អាតរបស់អតិថិជន</option>
                            <option value="ការប្ដូរទំហំនាឡិការទឹក">ការប្ដូរទំហំនាឡិការទឹក</option>
                            <option value="ការផ្លាស់ប្ដូរទីតាំងនាឡិការទឹក">ការផ្លាស់ប្ដូរទីតាំងនាឡិការទឹក</option>

                        </select>
                    </div>

                    {/* Family Members */}
                    <div>
                        <label htmlFor="family_members" className="block text-sm font-medium text-gray-700 mb-2">
                            ចំនួនសមាជិកគ្រួសារ <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="family_members"
                            name="family_members"
                            value={formData.family_members}
                            onChange={handleInputChange}
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="ចំនួនសមាជិក"
                            required
                        />
                    </div>

                    {/* Female Members */}
                    <div>
                        <label htmlFor="female_members" className="block text-sm font-medium text-gray-700 mb-2">
                            ចំនួនសមាជិកស្រី <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="female_members"
                            name="female_members"
                            value={formData.female_members}
                            onChange={handleInputChange}
                            min="0"
                            max={formData.family_members || 999}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="ចំនួនសមាជិកស្រី"
                            required
                        />
                    </div>

                    {/* Village */}
                    
                </div>
            </div>

            {/* Location Information */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">ព័ត៌មានទីតាំង</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                        <label htmlFor="village" className="block text-sm font-medium text-gray-700 mb-2">
                            ភូមិ <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="village"
                            name="village"
                            value={formData.village}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="ឈ្មោះភូមិ"
                            required
                        />
                    </div>
                    {/* Province */}
                    <div>
                        <label htmlFor="province_id" className="block text-sm font-medium text-gray-700 mb-2">
                            ខេត្ត <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="province_id"
                            name="province_id"
                            value={formData.province_id}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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

                    {/* District */}
                    <div>
                        <label htmlFor="district_id" className="block text-sm font-medium text-gray-700 mb-2">
                            ស្រុក <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="district_id"
                            name="district_id"
                            value={formData.district_id}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">សូមជ្រើសរើសស្រុក</option>
                            {categories.districts && categories.districts.map(district => (
                                <option key={district.id} value={district.id}>
                                    {district.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Commune */}
                    <div>
                        <label htmlFor="commune_id" className="block text-sm font-medium text-gray-700 mb-2">
                            ឃុំ/សង្កាត់ <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="commune_id"
                            name="commune_id"
                            value={formData.commune_id}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">សូមជ្រើសរើសឃុំ/សង្កាត់</option>
                            {categories.communes && categories.communes.map(commune => (
                                <option key={commune.id} value={commune.id}>
                                    {commune.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Additional Information */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">ព័ត៌មានបន្ថែម</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Occupation */}
                    <div>
                        <label htmlFor="occupation_id" className="block text-sm font-medium text-gray-700 mb-2">
                            មុខរបរ <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="occupation_id"
                            name="occupation_id"
                            value={formData.occupation_id}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">សូមជ្រើសរើសមុខរបរ</option>
                            {categories.occupations && categories.occupations.map(occupation => (
                                <option key={occupation.id} value={occupation.id}>
                                    {occupation.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Usage Type */}
                    <div>
                        <label htmlFor="usage_type_id" className="block text-sm font-medium text-gray-700 mb-2">
                            ប្រភេទការប្រើប្រាស់ <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="usage_type_id"
                            name="usage_type_id"
                            value={formData.usage_type_id}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">សូមជ្រើសរើសប្រភេទការប្រើប្រាស់</option>
                            {categories?.usage_types && categories.usage_types.length > 0 ? (
                                categories.usage_types.map(usageType => (
                                    <option key={usageType.id} value={usageType.id}>
                                        {usageType.name}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>No usage types available</option>
                            )}
                        </select>
                    </div>

                    {/* Details */}
                    <div className="md:col-span-2">
                        <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">
                            ព័ត៌មានលម្អិត (ជម្រើស)
                        </label>
                        <textarea
                            id="details"
                            name="details"
                            value={formData.details}
                            onChange={handleInputChange}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="សូមបញ្ជាក់ព័ត៌មានបន្ថែមដែលចាំបាច់..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BasicInformationStep;
