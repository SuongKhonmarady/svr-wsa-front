import { useState, useEffect, useRef } from 'react';

function ContactForm() {
  const [visibleSections, setVisibleSections] = useState({
    title: false,
    office: false,
    contacts: false,
    emergency: false
  });

  const titleRef = useRef(null);
  const officeRef = useRef(null);
  const contactsRef = useRef(null);
  const emergencyRef = useRef(null);

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

    // Observe all sections
    if (titleRef.current) {
      titleRef.current.dataset.section = 'title';
      observer.observe(titleRef.current);
    }
    if (officeRef.current) {
      officeRef.current.dataset.section = 'office';
      observer.observe(officeRef.current);
    }
    if (contactsRef.current) {
      contactsRef.current.dataset.section = 'contacts';
      observer.observe(contactsRef.current);
    }
    if (emergencyRef.current) {
      emergencyRef.current.dataset.section = 'emergency';
      observer.observe(emergencyRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contact Information */}
        <div 
          ref={titleRef}
          className={`transition-all duration-1000 ${visibleSections.title ? 'animate-fade-in-up opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-16 font-khmer-title text-center">
            ព័ត៌មានទំនាក់ទំនង
          </h2>
          
          <div className="space-y-12">
            {/* Office Hours */}
            <div 
              ref={officeRef}
              className={`bg-gradient-to-br from-blue-50 to-white p-8 rounded-3xl border border-blue-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-700 ${visibleSections.office ? 'animate-slide-in-left opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
            >
              <div className="flex items-center mb-6">
                <div className="bg-blue-600 p-4 rounded-full mr-6 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">ម៉ោងធ្វើការ</h3>
              </div>
              <div className="space-y-4 text-gray-700 text-lg">
                <p><strong>ថ្ងៃចន្ទ - ថ្ងៃសុក្រ:</strong> 7:30 - 12:00 និង 14:00 - 17:30</p>
                <p><strong>ថ្ងៃសៅរ៍ - ថ្ងៃអាទិត្យ:</strong> បិទ</p>
                <p className="text-blue-600 font-medium text-xl">សេវាកម្មបន្ទាន់: ២៤/៧</p>
              </div>
            </div>

            {/* Contact Details */}
            <div 
              ref={contactsRef}
              className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-700 ${visibleSections.contacts ? 'animate-slide-in-right opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
            >
              <a href='/about/location' className="flex items-start space-x-6 bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-gray-100">
                <div className="bg-green-100 p-4 rounded-full">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-xl">អាសយដ្ឋាន</h4>
                  <p className="text-gray-600 text-lg leading-relaxed">ស្រុកស្វាយរៀង ខេត្តស្វាយរៀង ព្រះរាជាណាចក្រកម្ពុជា</p>
                </div>
              </a>

              <div className="flex items-start space-x-6 bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-gray-100">
                <div className="bg-blue-100 p-4 rounded-full">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-xl">លេខទូរស័ព្ទ</h4>
                  <p className="text-gray-600 text-lg mb-2">០១២៣ ៤៥៦ ៧៨៩</p>
                  <p className="text-gray-600 text-lg">បន្ទាន់: ០៩៨៧ ៦៥៤ ៣២១</p>
                </div>
              </div>

              <div className="flex items-start space-x-6 bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-gray-100">
                <div className="bg-purple-100 p-4 rounded-full">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-xl">អ៊ីមែល</h4>
                  <p className="text-gray-600 text-lg mb-2">info@svayringwater.gov.kh</p>
                  <p className="text-gray-600 text-lg">support@svayringwater.gov.kh</p>
                </div>
              </div>

              <div className="flex items-start space-x-6 bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-gray-100">
                <div className="bg-blue-100 p-4 rounded-full">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-xl">គេហទំព័រ Facebook</h4>
                  <a 
                    href="https://www.facebook.com/profile.php?id=61554779397494" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-lg font-medium hover:underline"
                  >
                    រដ្ឋករទឹកស្វាយរៀង ស.រ.ស
                  </a>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div 
              ref={emergencyRef}
              className={`bg-gradient-to-br from-red-50 to-red-100 p-10 rounded-3xl border border-red-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-700 ${visibleSections.emergency ? 'animate-slide-in-up opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              <div className="flex items-center mb-6">
                <div className="bg-red-500 p-4 rounded-full mr-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h4 className="font-bold text-red-800 text-3xl">ទំនាក់ទំនងបន្ទាន់</h4>
              </div>
              <p className="text-red-700 mb-6 text-xl">ក្នុងករណីមានបញ្ហាបន្ទាន់ទាក់ទងនឹងទឹក:</p>
              <p className="text-4xl font-bold text-red-600 mb-4">០៩៨៧ ៦៥៤ ៣២១</p>
              <p className="text-xl text-red-600">សេវាកម្ម ២៤ ម៉ោង ៧ ថ្ងៃក្នុងសប្តាហ៍</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactForm
