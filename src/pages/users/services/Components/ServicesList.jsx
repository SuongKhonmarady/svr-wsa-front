function ServicesList() {
  const services = [
    {
      id: 1,
      title: "ការផ្គត់ផ្គង់ទឹកស្អាត",
      description: "សេវាកម្មផ្គត់ផ្គង់ទឹកស្អាតគុណភាពខ្ពស់ដល់គ្រួសារ និងអាជីវកម្ម",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
      features: [
        "ទឹកស្អាតគុណភាពខ្ពស់",
        "ការផ្គត់ផ្គង់ទៀងទាត់",
        "ទឹកសម្រាប់ការប្រើប្រាស់ប្រចាំថ្ងៃ",
        "ប្រព័ន្ធបំពង់ទំនើប"
      ],
      price: "តម្លៃចាប់ពី 1200 រៀល/ម៣"
    },
    {
      id: 2,
      title: "តេស្តគុណភាពទឹក",
      description: "សេវាកម្មពិនិត្យ និងវិភាគគុណភាពទឹកតាមស្តង់ដារអន្តរជាតិ",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      features: [
        "ការពិនិត្យគុណភាពទឹកជាប្រចាំ",
        "របាយការណ៍លម្អិត",
        "ការវិភាគបាក់តេរី",
        "ការប្រឹក្សាជំនាញ"
      ],
      price: "សេវាកម្មឥតគិតថ្លៃ"
    },
    {
      id: 3,
      title: "ការជួសជុល និងថែទាំ",
      description: "សេវាកម្មជួសជុល និងថែទាំប្រព័ន្ធទឹកដោយក្រុមជំនាញ",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1V9a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V4a1 1 0 011-1h3a1 1 0 001-1z" />
        </svg>
      ),
      features: [
        "ការជួសជុលបន្ទាន់ ២៤/៧",
        "ជំនាញវិជ្ជាជីវៈ",
        "គ្រឿងបន្លាស់គុណភាពល្អ",
        "ការធានាសេវាកម្ម"
      ],
      price: "តម្លៃស្របតាមការងារ"
    },
    {
      id: 4,
      title: "ការតំឡើងប្រព័ន្ធទឹក",
      description: "សេវាកម្មតំឡើងប្រព័ន្ធទឹកថ្មីសម្រាប់អាគារ និងផ្ទះល្វែង",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      features: [
        "ការរចនាប្រព័ន្ធទឹក",
        "តំឡើងបំពង់ និងឧបករណ៍",
        "ការធ្វើតេស្តប្រព័ន្ធ",
        "ការបណ្តុះបណ្តាលការប្រើប្រាស់"
      ],
      price: "ពិគ្រោះតម្លៃតាមគម្រោង"
    },
    {
      id: 5,
      title: "ការប្រឹក្សាបច្ចេកទេស",
      description: "ការផ្តល់ប្រឹក្សាជំនាញស្តីពីការគ្រប់គ្រងធនធានទឹក",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      features: [
        "ការវាយតម្លៃប្រព័ន្ធទឹក",
        "ការរចនាដំណោះស្រាយ",
        "ការបណ្តុះបណ្តាលបុគ្គលិក",
        "ការអនុវត្តគោលនយោបាយ"
      ],
      price: "ការប្រឹក្សាឥតគិតថ្លៃ"
    },
    {
      id: 6,
      title: "សេវាកម្មអតិថិជន",
      description: "ការគាំទ្រអតិថិជនពេញម៉ោង និងការដោះស្រាយបញ្ហា",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      features: [
        "ការគាំទ្រតាមទូរស័ព្ទ ២៤/៧",
        "ការដោះស្រាយបញ្ហារហ័ស",
        "ការណែនាំការប្រើប្រាស់",
        "ការទទួលយកមតិកែលម្អ"
      ],
      price: "សេវាកម្មឥតគិតថ្លៃ"
    }
  ]

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-khmer-title">
            សេវាកម្មពេញលេញរបស់យើង
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            យើងផ្តល់សេវាកម្មគ្រប់យ៉ាងដែលទាក់ទងនឹងទឹកស្អាត និងការគ្រប់គ្រងប្រព័ន្ធទឹក
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 hover:border-blue-200">
              <div className="text-blue-600 mb-6">
                {service.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {service.title}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>
              
              <ul className="space-y-3 mb-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-700">
                    <span className="text-green-500 mr-3 mt-1 flex-shrink-0">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="text-blue-600 font-semibold mb-4">
                  {service.price}
                </div>
                
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                  ស្នើសុំសេវាកម្ម
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-4">
              ត្រូវការជំនួយបន្ថែម?
            </h3>
            <p className="text-blue-100 mb-6">
              ទាក់ទងយើងខ្ញុំសម្រាប់ការប្រឹក្សាឥតគិតថ្លៃ និងសេវាកម្មកម្រិតខ្ពស់
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200">
                ទាក់ទងយើង
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200">
                ស្នើសុំសេវាកម្ម
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServicesList
