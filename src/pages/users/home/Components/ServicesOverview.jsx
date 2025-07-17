function ServicesOverview() {
  const services = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      title: "ការចម្រាញ់ទឹក",
      description: "ប្រព័ន្ធចម្រាញ់ទឹកទំនើប ធានាគុណភាពទឹកខ្ពស់តាមស្តង់ដារអន្តរជាតិ",
      features: ["បច្ចេកវិទ្យាទំនើប", "តេស្តគុណភាពទៀងទាត់", "សុវត្តិភាព ១០០%"]
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      title: "គុណភាពធានា",
      description: "ការធានាគុណភាពទឹកតាមរយៈការតេស្តជាប្រចាំ និងការគ្រប់គ្រងគុណភាព",
      features: ["តេស្តគុណភាពប្រចាំថ្ងៃ", "លទ្ធផលតម្លាភាព", "ស្តង់ដារអន្តរជាតិ"]
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "សេវាកម្ម ២៤/៧",
      description: "សេវាកម្មបម្រើអតិថិជនពេញម៉ោង រួមទាំងការជួសជុលបន្ទាន់",
      features: ["បម្រើ ២៤ ម៉ោង", "ជួសជុលបន្ទាន់", "ការគាំទ្រតាមទូរស័ព្ទ"]
    }
  ]

  return (
    <div className="py-16 relative -mt-1">
      {/* Light overlay to make content readable while showing background */}
      <div className="absolute inset-0 bg-white"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-khmer-title">
            សេវាកម្មរបស់យើង
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            យើងផ្តល់សេវាកម្មគុណភាពខ្ពស់ និងជឿជាក់បានដល់សហគមន៍
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-blue-100">
              <div className="text-blue-600 mb-6">
                {service.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {service.title}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>
              
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                ស្វែងយល់បន្ថែម
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ServicesOverview
