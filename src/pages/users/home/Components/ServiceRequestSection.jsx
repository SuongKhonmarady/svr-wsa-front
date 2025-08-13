import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

function ServiceRequestSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px -50px 0px'
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <div ref={sectionRef} className="py-16 relative">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-1000 ${
          isVisible 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform translate-y-8'
        }`}>
          <div className="lg:grid lg:grid-cols-2 lg:gap-0">
            {/* Content Section */}
            <div className={`px-8 py-12 lg:px-12 lg:py-16 transition-all duration-1000 delay-200 ${
              isVisible 
                ? 'opacity-100 transform translate-x-0' 
                : 'opacity-0 transform -translate-x-8'
            }`}>
              <div className="max-w-lg mx-auto lg:max-w-none">
                <h2 className={`text-3xl font-bold text-gray-900 mb-6 font-khmer-title transition-all duration-1000 delay-300 ${
                  isVisible 
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform translate-y-4'
                }`}>
                  ស្នើសុំសេវាកម្មទឹកស្អាត
                </h2>
                <p className={`text-lg text-gray-600 mb-8 leading-relaxed transition-all duration-1000 delay-400 ${
                  isVisible 
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform translate-y-4'
                }`}>
                  តម្រូវការសេវាកម្មផ្គត់ផ្គង់ទឹកស្អាត? ដាក់ពាក្យសុំឥឡូវនេះ! យើងនឹងដាក់ដំណើរការលឿន និងផ្តល់សេវាកម្មគុណភាពខ្ពស់ដល់អ្នក។
                </p>
                
                {/* Features */}
                <div className="space-y-4 mb-8">
                  {[
                    "ដំណើរការលឿនក្នុងរយៈពេល ២៤-៤៨ ម៉ោង",
                    "បំពេញទម្រង់អនឡាញងាយស្រួល",
                    "តាមដានស្ថានភាពសំណើរបស់អ្នក",
                    "ការគាំទ្រផ្នែកបច្ចេកទេស ២៤/៧"
                  ].map((feature, index) => (
                    <div 
                      key={index}
                      className={`flex items-start space-x-3 transition-all duration-1000 ${
                        isVisible 
                          ? 'opacity-100 transform translate-x-0' 
                          : 'opacity-0 transform -translate-x-4'
                      }`}
                      style={{ transitionDelay: `${500 + index * 100}ms` }}
                    >
                      <div className="flex-shrink-0">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-gray-700">{feature}</p>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <a
                  href="/services/water-supply"
                  className={`inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-1000 shadow-lg hover:shadow-xl group ${
                    isVisible 
                      ? 'opacity-100 transform translate-y-0 scale-100' 
                      : 'opacity-0 transform translate-y-4 scale-95'
                  }`}
                  style={{ transitionDelay: '900ms' }}
                >
                  <svg className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  ដាក់ពាក្យឥឡូវនេះ
                </a>
              </div>
            </div>

            {/* Visual Section */}
            <div className={`relative lg:flex lg:items-center transition-all duration-1000 delay-300 ${
              isVisible 
                ? 'opacity-100 transform translate-x-0' 
                : 'opacity-0 transform translate-x-8'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800"></div>
              <div className="relative px-8 py-12 lg:px-12 lg:py-16">
                <div className="text-center text-white">
                  {/* Large Icon */}
                  <div className={`mx-auto w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6 transition-all duration-1000 delay-500 ${
                    isVisible 
                      ? 'opacity-100 transform scale-100 rotate-0' 
                      : 'opacity-0 transform scale-75 rotate-45'
                  }`}>
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { value: "៩៨%", label: "អាត្រាសុវត្ថិភាព" },
                      { value: "ក្នុងរយះពេល១២ម៉ោង", label: "ពួកយើងនិងឆ្លើយតបទៅវិញ" },
                      // { value: "1,200+", label: "សំណើបានអនុម័ត" },
                      { value: "៧០+", label: "អតិថិជនខែនេះ" }
                    ].map((stat, index) => (
                      <div 
                        key={index}
                        className={`transition-all duration-1000 ${
                          isVisible 
                            ? 'opacity-100 transform translate-y-0' 
                            : 'opacity-0 transform translate-y-4'
                        }`}
                        style={{ transitionDelay: `${600 + index * 100}ms` }}
                      >
                        <div className="text-3xl font-bold mb-2">{stat.value}</div>
                        <div className="text-blue-100 text-sm">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className={`absolute top-0 right-0 -mt-4 -mr-4 w-16 h-16 bg-white/5 rounded-full transition-all duration-1000 delay-700 ${
                isVisible 
                  ? 'opacity-100 transform scale-100' 
                  : 'opacity-0 transform scale-0'
              }`}></div>
              <div className={`absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white/5 rounded-full transition-all duration-1000 delay-800 ${
                isVisible 
                  ? 'opacity-100 transform scale-100' 
                  : 'opacity-0 transform scale-0'
              }`}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceRequestSection
