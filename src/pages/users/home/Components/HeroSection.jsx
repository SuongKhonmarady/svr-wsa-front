import { useState, useEffect, useRef } from 'react'

function HeroSection() {
  const [visibleSections, setVisibleSections] = useState({
    title: false,
    subtitle: false,
    buttons: false,
    stats: false
  });

  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);
  const statsRef = useRef(null);

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
    if (buttonsRef.current) {
      buttonsRef.current.dataset.section = 'buttons';
      observer.observe(buttonsRef.current);
    }
    if (statsRef.current) {
      statsRef.current.dataset.section = 'stats';
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative text-white py-8 sm:py-12 md:py-16 lg:py-28 overflow-hidden">
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-blue-800/80 to-blue-900/60"></div>

      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center">
          <div ref={titleRef} data-section="title">
            <h1 
              className={`text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-2 sm:mb-3 md:mb-4 lg:mb-6 font-khmer-title transition-all duration-1200 leading-tight px-2 sm:px-0 ${
              visibleSections.title 
                ? 'opacity-100 transform translate-y-0 animate-fade-in-up' 
                : 'opacity-0 transform translate-y-10'
            }`}
            >
              ស្វាគមន៍មកកាន់
            </h1>
            <h1 
              className={`text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 md:mb-8 font-khmer-title transition-all duration-1400 leading-tight px-2 sm:px-0 ${
              visibleSections.title 
                ? 'opacity-100 transform translate-y-0 animate-fade-in-up' 
                : 'opacity-0 transform translate-y-10'
            }`}
            >
              រដ្ឋាករទឹកស្វាយរៀង
            </h1>
          </div>
          
          <p 
            ref={subtitleRef}
            className={`text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 mb-4 sm:mb-6 md:mb-8 max-w-4xl mx-auto leading-relaxed px-3 sm:px-2 md:px-0 transition-all duration-1000 ${
            visibleSections.subtitle 
              ? 'opacity-100 transform translate-y-0 animate-slide-in-left' 
              : 'opacity-0 transform translate-y-8'
          }`}
          >
            ផ្គត់ផ្គង់ទឹកស្អាតគុណភាពខ្ពស់ • សេវាកម្មប្រកបដោយគុណភាព • សហគមន៍រីកចម្រើន
          </p>
          
          <div 
            ref={buttonsRef}
            className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 md:mb-12 transition-all duration-1000 px-3 sm:px-4 md:px-0 ${
            visibleSections.buttons 
              ? 'opacity-100 transform translate-y-0 animate-slide-in-right' 
              : 'opacity-0 transform translate-y-8'
          }`}
          >
            <button className="bg-white text-blue-700 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full font-semibold text-sm sm:text-base md:text-lg hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 w-full sm:w-auto">
              <a href="/about" className="flex items-center justify-center space-x-2">
                ស្វែងយល់អំពីរ.ស.រ
              </a>
            </button>
            <button className="border-2 border-white text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full font-semibold text-sm sm:text-base md:text-lg hover:bg-white hover:text-blue-700 transition-all duration-200 hover:scale-105 w-full sm:w-auto">
              <a href="/contact" className="flex items-center justify-center space-x-2">
                ទំនាក់ទំនងពួកយើង
              </a>
            </button>
          </div>

          {/* Stats */}
          <div 
            ref={statsRef}
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mt-8 sm:mt-12 md:mt-16 transition-all duration-1000 px-3 sm:px-4 md:px-0 ${
            visibleSections.stats 
              ? 'opacity-100 transform translate-y-0 animate-slide-in-up' 
              : 'opacity-0 transform translate-y-8'
          }`}
          >
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 animate-bounce">១០០%</div>
              <div className="text-blue-200 text-xs sm:text-sm md:text-base">គុណភាពទឹកស្អាត</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 animate-pulse">២៤/៧</div>
              <div className="text-blue-200 text-xs sm:text-sm md:text-base">សេវាកម្មបម្រើ</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 sm:col-span-2 lg:col-span-1">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 animate-bounce">៨,០០០+</div>
              <div className="text-blue-200 text-xs sm:text-sm md:text-base">គ្រួសារទទួលបាន</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-10 sm:h-14" viewBox="0 0 100 20" fill="none" preserveAspectRatio="none">
          <path d="M0 20L50 0L100 20V20H0Z" fill="rgb(255 255 255)" />
        </svg>
      </div>
    </div>
  )
}

export default HeroSection
