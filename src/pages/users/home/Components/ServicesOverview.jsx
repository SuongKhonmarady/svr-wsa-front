import { useState, useEffect, useRef } from 'react'

function ServicesOverview() {
  const [visibleSections, setVisibleSections] = useState({
    title: false,
    services: false
  });

  const titleRef = useRef(null);
  const servicesRef = useRef(null);

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

    if (titleRef.current) {
      titleRef.current.dataset.section = 'title';
      observer.observe(titleRef.current);
    }
    if (servicesRef.current) {
      servicesRef.current.dataset.section = 'services';
      observer.observe(servicesRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
      title: "ស្នើរសុំសេវាកម្ម",
      description: "ការធានាគុណភាពទឹកតាមរយៈការតេស្តជាប្រចាំ និងការគ្រប់គ្រងគុណភាព",
      features: ["ការស្នើរសុំប្រើប្រាស់ទឹកស្អាត", "ការស្នើរសុំផ្លាស់ប្ដូរឈ្នោះប្រើប្រាស់ទឹកស្អាតរបស់អតិថិជន", "ការប្ដូរទំហំនាឡិកាទឹក","ការផ្លាស់ប្ដូរទីតាំងនាឡិកាទឹក"]
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "សេវាកម្មជួសជុល",
      description: "សេវាកម្មបម្រើអតិថិជនពេញម៉ោង រួមទាំងការជួសជុលបន្ទាន់",
      features: ["ស្នើរសុំជួសជុកបណ្ដាញ", "សុំថ្លឹងនិងត្រួតពិនិត្យនាឡិកាទឹក", "ការស្នើរសុំត្រួតពិនិត្យបរិមាណប្រើប្រាស់ទឹកស្អាត"]
    }
  ]

  return (
    <div className="py-16 relative -mt-1">
      {/* Light overlay to make content readable while showing background */}
      <div className="absolute inset-0 bg-white"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-1000 ${
          visibleSections.title 
            ? 'opacity-100 transform translate-y-0 animate-fade-in-up' 
            : 'opacity-0 transform translate-y-8'
        }`}
        >
          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-3 md:mb-4 lg:mb-6 font-khmer-title">
            សេវាកម្មរបស់យើង
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            យើងផ្តល់សេវាកម្មគុណភាពខ្ពស់ និងជឿជាក់បានដល់សហគមន៍
          </p>
        </div>

        <div 
          ref={servicesRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <div 
              key={index}
              className={`bg-white rounded-3xl shadow-lg hover:shadow-xl p-8 transition-all duration-1000 hover:scale-105 transform ${
                visibleSections.services 
                  ? 'opacity-100 translate-y-0' + (index === 0 ? ' animate-slide-in-left' : index === 1 ? ' animate-fade-in-up' : ' animate-slide-in-right')
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Icon */}
              <div className="text-blue-600 mb-6 transform hover:scale-110 transition-transform duration-300 animate-pulse">
                {service.icon}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-khmer-title">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-3">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-700 bg-gray-50 p-3 rounded-xl hover:bg-blue-50 transition-colors duration-300">
                    <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ServicesOverview
