function AboutHero() {
  return (
    <div className="relative text-white py-16 lg:py-24 bg-cover bg-center bg-no-repeat">
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-blue-800/80 to-blue-900/50"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-khmer-title">
            អំពី រ.ស.រ
          </h1>
          <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            ស្ថាប័នឈានមុខគេក្នុងការផ្គត់ផ្គង់ទឹកស្អាត និងសេវាកម្មគុណភាព
          </p>
          <p className="text-lg text-blue-200 max-w-4xl mx-auto leading-relaxed">
            យើងមានបេសកកម្មក្នុងការធានាការផ្គត់ផ្គង់ទឹកស្អាតដល់សហគមន៍ 
            ដោយប្រើបច្ចេកវិទ្យាទំនើប និងការគ្រប់គ្រងប្រកបដោយប្រសិទ្ធភាព
          </p>
        </div>
      </div>
      
      {/* Decorative wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-8" viewBox="0 0 100 20" fill="none" preserveAspectRatio="none">
          <path d="M0 20L100 0V20H0Z" fill="rgb(255 255 255)" />
        </svg>
      </div>
    </div>
  )
}

export default AboutHero
