import React from 'react';

function ReviewStep({ formData, documentPreviews, categories, privacyAccepted, onPrivacyChange }) {
    // Helper function to get display names from IDs
    const getDisplayName = (id, categoryType) => {
        if (!id || !categories[categoryType]) return '';
        const item = categories[categoryType].find(cat => cat.id === parseInt(id));
        return item ? item.name : '';
    };

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-6">ពិនិត្យមើលព័ត៌មាន</h3>

            {/* Personal Information Review */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-gray-800 mb-4">ព័ត៌មានផ្ទាល់ខ្លួន</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <span className="text-sm text-gray-600">ឈ្មោះជាភាសាខ្មែរ:</span>
                        <p className="font-medium">{formData.name}</p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600">លេខទូរស័ព្ទ:</span>
                        <p className="font-medium">{formData.phone}</p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600">ប្រភេទសេវាកម្ម:</span>
                        <p className="font-medium">{formData.service_type}</p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600">ចំនួនសមាជិកគ្រួសារ:</span>
                        <p className="font-medium">{formData.family_members} នាក់</p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600">ចំនួនសមាជិកស្រី:</span>
                        <p className="font-medium">{formData.female_members} នាក់</p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600">ភូមិ:</span>
                        <p className="font-medium">{formData.village}</p>
                    </div>
                </div>
            </div>

            {/* Location Information Review */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-gray-800 mb-4">ព័ត៌មានទីតាំង</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <span className="text-sm text-gray-600">ខេត្ត:</span>
                        <p className="font-medium">{getDisplayName(formData.province_id, 'provinces')}</p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600">ស្រុក:</span>
                        <p className="font-medium">{getDisplayName(formData.district_id, 'districts')}</p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600">ឃុំ:</span>
                        <p className="font-medium">{getDisplayName(formData.commune_id, 'communes')}</p>
                    </div>
                </div>
            </div>

            {/* Additional Information Review */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-gray-800 mb-4">ព័ត៌មានបន្ថែម</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <span className="text-sm text-gray-600">មុខរបរ:</span>
                        <p className="font-medium">{getDisplayName(formData.occupation_id, 'occupations')}</p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600">ប្រភេទការប្រើប្រាស់:</span>
                        <p className="font-medium">{getDisplayName(formData.usage_type_id, 'usage_types')}</p>
                    </div>
                    {formData.details && (
                        <div className="md:col-span-2">
                            <span className="text-sm text-gray-600">ព័ត៌មានលម្អិត:</span>
                            <p className="font-medium">{formData.details}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Documents Review */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-800 mb-4">ឯកសារដែលបានអាប់ឡូត</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* ID Card Front */}
                    <div>
                        <span className="text-sm text-gray-600 block mb-2">អត្តសញ្ញាណប័ណ្ណ (ផ្នែកខាងមុខ):</span>
                        {documentPreviews.id_card_front && (
                            <img
                                src={documentPreviews.id_card_front}
                                alt="ID Card Front"
                                className="w-32 h-32 object-cover rounded-lg border"
                            />
                        )}
                    </div>

                    {/* ID Card Back */}
                    <div>
                        <span className="text-sm text-gray-600 block mb-2">អត្តសញ្ញាណប័ណ្ណ (ផ្នែកខាងក្រោយ):</span>
                        {documentPreviews.id_card_back && (
                            <img
                                src={documentPreviews.id_card_back}
                                alt="ID Card Back"
                                className="w-32 h-32 object-cover rounded-lg border"
                            />
                        )}
                    </div>

                    {/* Family Book */}
                    <div>
                        <span className="text-sm text-gray-600 block mb-2">សៀវភៅគ្រួសារ:</span>
                        {documentPreviews.family_books && (
                            <img
                                src={documentPreviews.family_books}
                                alt="Family Book"
                                className="w-32 h-32 object-cover rounded-lg border"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Privacy Policy Checkbox */}
            <div className="bg-blue-50 rounded-lg p-6 mt-6 border border-blue-200">
                <div className="flex items-start space-x-3">
                    <input
                        type="checkbox"
                        id="privacy-policy"
                        checked={privacyAccepted}
                        onChange={onPrivacyChange}
                        className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        required
                    />
                    <div className="flex-1">
                        <label htmlFor="privacy-policy" className="text-sm text-gray-700 leading-relaxed">
                            <span className="font-medium text-gray-900">ខ្ញុំបានអាន និងយល់ស្រប</span> នឹង{' '}
                            <a 
                                href="/privacy" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline font-medium"
                            >
                                គោលនយោបាយឯកជនភាព
                            </a>{' '}
                            <span className="text-red-600 font-medium">*</span>
                            របស់រដ្ឋករទឹកស្វាយរៀង។ ខ្ញុំផ្តល់ការអនុញ្ញាតឱ្យរដ្ឋករទឹកស្វាយរៀងប្រមូល ប្រើប្រាស់ និងរក្សាទុកព័ត៌មានផ្ទាល់ខ្លួនរបស់ខ្ញុំដើម្បីផ្តល់សេវាកម្មទឹក។
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                            I have read and agree to the{' '}
                            <a 
                                href="/privacy" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline"
                            >
                                Privacy Policy
                            </a>{' '}
                            <span className="text-red-600">*</span>
                            of Svay Rieng Water Utility. I consent to Svay Rieng Water Utility collecting, using, and storing my personal information for water service provision.
                        </p>
                        <p className="text-sm text-red-600 mt-1 font-medium">
                            * ចំណាំ: ត្រូវបំពេញគោលនយោបាយឯកជនភាព ដើម្បីស្នើសុំសេវាកម្ម
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default ReviewStep;
