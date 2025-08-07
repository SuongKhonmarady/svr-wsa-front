import React from 'react';

function AdditionalInformation() {
    return (
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">ព័ត៌មានបន្ថែម</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-semibold text-gray-700 mb-2">ពេលវេលានិងម៉ោងធ្វើការ</h4>
                    <p className="text-gray-600">
                        • ច័ន្ទ - សុក្រ <br />
                        • ពេលព្រឹក 7:30-12:00 <br />
                        • ពេលថ្ងៃ 14:00-17:00<br />
                        • សៅរ៍-អាទិត្យ: បិទ
                    </p>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-700 mb-2">ទំនាក់ទំនង</h4>
                    <p className="text-gray-600">
                        • ទូរស័ព្ទ: 023 123 456<br />
                        • អ៊ីម៉ែល: info@watersupply.gov.kh
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AdditionalInformation;
