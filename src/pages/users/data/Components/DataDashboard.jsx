import { useNavigate } from 'react-router-dom'

function DataDashboard() {
  const navigate = useNavigate()
  const stats = [
    {
      title: "គ្រួសារទទួលបាន",
      value: "១០,២៣៥",
      change: "+២.៥%",
      changeType: "increase",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: "បរិមាណទឹកផ្គត់ផ្គង់",
      value: "៨៥,៤៦២",
      unit: "ម៣/ថ្ងៃ",
      change: "+១.២%",
      changeType: "increase",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    },
    {
      title: "គុណភាពទឹក",
      value: "៩៨.៥%",
      change: "+០.៣%",
      changeType: "increase",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "ភាគរយសេវាកម្ម",
      value: "៩៩.២%",
      change: "-០.១%",
      changeType: "decrease",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ]

  const monthlyData = [
    { month: "មករា", consumption: 2840, quality: 98.2, customers: 10150 },
    { month: "កុម្ភៈ", consumption: 2920, quality: 98.5, customers: 10235 },
    { month: "មីនា", consumption: 3100, quality: 98.8, customers: 10320 },
    { month: "មេសា", consumption: 3250, quality: 98.3, customers: 10410 },
    { month: "ឧសភា", consumption: 3400, quality: 98.6, customers: 10495 },
    { month: "មិថុនា", consumption: 3550, quality: 98.9, customers: 10580 }
  ]

  const qualityTests = [
    { parameter: "បាក់តេរីអេកូលី", value: "០", unit: "CFU/100ml", status: "ល្អ", limit: "< ១" },
    { parameter: "ក្លរីនសេរី", value: "០.៥", unit: "mg/L", status: "ល្អ", limit: "០.២-២.០" },
    { parameter: "pH", value: "៧.២", unit: "", status: "ល្អ", limit: "៦.៥-៨.៥" },
    { parameter: "ទឹកកខ្វក់", value: "២.១", unit: "NTU", status: "ល្អ", limit: "< ៥" },
    { parameter: "ទឹកកខ្វក់", value: "២៥០", unit: "mg/L", status: "ល្អ", limit: "< ៥០០" },
    { parameter: "ផ្លោរីត", value: "០.៨", unit: "mg/L", status: "ល្អ", limit: "< ១.៥" }
  ]

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-khmer-title">
            ទិន្នន័យ និងស្ថិតិ
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ទិន្នន័យពិតប្រាកដ និងស្ថិតិប្រចាំថ្ងៃរបស់រដ្ឋករទឹកស្វាយរៀង
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="text-blue-600">
                  {stat.icon}
                </div>
                <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.changeType === 'increase' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {stat.change}
                </div>
              </div>
              <div className="mb-2">
                <div className="text-3xl font-bold text-gray-900">
                  {stat.value}
                  {stat.unit && <span className="text-lg text-gray-500 ml-1">{stat.unit}</span>}
                </div>
              </div>
              <div className="text-gray-600 text-sm">
                {stat.title}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Monthly Consumption Chart */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              ការប្រើប្រាស់ទឹកប្រចាំខែ
            </h3>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{data.month}</div>
                    <div className="text-sm text-gray-500">{data.customers} គ្រួសារ</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-600">{data.consumption}</div>
                    <div className="text-sm text-gray-500">ម៣ × ១០០០</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quality Data */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              លទ្ធផលតេស្តគុណភាពទឹក
            </h3>
            <div className="space-y-4">
              {qualityTests.map((test, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-900">{test.parameter}</div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      test.status === 'ល្អ' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {test.status}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-600">
                      លទ្ធផល: <span className="font-medium text-gray-900">{test.value} {test.unit}</span>
                    </div>
                    <div className="text-gray-500">
                      ស្តង់ដារ: {test.limit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Water Production Process */}
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            ដំណើរការផលិតទឹកស្អាត
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">១. ការទាញយក</h4>
              <p className="text-gray-600 text-sm">ទាញយកទឹកពីប្រភពធម្មជាតិ</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">២. ការចម្រាញ់</h4>
              <p className="text-gray-600 text-sm">ដំណើរការចម្រាញ់ទឹកទំនើប</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">៣. ការធ្វើតេស្ត</h4>
              <p className="text-gray-600 text-sm">ពិនិត្យគុណភាពម្តងទៀត</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">៤. ការចែកចាយ</h4>
              <p className="text-gray-600 text-sm">ផ្គត់ផ្គង់ដល់សហគមន៍</p>
            </div>
          </div>
        </div>

        {/* Download Reports */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-2xl text-center">
          <h3 className="text-2xl font-bold mb-4">
            ទាញយករបាយការណ៍
          </h3>
          <p className="text-blue-100 mb-6">
            ទាញយករបាយការណ៍លម្អិតស្តីពីទិន្នន័យ និងស្ថិតិប្រចាំខែ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/data/monthly')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>របាយការណ៍ប្រចាំខែ</span>
            </button>
            <button 
              onClick={() => navigate('/data/yearly')}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>របាយការណ៍ប្រចាំឆ្នាំ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataDashboard
