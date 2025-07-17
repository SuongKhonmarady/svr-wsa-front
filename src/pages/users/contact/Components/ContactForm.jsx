function ContactForm() {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 font-khmer-title">
              ផ្ញើសារមកកាន់យើង
            </h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ឈ្មោះ *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="បញ្ចូលឈ្មោះរបស់អ្នក"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    លេខទូរស័ព្ទ *
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="បញ្ចូលលេខទូរស័ព្ទ"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  អ៊ីមែល (អាចរំលងបាន)
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="បញ្ចូលអ៊ីមែលរបស់អ្នក"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ប្រភេទសេវាកម្ម
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                  <option value="">ជ្រើសរើសប្រភេទសេវាកម្ម</option>
                  <option value="water-supply">ការផ្គត់ផ្គង់ទឹកស្អាត</option>
                  <option value="quality-test">តេស្តគុណភាពទឹក</option>
                  <option value="repair">ការជួសជុល និងថែទាំ</option>
                  <option value="installation">ការតំឡើងប្រព័ន្ធទឹក</option>
                  <option value="consultation">ការប្រឹក្សាបច្ចេកទេស</option>
                  <option value="other">ផ្សេងៗ</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  សារ *
                </label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="សូមបញ្ជាក់ពីបញ្ហា ឬសេវាកម្មដែលអ្នកត្រូវការ..."
                ></textarea>
              </div>
              
              <div className="flex items-start">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-3 text-sm text-gray-600">
                  ខ្ញុំយល់ព្រមទទួលព័ត៌មាន និងការទំនាក់ទំនងពីរដ្ឋករទឹកស្វាយរៀង
                </label>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg"
              >
                ផ្ញើសារ
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 font-khmer-title">
              ព័ត៌មានទំនាក់ទំនង
            </h2>
            
            <div className="space-y-8">
              {/* Office Hours */}
              <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-100">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-600 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">ម៉ោងធ្វើការ</h3>
                </div>
                <div className="space-y-2 text-gray-700">
                  <p><strong>ថ្ងៃចន្ទ - ថ្ងៃសុក្រ:</strong> ០៨:០០ - ១៧:០០</p>
                  <p><strong>ថ្ងៃសៅរ៍ - ថ្ងៃអាទិត្យ:</strong> បិទ</p>
                  <p className="text-blue-600 font-medium">សេវាកម្មបន្ទាន់: ២៤/៧</p>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">អាសយដ្ឋាន</h4>
                    <p className="text-gray-600">ស្រុកស្វាយរៀង ខេត្តស្វាយរៀង ព្រះរាជាណាចក្រកម្ពុជា</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">លេខទូរស័ព្ទ</h4>
                    <p className="text-gray-600">០១២៣ ៤៥៦ ៧៨៩</p>
                    <p className="text-gray-600">បន្ទាន់: ០៩៨៧ ៦៥៤ ៣២១</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">អ៊ីមែល</h4>
                    <p className="text-gray-600">info@svayringwater.gov.kh</p>
                    <p className="text-gray-600">support@svayringwater.gov.kh</p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-red-50 p-6 rounded-2xl border border-red-200">
                <h4 className="font-bold text-red-800 mb-3">ទំនាក់ទំនងបន្ទាន់</h4>
                <p className="text-red-700 mb-2">ក្នុងករណីមានបញ្ហាបន្ទាន់ទាក់ទងនឹងទឹក:</p>
                <p className="text-2xl font-bold text-red-600">០៩៨៧ ៦៥៤ ៣២១</p>
                <p className="text-sm text-red-600 mt-2">សេវាកម្ម ២៤ ម៉ោង ៧ ថ្ងៃក្នុងសប្តាហ៍</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactForm
