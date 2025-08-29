import React, { useEffect, useState, useRef } from 'react'

function AboutHero() {
  const [visibleSections, setVisibleSections] = useState({
    title: false,
    subtitle: false,
    description: false
  });

  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descriptionRef = useRef(null);

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
    if (subtitleRef.current) {
      subtitleRef.current.dataset.section = 'subtitle';
      observer.observe(subtitleRef.current);
    }
    if (descriptionRef.current) {
      descriptionRef.current.dataset.section = 'description';
      observer.observe(descriptionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (

    <div className="relative text-white py-12 sm:py-16 lg:py-20 xl:py-24 bg-cover bg-center bg-no-repeat">
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-blue-800/80 to-blue-900/50"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 
            ref={titleRef}
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-4 sm:mb-6 lg:mb-8 font-khmer-title transition-all duration-1000 ${visibleSections.title
            ? 'opacity-100 transform translate-y-0 animate-fade-in-up'
            : 'opacity-0 transform translate-y-10'
            }`}
          >
            អំពី រ.ស.រ
          </h1>
          <p 
            ref={subtitleRef}
            className={`text-lg sm:text-xl md:text-2xl lg:text-3xl text-blue-100 mb-6 sm:mb-8 lg:mb-10 max-w-3xl mx-auto leading-relaxed transition-all duration-1200 ${visibleSections.subtitle
            ? 'opacity-100 transform translate-y-0 animate-slide-in-left'
            : 'opacity-0 transform translate-y-8'
            }`}
          >
            ស្ថាប័នឈានមុខគេក្នុងការផ្គត់ផ្គង់ទឹកស្អាត និងសេវាកម្មគុណភាព
          </p>
          <p 
            ref={descriptionRef}
            className={`text-base sm:text-lg md:text-xl text-blue-200 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0 transition-all duration-1400 ${visibleSections.description
            ? 'opacity-100 transform translate-y-0 animate-slide-in-right'
            : 'opacity-0 transform translate-y-8'
            }`}
          >
            យើងមានបេសកកម្មក្នុងការធានាការផ្គត់ផ្គង់ទឹកស្អាតដល់សហគមន៍
            ដោយប្រើបច្ចេកវិទ្យាទំនើប និងការគ្រប់គ្រងប្រកបដោយប្រសិទ្ធភាព
          </p>
        </div>
      </div>

      {/* Decorative wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-6 sm:h-8 lg:h-10" viewBox="0 0 100 20" fill="none" preserveAspectRatio="none">
          <path d="M0 20L100 0V20H0Z" fill="rgb(255 255 255)" />
        </svg>
      </div>
    </div>
  )
}

export default AboutHero
