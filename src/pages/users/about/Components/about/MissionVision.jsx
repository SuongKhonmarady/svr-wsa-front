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
              <h2 className="text-3xl font-bold text-gray-900 font-khmer-title">
                បេសកកម្ម
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              ផ្គត់ផ្គង់ទឹកស្អាតដែលមានគុណភាព សុវត្តិភាព និងភាពជឿជាក់បាន
              ដល់គ្រប់សហគមន៍ក្នុងតំបន់នៅក្នុងខេត្តស្វាយរៀង ដោយប្រើបច្ចេកវិទ្យាទំនើប
              និងការគ្រប់គ្រងប្រកបដោយប្រសិទ្ធភាព។
            </p>

            <div className="space-y-4">
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
            </div>
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
              ក្លាយជាស្ថាប័នឈានមុខគេក្នុងតំបន់
              ក្នុងការផ្គត់ផ្គង់ទឹកស្អាត និងការគ្រប់គ្រងធនធានទឹកប្រកបដោយចីរភាព
              ដើម្បីលើកកម្ពស់សុខុមាលភាពសហគមន៍។
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
