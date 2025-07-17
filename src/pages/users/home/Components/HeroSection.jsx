function HeroSection() {
  return (
    <div className="relative text-white py-20 lg:py-28 overflow-hidden">
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-blue-800/80 to-blue-900/60"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7x font-bold mb-8 font-khmer-title">
            ស្វាគមន៍មកកាន់<br/>រដ្ឋាករទឹកស្វាយរៀង
          </h1>
          <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
            ផ្គត់ផ្គង់ទឹកស្អាតគុណភាពខ្ពស់ • សេវាកម្មប្រកបដោយគុណភាព • សហគមន៍រីកចម្រើន
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="bg-white text-blue-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-colors duration-200 shadow-lg">
              <a href="/about" className="flex items-center space-x-2">
              ស្វែងយល់បន្ថែម
              </a>
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-700 transition-colors duration-200">
              <a href="/contact" className="flex items-center space-x-2">
              ទំនាក់ទំនងយើង
              </a>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">១០០%</div>
              <div className="text-blue-200">គុណភាពទឹកស្អាត</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">២៤/៧</div>
              <div className="text-blue-200">សេវាកម្មបម្រើ</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">៨,០០០+</div>
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
