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
    <div className="relative text-white py-20 lg:py-28 overflow-hidden">
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-blue-800/80 to-blue-900/60"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 
            ref={titleRef}
            className={`text-5xl sm:text-6xl lg:text-6xl  mb-6 font-khmer-title transition-all duration-1200 ${
            visibleSections.title 
              ? 'opacity-100 transform translate-y-0 animate-fade-in-up' 
              : 'opacity-0 transform translate-y-10'
          }`}
          >
            ស្វាគមន៍មកកាន់
          </h1>
          <h1 ref={titleRef}
            className={`text-5xl sm:text-6xl lg:text-6xl  mb-6 font-khmer-title transition-all duration-1400 ${
            visibleSections.title 
              ? 'opacity-100 transform translate-y-0 animate-fade-in-up' 
              : 'opacity-0 transform translate-y-10'
          }`}>
          រដ្ឋាករទឹកស្វាយរៀង
          </h1>
          <p 
            ref={subtitleRef}
            className={`text-xl sm:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 ${
            visibleSections.subtitle 
              ? 'opacity-100 transform translate-y-0 animate-slide-in-left' 
              : 'opacity-0 transform translate-y-8'
          }`}
          >
            ផ្គត់ផ្គង់ទឹកស្អាតគុណភាពខ្ពស់ • សេវាកម្មប្រកបដោយគុណភាព • សហគមន៍រីកចម្រើន
          </p>
          
          <div 
            ref={buttonsRef}
            className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 transition-all duration-1000 ${
            visibleSections.buttons 
              ? 'opacity-100 transform translate-y-0 animate-slide-in-right' 
              : 'opacity-0 transform translate-y-8'
          }`}
          >
            <button className="bg-white text-blue-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
              <a href="/about" className="flex items-center justify-center space-x-2">
              ស្វែងយល់អំពីរ.ស.រ
              </a>
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-700 transition-all duration-200 hover:scale-105">
              <a href="/contact" className="flex items-center justify-center space-x-2">
              ទំនាក់ទំនងពួកយើង
              </a>
            </button>
          </div>

          {/* Stats */}
          <div 
            ref={statsRef}
            className={`grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 transition-all duration-1000 ${
            visibleSections.stats 
              ? 'opacity-100 transform translate-y-0 animate-slide-in-up' 
              : 'opacity-0 transform translate-y-8'
          }`}
          >
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="text-4xl lg:text-5xl font-bold mb-2 animate-bounce">១០០%</div>
              <div className="text-blue-200">គុណភាពទឹកស្អាត</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="text-4xl lg:text-5xl font-bold mb-2 animate-pulse">២៤/៧</div>
              <div className="text-blue-200">សេវាកម្មបម្រើ</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="text-4xl lg:text-5xl font-bold mb-2 animate-bounce">៨,០០០+</div>
              <div className="text-blue-200">គ្រួសារទទួលបាន</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-14" viewBox="0 0 100 20" fill="none" preserveAspectRatio="none">
          <path d="M0 20L50 0L100 20V20H0Z" fill="rgb(255 255 255)" />
        </svg>
      </div>
    </div>
  )
}

export default HeroSection
