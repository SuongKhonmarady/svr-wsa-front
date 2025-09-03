import React from 'react';
import ComingSoonPage from '../../../components/ComingSoonPage';

function RepairService() {
    return (
        <div className="min-h-screen bg-gray-50 py-16">
            {/* Content Section */}
            <div className="relative z-10 -mt-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Form Section */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                            <h2 className="text-xl font-semibold text-white">ស្នើសុំសេវាជួសជុល</h2>
                            <p className="text-blue-100 text-sm mt-1">សូមបំពេញព័ត៌មានខាងក្រោមដើម្បីស្នើសុំសេវាជួសជុល</p>
                        </div>
                        
                        <div className="p-6">
                            <ComingSoonPage />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RepairService;
