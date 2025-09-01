import React, { useState, useEffect } from 'react';
import ComingSoonPage from '../../../../components/ComingSoonPage';

function FinancialReports() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])
  
  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/image/fd78805f8ce862135726b6fc7f51aafc.jpg')" }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-700/70 via-teal-800/80 to-teal-700/70"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl mb-6 transition-all duration-1000 ${
            isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-8'
          }`}>
            របាយការណ៍ហិរញ្ញវត្ថុ
          </h1>
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 transition-all duration-1500 ${
            isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-8'
          }`}>
            ប្រចាំឆ្នាំ និងប្រចាំត្រីមាស
          </h2>
          <p className={`text-xl sm:text-2xl text-teal-100 mb-6 max-w-4xl mx-auto leading-relaxed transition-all duration-2000 ${
            isLoaded ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-y-8'
          }`}>
            Annual and Quarterly Financial Reports
          </p>
          <p className={`text-lg text-teal-200 max-w-5xl mx-auto leading-relaxed transition-all duration-2500 ${
            isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}>
            របាយការណ៍ហិរញ្ញវត្ថុ ការវិភាគថវិកា និងស្ថិតិសេដ្ឋកិច្ច
          </p>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-10" viewBox="0 0 100 20" fill="none" preserveAspectRatio="none">
            <path d="M0 20L100 0V20H0Z" fill="rgb(250 250 250)" />
          </svg>
        </div>
      </div>

      {/* Financial Reports Content */}
      <div className="bg-gray-50">
        <ComingSoonPage
          title="របាយការណ៍ហិរញ្ញវត្ថុ"
          subtitle="Financial Reports"
          description="ទំព័ររបាយការណ៍ហិរញ្ញវត្ថុកំពុងស្ថិតក្នុងដំណើរការអភិវឌ្ឍន៍។ យើងកំពុងរៀបចំរបាយការណ៍ប្រចាំឆ្នាំ និងប្រចាំត្រីមាសដែលមានព័ត៌មានលម្អិត។"
          englishDescription="The Financial Reports page is currently under development. We're preparing annual and quarterly reports with detailed information."
          progress={60}
          features={[
            { icon: "📊", title: "របាយការណ៍ប្រចាំឆ្នាំ", subtitle: "Annual Reports" },
            { icon: "📈", title: "របាយការណ៍ប្រចាំត្រីមាស", subtitle: "Quarterly Reports" },
            { icon: "💰", title: "ថវិកានិងចំណូល", subtitle: "Budget & Revenue" },
            { icon: "📋", title: "ការវិភាគហិរញ្ញវត្ថុ", subtitle: "Financial Analysis" }
          ]}
          estimatedCompletion="ខែក្រោយ"
          estimatedCompletionEn="Next month"
          showContact={true}
          showHomeButton={true}
        />
      </div>
    </div>
  );
}

export default FinancialReports;
