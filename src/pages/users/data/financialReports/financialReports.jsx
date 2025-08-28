import React from 'react';
import ComingSoonPage from '../../../../components/ComingSoonPage';

function FinancialReports() {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1577495508048-b635879837f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')"
      }}>
      {/* Page Header */}
      <div className="relative bg-gradient-to-r from-teal-800/40 via-teal-700/80 to-teal-800/40 text-white py-16 lg:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-khmer-title">
              របាយការណ៍ហិរញ្ញវត្ថុប្រចាំឆ្នាំ និងប្រចាំត្រីមាស
            </h1>
            <p className="text-xl sm:text-2xl text-teal-100 mb-8 max-w-3xl mx-auto">
              Annual and Quarterly Financial Reports
            </p>
            <p className="text-lg text-teal-200 max-w-4xl mx-auto leading-relaxed">
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
  );
}

export default FinancialReports;
