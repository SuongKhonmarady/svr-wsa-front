function LawsRegulations() {
  const lawsData = [
    {
      id: 1,
      title: "ច្បាប់ស្តីពីការគ្រប់គ្រងធនធានទឹក",
      description: "ច្បាប់ស្តីពីការគ្រប់គ្រង ការអភិរក្ស និងការអភិវឌ្ឍធនធានទឹកក្នុងព្រះរាជាណាចក្រកម្ពុជា",
      date: "២៥ មិថុនា ២០០៧",
      type: "ច្បាប់",
      status: "មានប្រសិទ្ធភាព",
      downloadUrl: "#",
      articles: 45,
      category: "ធនធានទឹក"
    },
    {
      id: 2,
      title: "ស្តង់ដារគុណភាពទឹកក្នុងស្រុក",
      description: "ការកំណត់ស្តង់ដារគុណភាពទឹកសម្រាប់ការប្រើប្រាស់របស់សាធារណជន",
      date: "១០ កញ្ញា ២០១២",
      type: "បទបញ្ញត្តិ",
      status: "មានប្រសិទ្ធភាព",
      downloadUrl: "#",
      articles: 25,
      category: "គុណភាព"
    },
    {
      id: 3,
      title: "បទបញ្ញត្តិស្តីពីការផ្គត់ផ្គង់ទឹកក្នុងទីក្រុង",
      description: "បទបញ្ញត្តិស្តីពីការផ្គត់ផ្គង់ទឹក និងការបន្ទាត់ទឹកក្នុងតំបន់ទីក្រុង",
      date: "០៥ មីនា ២០១៥",
      type: "បទបញ្ញត្តិ",
      status: "មានប្រសិទ្ធភាព",
      downloadUrl: "#",
      articles: 32,
      category: "ការផ្គត់ផ្គង់"
    },
    {
      id: 4,
      title: "ការកំណត់តម្លៃសេវាកម្មទឹក",
      description: "ប្រកាសអន្តរក្រសួងស្តីពីការកំណត់តម្លៃសេវាកម្មផ្គត់ផ្គង់ទឹក",
      date: "២០ វិច្ឆិកា ២០១៨",
      type: "ប្រកាស",
      status: "មានប្រសិទ្ធភាព",
      downloadUrl: "#",
      articles: 15,
      category: "តម្លៃសេវា"
    },
    {
      id: 5,
      title: "សុវត្ថិភាពនៃការប្រើប្រាស់ទឹក",
      description: "បទបញ្ញត្តិស្តីពីសុវត្ថិភាព និងការការពារសុខភាពក្នុងការប្រើប្រាស់ទឹក",
      date: "១៥ ឧសភា ២០២០",
      type: "បទបញ្ញត្តិ",
      status: "មានប្រសិទ្ធភាព",
      downloadUrl: "#",
      articles: 28,
      category: "សុវត្ថិភាព"
    },
    {
      id: 6,
      title: "ការគ្រប់គ្រងទឹកក្នុងសម័យកូវីដ-១៩",
      description: "គោលការណ៍ណែនាំស្តីពីការគ្រប់គ្រងសេវាកម្មទឹកក្នុងកំឡុងរយៈពេលវិបត្តិសុខភាព",
      date: "០៨ មេសា ២០២០",
      type: "គោលការណ៍ណែនាំ",
      status: "មានប្រសិទ្ធភាព",
      downloadUrl: "#",
      articles: 12,
      category: "វិបត្តិ"
    }
  ]

  const categories = ["ទាំងអស់", "ធនធានទឹក", "គុណភាព", "ការផ្គត់ផ្គង់", "តម្លៃសេវា", "សុវត្ថិភាព", "វិបត្តិ"]
  const types = ["ទាំងអស់", "ច្បាប់", "បទបញ្ញត្តិ", "ប្រកាស", "គោលការណ៍ណែនាំ"]

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-khmer-title">
            ច្បាប់ និងបទបញ្ញត្តិ
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ច្បាប់ បទបញ្ញត្តិ និងគោលការណ៍ណែនាំទាក់ទងនឹងការគ្រប់គ្រងធនធានទឹក
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-gray-50 p-6 rounded-2xl mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                ប្រភេទច្បាប់
              </label>
              <div className="flex flex-wrap gap-2">
                {types.map((type) => (
                  <button
                    key={type}
                    className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-colors duration-200 text-sm"
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                ប្រភេទតាមកថាខណ្ឌ
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-colors duration-200 text-sm"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Laws List */}
        <div className="space-y-6">
          {lawsData.map((law) => (
            <div key={law.id} className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      law.type === 'ច្បាប់' ? 'bg-red-100 text-red-700' :
                      law.type === 'បទបញ្ញត្តិ' ? 'bg-blue-100 text-blue-700' :
                      law.type === 'ប្រកាស' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {law.type}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {law.category}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {law.status}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {law.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {law.description}
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>ថ្ងៃចុះផ្សាយ: {law.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>មាត្រា: {law.articles}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    ទាញយក PDF
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors duration-200 font-medium flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    មើលលម្អិត
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Information Box */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                ការជូនដំណឹង
              </h3>
              <p className="text-gray-700 leading-relaxed">
                ឯកសារទាំងអស់ស្ថិតនៅក្រោមការគ្រប់គ្រងរបស់រដ្ឋករទឹកស្វាយរៀង។ 
                សម្រាប់ការបកស្រាយ ឬសំណួរណាមួយ សូមទាក់ទងមកយើងខ្ញុំ។ 
                ឯកសារខ្លះអាចត្រូវការការអនុញ្ញាតពិសេសក្នុងការចូលប្រើ។
              </p>
              <div className="mt-4">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  ទាក់ទងយើង
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LawsRegulations
