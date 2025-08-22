import React from 'react';

function ReviewStep({ formData, documentPreviews, categories }) {
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
        </div>
    );
}

export default ReviewStep;
