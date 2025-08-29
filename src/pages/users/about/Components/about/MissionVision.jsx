import React, { useEffect, useState, useRef } from 'react'

function MissionVision() {
  const [visibleSections, setVisibleSections] = useState({
    mission: false,
    vision: false
  });

  const missionRef = useRef(null);
  const visionRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const targetId = entry.target.dataset.section;
          setVisibleSections(prev => ({
            ...prev,
            [targetId]: true
          }));
        }
      });
    }, observerOptions);

    if (missionRef.current) {
      missionRef.current.dataset.section = 'mission';
      observer.observe(missionRef.current);
    }
    if (visionRef.current) {
      visionRef.current.dataset.section = 'vision';
      observer.observe(visionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Mission */}
          <div 
            ref={missionRef}
            className={`bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-3xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-1000 ${visibleSections.mission
            ? 'opacity-100 transform translate-x-0 animate-slide-in-left'
            : 'opacity-0 transform -translate-x-10'
            }`}
          >
            <div className="flex items-center mb-6">
              <div className="bg-blue-600 p-4 rounded-full mr-6 shadow-lg animate-pulse">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 md:mb-8 font-bold text-gray-900 font-khmer-title">
              ប្រវត្តិរដ្ឋាករទឹកស្វាយរៀង
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
            <li>នៅឆ្នាំ១៩៤៨ អង្គភាពរដ្ឋាករទឹកស្វាយរៀង ត្រូវបានបង្កើ់តឡើង ពីអ្នកជំនាញប្រទេសបារាំង ប្រើប្រាស់ប្រភពទឹកលើដី(ទន្លេវ៉ៃគោ)។</li>
            <li>នៅឆ្នាំ១៩៥១ អ្នកជំនាញមកពីប្រទេសអាមេរិក បានសាងសង់ អាងអាកាស ដោយប្រើប្រាស់ទឹកក្រោមដី(អណ្ដូង)។</li>
            <li>នៅឆ្នាំ១៩៨០ មានជំនួយក្នុងការស្ដារឡើងវិញពីអ្នកជំនាញនៃ ប្រទេសវៀតណាម។</li>
            <li>នៅឆ្នាំ១៩៨៥ ធ្វើការតម្លើងបំពង់ PVC និងជួសជុលអាងអាកាស ឡើងវិញ ក្រោមគម្រោងរបស់អង្គការ OXFAM ។</li>
            <li>នៅឆ្នាំ១៩៩៥ ជួសជុលបំពង់ក្រោមអាងអាកាស សាងសង់ អាគាររដ្ឋបាល និងតម្លើងម៉ាស៊ីនភ្លើងចំនួន 0២គ្រឿង ក្រោមគម្រោង របស់ SAWA។</li>
            <li>ឆ្នាំ២០០៤-២០០៦ ទទួលបានគម្រោងស្ដារឡើងវិញប្រព័ន្ធ ចែកចាយទឹកស្អាត ដែលជាកម្ចីពីធនាគារអភិវឌ្ឍន៍អាស៊ី ADB-3232។</li>
            <li>ឆ្នាំ២០២០-២០២៣ បានទទួលគម្រោងពីធនាគារអភិវឌ្ឍន៍ អាស៊ី ADB-3232 ដែលមានសមត្ថភាពផលិតបាន ៩,០០០ម៣/ថ្ងៃ។</li>
            <li>នៅថ្ងៃទី០១ ខែកុម្ភៈ ឆ្នាំ២០២៤ បានចាប់ផ្ដើមអនុវត្តគម្រោង ពង្រីកសមត្ថភាពបន្ថែម ដែលជាជំនួយឥតសំណងរបស់រាជរដ្ឋាភិបាល ជប៉ុន តាមរយៈទីភ្នាក់ងារសហប្រតិបត្តិការអន្តរជាតិជប៉ុន JICA ដែល មានសមត្ថភាពផលិតបាន ៦,៨០០ម៣/ថ្ងៃ។</li>
            </p>

            {/* <div className="space-y-4">
              <div className="flex items-start space-x-4 bg-white/50 p-3 rounded-xl">
                <span className="text-blue-600 text-xl font-bold mt-1">✓</span>
                <span className="text-gray-700 font-medium">គុណភាពទឹកខ្ពស់តាមស្តង់ដារអន្តរជាតិ</span>
              </div>
              <div className="flex items-start space-x-4 bg-white/50 p-3 rounded-xl">
                <span className="text-blue-600 text-xl font-bold mt-1">✓</span>
                <span className="text-gray-700 font-medium">សេវាកម្ម ២៤ ម៉ោង ៧ថ្ងៃក្នុងសប្តាហ៍</span>
              </div>
              <div className="flex items-start space-x-4 bg-white/50 p-3 rounded-xl">
                <span className="text-blue-600 text-xl font-bold mt-1">✓</span>
                <span className="text-gray-700 font-medium">ថ្លៃសេវាសមរម្យ និងតម្លាភាព</span>
              </div>
            </div> */}
          </div>

          {/* Vision */}
          <div 
            ref={visionRef}
            className={`bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-3xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-1000 ${visibleSections.vision
            ? 'opacity-100 transform translate-x-0 animate-slide-in-right'
            : 'opacity-0 transform translate-x-10'
            }`}
          >
            <div className="flex items-center mb-6">
              <div className="bg-green-600 p-4 rounded-full mr-6 shadow-lg animate-pulse">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 font-khmer-title">
                ចក្ខុវិស័យ
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
            រដ្ឋាករទឹកស្វាយរៀង មានគោលដៅផលិត និងផ្ដល់សេវាផ្គត់ផ្គង់ ទឹកស្អាត សម្រាប់ការប្រើប្រាស់ជាទូទៅនៃសាធារណជន នៅក្នុងក្រុង ស្វាយរៀង និងតំបន់ជុំវិញ។
            ជម្រុញ ពង្រឹង ធានាប្រសិទ្ធភាពនៃការផលិត ការផ្គត់ផ្គង់ និងការ ចែកចាយទឹកស្អាត ការធ្វើអាជីវកម្មប្រកបដោយគុណភាព សុវត្ថិភាព និរន្តរភាព និង តម្លៃសមរម្យ ព្រមទាំងចូលរួមលើកកម្ពស់សុខុមាលភាព សាធារណៈ និងអនុវត្តតាមគោលនយោបាយរបស់រាជរដ្ឋាភិបាល។
            អនុវត្តតាមគោលនយោបាយរបស់រាជរដ្ឋាភិបាល នីតិកាលទី៧ កម្ពុជាកំណត់គោលដៅផ្គត់ផ្គង់ទឹកស្អាតឱ្យបាន ១០០%នៅឆ្នាំ២០៣០។
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-4 bg-white/50 p-3 rounded-xl">
                <span className="text-green-600 text-xl font-bold mt-1">★</span>
                <span className="text-gray-700 font-medium">បច្ចេកវិទ្យាដ៏ទំនើបបំផុត</span>
              </div>
              <div className="flex items-start space-x-4 bg-white/50 p-3 rounded-xl">
                <span className="text-green-600 text-xl font-bold mt-1">★</span>
                <span className="text-gray-700 font-medium">ការអភិវឌ្ឍន៍ប្រកបដោយចីរភាព</span>
              </div>
              <div className="flex items-start space-x-4 bg-white/50 p-3 rounded-xl">
                <span className="text-green-600 text-xl font-bold mt-1">★</span>
                <span className="text-gray-700 font-medium">សហគមន៍មានសុខុមាលភាពល្អ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MissionVision
