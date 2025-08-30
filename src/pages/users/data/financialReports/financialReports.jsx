import React from 'react';
import ComingSoonPage from '../../../../components/ComingSoonPage';

function FinancialReports() {
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat bg-[url('/image/fd78805f8ce862135726b6fc7f51aafc.jpg')]"
      style={{
                top: '-25vh',
                bottom: '-10vh',
                height: '100vh'
            }}
      />
      <div className="relative z-10">
        {/* Page Header */}
        <div className="relative bg-gradient-to-r from-teal-800/40 via-teal-700/80 to-teal-800/40 text-white py-16 lg:py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 md:mb-8">
                របាយការណ៍ហិរញ្ញវត្ថុ
              </h1>
              <h1
                className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 md:mb-8"
              >
                ប្រចាំឆ្នាំ និងប្រចាំត្រីមាស
              </h1>
              <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl sm:mb-8 md:mb-12 text-teal-100 mb-8 max-w-3xl mx-auto">
                Annual and Quarterly Financial Reports
              </p>
              <p className="text-base sm:text-lg md:text-xl text-teal-200 max-w-4xl mx-auto leading-relaxed">
                របាយការណ៍ហិរញ្ញវត្ថុ ការវិភាគថវិកា និងស្ថិតិសេដ្ឋកិច្ច
              </p>
            </div>
          </div>

          {/* Decorative wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg className="w-full h-8" viewBox="0 0 100 20" fill="none" preserveAspectRatio="none">
              <path d="M0 20L100 0V20H0Z" fill="rgb(249 250 251)" />
            </svg>
          </div>
        </div>

        {/* Financial Reports Content */}
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
