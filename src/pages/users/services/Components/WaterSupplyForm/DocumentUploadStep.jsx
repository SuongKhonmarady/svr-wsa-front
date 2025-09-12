import React from 'react';

function DocumentUploadField({
    label,
    documentKey,
    document,
    documentPreview,
    onDocumentChange,
    onRemoveDocument,
    error
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label} <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                {documentPreview ? (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <img
                                src={documentPreview}
                                alt={`${label} Preview`}
                                className="w-20 h-20 object-cover rounded-lg border"
                            />
                            <div>
                                <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]" title={document?.name}>
                                    {document?.name}
                                </p>
                                <p className="text-sm text-gray-500">{(document?.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => onRemoveDocument(documentKey)}
                            className="text-red-600 hover:text-red-800"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <label htmlFor={documentKey} className='cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 block w-full text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 ease-in-out group'>
                        <svg className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="mt-4">
                            <span className="mt-2 block text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                                ចុចដើម្បីជ្រើសរើស{label}
                            </span>
                            <span className="mt-1 block text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200">
                                PNG, JPG, JPEG តិចជាង 3MB
                            </span>
                            <input
                                id={documentKey}
                                name={documentKey}
                                type="file"
                                accept="image/*"
                                onChange={onDocumentChange}
                                className="sr-only"
                            />
                        </div>
                    </label>
                )}
            </div>
            {/* Error message */}
            {error && (
                <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
                    {error}
                </div>
            )}
        </div>
    );
}

function DocumentUploadStep({
    documents,
    documentPreviews,
    handleDocumentChange,
    handleRemoveDocument,
    documentErrors
}) {
    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">គោលការណ៍ណែនាំសម្រាប់ការថតរូបឯកសារ</h3>
            {/* Document photography guidelines */}
            <div className="mb-2 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Do's Column */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h5 className="font-semibold text-blue-800 mb-3">សូមអនុវត្តតាម</h5>
                        <ul className="text-sm text-blue-700 space-y-2">
                            <li>• ធ្វើការថតរូបឯកសារដោយត្រង់ មិនត្រូវឲ្យវៀចរូបភាពទៅខាងឆ្វេង ឬស្តាំ (មិនត្រូវថតទ្រេត)</li>
                            <li>• ដាក់ឯកសារលើផ្ទៃមានពណ៌ងងឹត</li>
                            <li>• ត្រូវប្រាកដថាមិនមានវត្ថុផ្សេងទៀតនៅក្នុងរូបថត</li>
                        </ul>
                    </div>

                    {/* Don'ts Column */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h5 className="font-semibold text-red-800 mb-3">សូមកុំ</h5>
                        <ul className="text-sm text-red-700 space-y-2">
                            <li>❌ កុំកាត់បន្ថយជ្រុង ឬគែមឯកសារ</li>
                            <li>❌ កុំគ្របទិន្នន័យ ឬព័ត៌មាននៅលើឯកសារ</li>
                            <li>❌ កុំថត ឬបញ្ជូនរូបថតដែលព្រិល (blur)</li>
                        </ul>
                    </div>
                </div>
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-6">អាប់ឡូតឯកសារ</h4>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DocumentUploadField
                        label="អត្តសញ្ញាណប័ណ្ណ (មុខ)"
                        documentKey="id_card_front"
                        document={documents.id_card_front}
                        documentPreview={documentPreviews.id_card_front}
                        onDocumentChange={handleDocumentChange}
                        onRemoveDocument={handleRemoveDocument}
                        error={documentErrors.id_card_front}
                    />

                    <DocumentUploadField
                        label="អត្តសញ្ញាណប័ណ្ណ (ក្រោយ)"
                        documentKey="id_card_back"
                        document={documents.id_card_back}
                        documentPreview={documentPreviews.id_card_back}
                        onDocumentChange={handleDocumentChange}
                        onRemoveDocument={handleRemoveDocument}
                        error={documentErrors.id_card_back}
                    />
                </div>


                <DocumentUploadField
                    label="សៀវភៅគ្រួសារ"
                    documentKey="family_books"
                    document={documents.family_books}
                    documentPreview={documentPreviews.family_books}
                    onDocumentChange={handleDocumentChange}
                    onRemoveDocument={handleRemoveDocument}
                    error={documentErrors.family_books}
                />
            </div>

            {/* Information about document requirements */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">ព័ត៌មានអំពីឯកសារ</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                    <li>• អត្តសញ្ញាណប័ណ្ណ: រូបថតច្បាស់លាស់ទាំងមុខ និងក្រោយ</li>
                    <li>• សៀវភៅគ្រួសារ: រូបថតទំព័រដែលមានព័ត៌មានគ្រួសារ</li>
                    <li>• ទម្រង់ឯកសារ: PNG, JPG, JPEG តិចជាង 3MB</li>
                    <li>• គុណភាពរូបថត: ច្បាស់លាស់ និងអាចអានបាន</li>
                </ul>
            </div>
        </div>
    );
}

export default DocumentUploadStep;
