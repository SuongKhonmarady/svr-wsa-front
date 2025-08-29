import React from 'react';

function ComingSoonPage({ 
  title = "កំពុងអភិវឌ្ឍន៍",
  subtitle = "Coming Soon",
  description = "ទំព័រនេះកំពុងស្ថិតក្នុងដំណើរការអភិវឌ្ឍន៍។ យើងកំពុងធ្វើការងារយ៉ាងល្អិតល្អន់ដើម្បីផ្តល់ព័ត៌មានគ្រប់ជ្រុងជ្រោយ។",
  englishDescription = "This page is currently under development. We're working hard to provide comprehensive information for you.",
  progress = 75,
  features = [
    { icon: "📄", title: "ឯកសារ", subtitle: "Documents & Resources" },
    { icon: "🔍", title: "ការស្វែងរក", subtitle: "Search Functionality" },
    { icon: "📚", title: "ការបកស្រាយ", subtitle: "Detailed Guides" },
    { icon: "⬇️", title: "ការទាញយក", subtitle: "Downloads" }
  ],
  estimatedCompletion = "ខែក្រោយ",
  estimatedCompletionEn = "Next month",
  showContact = true,
  showHomeButton = true,
  customBackground = null
}) {
  return (
    <div className="py-36 bg-white">
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
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 font-khmer-title">
          {title}
        </h2>
        
        <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6">
          {subtitle}
        </h2>

        {/* Description */}
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>

        <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
          {englishDescription}
        </p>

        {/* Progress Bar */}
        {/* <div className="mb-12">
          <div className="bg-gray-200 rounded-full h-3 max-w-md mx-auto">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full animate-pulse"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">{progress}% Complete</p>
        </div> */}

        {/* Features Coming Soon */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 text-2xl">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.subtitle}</p>
            </div>
          ))}
        </div> */}

        {/* Contact Information */}
        {showContact && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-8 rounded-2xl border border-blue-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              ចង់ដឹងព័ត៌មានបន្ថែម?
            </h3>
            <p className="text-gray-700 mb-6">
              ប្រសិនបើអ្នកចង់ដឹងព័ត៌មានបន្ថែម សូមទាក់ទងមកយើងខ្ញុំ។
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                ទាក់ទងយើង
              </a>
              {showHomeButton && (
                <a href="/home" className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-medium">
                  ត្រឡប់ទៅទំព័រដើម
                </a>
              )}
            </div>
          </div>
        )}

        {/* Estimated Completion */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            តម្រូវឱ្យបញ្ចប់: <span className="font-semibold text-gray-700">{estimatedCompletion}</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Estimated completion: {estimatedCompletionEn}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ComingSoonPage;
