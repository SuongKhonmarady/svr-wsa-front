import React, { useState, useEffect } from 'react';

function Privacy() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Fixed background */}
      <div className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat bg-[url('/image/fd78805f8ce862135726b6fc7f51aafc.jpg')]"
      style={{
        top: '-35vh',
        bottom: '-10vh',
        height: '100vh'
    }} 
            />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Page Header */}
        <div className="relative bg-gradient-to-r from-indigo-800/40 via-indigo-700/80 to-indigo-800/40 text-white py-16 lg:py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className={`text-2xl sm:text-4xl lg:text-5xl mb-6 transition-all duration-1000 ${isLoaded
                ? 'opacity-100 transform translate-y-0'
                : 'opacity-0 transform -translate-y-8'
                }`}>
                គោលការណ៍ឯកជនភាពរបស់ ស.រ.ស
              </h1>
              <p className={`text-xl sm:text-2xl lg:text-3xl text-indigo-100 mb-8 max-w-3xl mx-auto transition-all duration-1500 ${isLoaded
                ? 'opacity-100 transform translate-x-0'
                : 'opacity-0 translate-y-8'
                }`}>
                Privacy Policy
              </p>
              <p className={`text-lg sm:text-xl lg:text-2xl text-indigo-200 max-w-4xl mx-auto leading-relaxed transition-all duration-2000 ${isLoaded
                ? 'opacity-100 transform translate-y-0'
                : 'opacity-0 translate-y-8'
                }`}>
                យើងគោរពសិទ្ធិឯកជនភាពរបស់អ្នក និងធានាថាព័ត៌មានរបស់អ្នកមានសុវត្ថិភាព
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

        {/* Privacy Content */}
        <div className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Last Updated */}
            <div className="text-center mb-12">
              <p className="text-gray-600 text-sm">
                កែប្រែចុងក្រោយ: <span className="font-semibold">ថ្ងៃទី ១ ខែកញ្ញា ឆ្នាំ ២០២៥</span>
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Last Updated: September 1, 2025
              </p>
            </div>

            {/* Introduction */}
            <div className="bg-blue-50 p-8 rounded-2xl mb-12 border border-blue-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-khmer-title">
                សេចក្តីផ្តើម
              </h2>
              <p className="text-gray-700 mb-0 leading-relaxed">
                រដ្ឋករទឹកស្វាយរៀង (ស.រ.ស) គោរពសិទ្ធិឯកជនភាពរបស់អ្នក។ 
                គោលនយោបាយឯកជនភាពនេះពន្យល់ពីរបៀបដែលយើងប្រមូល ប្រើប្រាស់ និងការពារព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នក។
              </p>
            </div>

            {/* Information We Collect */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-khmer-title">
                ព័ត៌មានដែលយើងប្រមូល
              </h2>
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">ព័ត៌មានផ្ទាល់ខ្លួន</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>• ឈ្មោះ និងអាសយដ្ឋាន</li>
                    <li>• លេខទូរស័ព្ទ</li>
                    <li>• ឯកសារកំណត់អត្តសញ្ញាណ៖ ច្បាប់ចម្លង អត្តសញ្ញាណប័ណ្ណ សៀវភៅគ្រួសារ ដែលអ្នកដាក់ស្នើសម្រាប់ការផ្ទៀងផ្ទាត់។</li>
                  </ul>
                </div>

              </div>
            </div>

            {/* How We Use Information */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-khmer-title">
                របៀបដែលយើងប្រើប្រាស់ព័ត៌មាន
              </h2>
              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-xl border border-blue-200">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-start">គោលបំណងរបស់យើង</h3>
                <p className="text-gray-700 text-lg leading-relaxed text-start">
                  យើងផ្តល់សេវាកម្មទឹកស្អាតដែលមានគុណភាពខ្ពស់ ទាក់ទងជាមួយអតិថិជនជាប្រចាំ វិភាគគុណភាពសេវាកម្មដើម្បីកែលម្អប្រសិទ្ធភាព និងអនុលោមតាមច្បាប់ និងបទបញ្ញត្តិដែលពាក់ព័ន្ធដើម្បីធានាសុវត្ថិភាព និងគុណភាពសេវាកម្ម
                </p>
                <p className="text-gray-700 mt-4 text-start">
                  យើង <strong>មិនចែករំលែក</strong> ព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នកជាមួយភាគីទីបីសម្រាប់គោលបំណងពាណិជ្ជកម្មឡើយ។
                </p>
              </div>
            </div>

          

            {/* Data Security */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-khmer-title">
              របៀបរក្សាទុក និងការពារព័ត៌មានទិន្នន័យរបស់អ្នក
              </h2>
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <p className="text-gray-700 mb-4">
                យើងយកចិត្តទុកដាក់ខ្ពស់ក្នុងការការពារព័ត៌មានរបស់អ្នក ជាពិសេសឯកសារសំខាន់ៗដូចជា អត្តសញ្ញាណប័ណ្ណ និងសៀវភៅគ្រួសារ៖
                </p>
                <ul className="text-gray-700 space-y-2">
                  <li>• មានតែបុគ្គលិកដែលបានអនុញ្ញាតប៉ុណ្ណោះអាចចូលមើលឯកសារបាន</li>
                  <li>• ការតាមដានជាប្រចាំង</li>
                  <li>• ការធ្វើបច្ចុប្បន្នភាពវិធីសាស្ត្រសុវត្ថិភាព និងការពារព័ត៌មានរបស់អ្នក</li>
                  <li>• អ៊ិនគ្រីបពេលផ្ទេរ (Encryption in Transit) ទិន្នន័យទាំងអស់ត្រូវបានផ្ទេរតាម HTTPS (TLS) ដើម្បីការពារការចាប់យកទិន្នន័យ</li>
                </ul>
              </div>
            </div>

            {/* Your Rights */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-khmer-title">
                សិទ្ធិរបស់អ្នក
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">សិទ្ធិចូលប្រើ</h3>
                  <p className="text-gray-700">
                    អ្នកមានសិទ្ធិចូលប្រើព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នក
                  </p>
                </div>

                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">សិទ្ធិកែប្រែ</h3>
                  <p className="text-gray-700">
                    អ្នកមានសិទ្ធិកែប្រែព័ត៌មានដែលមិនត្រឹមត្រូវ
                  </p>
                </div>

                <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">សិទ្ធិលុប</h3>
                  <p className="text-gray-700">
                    អ្នកមានសិទ្ធិស្នើសុំលុបព័ត៌មានរបស់អ្នក
                  </p>
                </div>

              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-8 rounded-2xl border border-blue-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-khmer-title">
                ទំនាក់ទំនងជាមួយយើង
              </h2>
              <p className="text-gray-700 mb-6">
                ប្រសិនបើអ្នកមានសំណួរ ឬការព្រួយបារម្ភអំពីគោលនយោបាយឯកជនភាពនេះ សូមទាក់ទងមកយើង:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">អ៊ីមែល:</h3>
                  <p className="text-blue-600">info@svrwu.com.kh</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">លេខទូរស័ព្ទ:</h3>
                  <p className="text-blue-600">0123 456 789</p>
                </div>
              </div>
            </div>

            {/* Updates to Policy */}
            <div className="mt-12 text-center">
              <p className="text-gray-600">
                យើងអាចធ្វើបច្ចុប្បន្នភាពគោលនយោបាយឯកជនភាពនេះពីពេលមួយទៅពេលមួយ។ 
                សូមពិនិត្យមើលទំព័រនេះជាប្រចាំ។
              </p>
              <p className="text-gray-500 text-sm mt-2">
                We may update this Privacy Policy from time to time. Please check this page regularly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Privacy;
