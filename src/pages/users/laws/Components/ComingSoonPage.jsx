import React from 'react';

function ComingSoonPage() {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Construction Icon */}
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 font-khmer-title">
          កំពុងអភិវឌ្ឍន៍
        </h1>
        
        <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6">
          Coming Soon
        </h2>

        {/* Description */}
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          ទំព័រច្បាប់ និងបទបញ្ញត្តិកំពុងស្ថិតក្នុងដំណើរការអភិវឌ្ឍន៍។ 
          យើងកំពុងធ្វើការងារយ៉ាងល្អិតល្អន់ដើម្បីផ្តល់ព័ត៌មានគ្រប់ជ្រុងជ្រោយ។
        </p>

        <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
          The Laws and Regulations page is currently under development. 
          We're working hard to provide comprehensive information for you.
        </p>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="bg-gray-200 rounded-full h-3 max-w-md mx-auto">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full w-3/4 animate-pulse"></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">75% Complete</p>
        </div>

        {/* Features Coming Soon */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">ឯកសារច្បាប់</h3>
            <p className="text-sm text-gray-600">Legal documents and regulations</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">ការស្វែងរក</h3>
            <p className="text-sm text-gray-600">Advanced search functionality</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">ការបកស្រាយ</h3>
            <p className="text-sm text-gray-600">Detailed explanations and guides</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">ការទាញយក</h3>
            <p className="text-sm text-gray-600">PDF downloads and resources</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-8 rounded-2xl border border-blue-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            ចង់ដឹងព័ត៌មានបន្ថែម?
          </h3>
          <p className="text-gray-700 mb-6">
            ប្រសិនបើអ្នកចង់ដឹងព័ត៌មានបន្ថែមអំពីច្បាប់ និងបទបញ្ញត្តិ 
            សូមទាក់ទងមកយើងខ្ញុំ។
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
              ទាក់ទងយើង
            </button>
            <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-medium">
              ត្រឡប់ទៅទំព័រដើម
            </button>
          </div>
        </div>

        {/* Estimated Completion */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            តម្រូវឱ្យបញ្ចប់: <span className="font-semibold text-gray-700">ខែក្រោយ</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Estimated completion: Next month
          </p>
        </div>
      </div>
    </div>
  );
}

export default ComingSoonPage;
