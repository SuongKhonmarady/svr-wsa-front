import React, { useEffect, useState, useRef } from 'react'

function TeamHero() {
  const [visibleSections, setVisibleSections] = useState({
    title: false,
    description: false
  });

  const titleRef = useRef(null);
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
    if (descriptionRef.current) {
      descriptionRef.current.dataset.section = 'description';
      observer.observe(descriptionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative text-white py-12 sm:py-16 lg:py-20 xl:py-24 bg-cover bg-center bg-no-repeat" 
         style={{ backgroundImage: "url('/image/fd78805f8ce862135726b6fc7f51aafc.jpg')" }}>
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-blue-800/80 to-blue-900/50"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div 
            ref={titleRef}
            className={`flex items-center justify-center mb-6 transition-all duration-1000 ${visibleSections.title
              ? 'opacity-100 transform translate-y-0 animate-fade-in-up'
              : 'opacity-0 transform translate-y-10'
            }`}
          > 
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-khmer-title">
              រចនាសម្ព័ន្ធរបស់ ស.រ.ស
            </h2>
          </div>
          <p 
            ref={descriptionRef}
            className={`text-lg sm:text-xl md:text-2xl lg:text-3xl text-blue-100 max-w-3xl mx-auto leading-relaxed transition-all duration-1200 ${visibleSections.description
              ? 'opacity-100 transform translate-y-0 animate-slide-in-left'
              : 'opacity-0 transform translate-y-8'
            }`}
          >
            ក្រុមអ្នកជំនាញដែលមានបទពិសោធន៍ និងចំណេះដឹងជ្រាលជ្រៅ
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

export default TeamHero
