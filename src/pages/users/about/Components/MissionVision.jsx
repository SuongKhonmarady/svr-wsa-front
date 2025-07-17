function MissionVision() {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Mission */}
          <div className="bg-gradient-to-br from-blue-300 to-blue-100 p-8 rounded-2xl shadow-lg">
            <div className="flex items-center mb-6">
              <div className="bg-blue-600 p-3 rounded-full mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 font-khmer-title">
                បេសកកម្ម
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">
              ផ្គត់ផ្គង់ទឹកស្អាតដែលមានគុណភាព សុវត្តិភាព និងភាពជឿជាក់បាន 
              ដល់គ្រប់សហគមន៍ក្នុងតំបន់នៅក្នុងខេត្តស្វាយរៀង ដោយប្រើបច្ចេកវិទ្យាទំនើប 
              និងការគ្រប់គ្រងប្រកបដោយប្រសិទ្ធភាព។
            </p>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-start space-x-3">
                <span className="text-blue-600 mt-1">✓</span>
                <span className="text-gray-700">គុណភាពទឹកខ្ពស់តាមស្តង់ដារអន្តរជាតិ</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-blue-600 mt-1">✓</span>
                <span className="text-gray-700">សេវាកម្ម ២៤ ម៉ោង ៧ថ្ងៃក្នុងសប្តាហ៍</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-blue-600 mt-1">✓</span>
                <span className="text-gray-700">ថ្លៃសេវាសមរម្យ និងតម្លាភាព</span>
              </div>
            </div>
          </div>

          {/* Vision */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-lg">
            <div className="flex items-center mb-6">
              <div className="bg-green-600 p-3 rounded-full mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 font-khmer-title">
                ចក្ខុវិស័យ
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">
              ក្លាយជាស្ថាប័នឈានមុខគេក្នុងតំបន់ 
              ក្នុងការផ្គត់ផ្គង់ទឹកស្អាត និងការគ្រប់គ្រងធនធានទឹកប្រកបដោយចីរភាព 
              ដើម្បីលើកកម្ពស់សុខុមាលភាពសហគមន៍។
            </p>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-start space-x-3">
                <span className="text-green-600 mt-1">★</span>
                <span className="text-gray-700">បច្ចេកវិទ្យាដ៏ទំនើបបំផុត</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-600 mt-1">★</span>
                <span className="text-gray-700">ការអភិវឌ្ឍន៍ប្រកបដោយចីរភាព</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-600 mt-1">★</span>
                <span className="text-gray-700">សហគមន៍មានសុខុមាលភាពល្អ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MissionVision
