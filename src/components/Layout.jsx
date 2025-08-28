import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './Navbar'
import GlobalSearch from './GlobalSearch'
import useScrollToTop from '../hooks/useScrollToTop'

function Layout({ children, activeNav, setActiveNav }) {
  const location = useLocation()
  const [selectedLanguage, setSelectedLanguage] = useState('kh')
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  
  // Auto-scroll to top on route change
  useScrollToTop()

  const languages = [
    { code: 'kh', name: 'ខ្មែរ', flag: '/image/kh-flag.jpg' },
    { code: 'en', name: 'EN', flag: '/image/en-flag.jpg' }
  ]

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage)

  return (
    <div className="min-h-screen bg-gray-50/70 relative">
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white shadow-xl border-b border-blue-100">
          {/* Top bar - Enhanced UX for Desktop and Mobile */}
          <div
            className="px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm w-full relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 25%, #06b6d4 50%, #0891b2 75%, #0e7490 100%)',
              borderBottom: '2px solid rgba(6, 182, 212, 0.4)'
            }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '20px 20px'
              }}></div>
            </div>

            <div className="relative z-10">
              {/* Desktop View */}
              <div className="hidden lg:flex justify-between items-center w-full">
                <div className="flex items-center space-x-6 text-white">
                  {/* Location Info */}
                  <div className="flex items-center space-x-2 bg-white/15 rounded-full px-4 py-2 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                    <span className="text-yellow-300 text-lg group-hover:scale-110 transition-transform duration-300">📍</span>
                    <span className="font-medium text-sm">ស្រុកស្វាយរៀង ខេត្តស្វាយរៀង ព្រះរាជាណាចក្រកម្ពុជា</span>
                  </div>

                  {/* Contact Info */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 bg-white/15 rounded-full px-4 py-2 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                      <span className="text-green-300 text-lg group-hover:scale-110 transition-transform duration-300">📞</span>
                      <span className="font-medium text-sm">0123 456 789</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/15 rounded-full px-4 py-2 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                      <span className="text-blue-300 text-lg group-hover:scale-110 transition-transform duration-300">✉️</span>
                      <span className="font-medium text-sm">info@svayringwater.gov.kh</span>
                    </div>
                  </div>
                </div>

                {/* Language Selector - Desktop */}
                {/* <div className="flex items-center space-x-3">
                  <div className="relative">
                    <button
                      onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                      className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 pr-6 text-sm text-white hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 cursor-pointer shadow-lg min-w-[80px] hover:scale-105 transform"
                    >
                      <img
                        src={currentLanguage.flag}
                        alt={`${currentLanguage.name} flag`}
                        className="w-5 h-4 object-cover rounded border border-white/30 shadow-sm"
                      />
                      <span className="font-medium">{currentLanguage.name}</span>
                    </button>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg className={`w-4 h-4 text-white/80 transition-transform duration-200 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    {isLanguageDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] overflow-hidden">
                        {languages.map((language) => (
                          <button
                            key={language.code}
                            onClick={() => {
                              setSelectedLanguage(language.code)
                              setIsLanguageDropdownOpen(false)
                            }}
                            className={`w-full flex items-center space-x-2 px-4 py-2 text-sm hover:bg-blue-50 transition-colors duration-150 ${selectedLanguage === language.code ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'}`}
                          >
                            <img
                              src={language.flag}
                              alt={`${language.name} flag`}
                              className="w-5 h-4 object-cover rounded border border-gray-200"
                            />
                            <span>{language.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div> */}
              </div>

              {/* Mobile View - Simplified: Only Location and Language */}
              <div className="lg:hidden">
                <div className="flex items-center justify-between">
                  {/* Location Only */}
                  <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2 backdrop-blur-sm border border-white/30">
                    <span className="text-yellow-300 text-base">📍</span>
                    <span className="font-medium text-xs text-white">ស្រុកស្វាយរៀង ខេត្តស្វាយរៀង</span>
                  </div>

                  {/* Language Selector */}
                  {/* <div className="relative">
                    <button
                      onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                      className="flex items-center space-x-2 bg-white/25 backdrop-blur-sm border border-white/40 rounded-lg px-3 py-2 text-xs text-white hover:bg-white/35 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 cursor-pointer shadow-lg min-w-[60px]"
                    >
                      <img
                        src={currentLanguage.flag}
                        alt={`${currentLanguage.name} flag`}
                        className="w-4 h-3 object-cover rounded border border-white/40 shadow-sm"
                      />
                      <span className="font-medium">{currentLanguage.name}</span>
                      <svg className={`w-3 h-3 text-white/80 transition-transform duration-200 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isLanguageDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] overflow-hidden">
                        {languages.map((language) => (
                          <button
                            key={language.code}
                            onClick={() => {
                              setSelectedLanguage(language.code)
                              setIsLanguageDropdownOpen(false)
                            }}
                            className={`w-full flex items-center space-x-2 px-3 py-2 text-xs hover:bg-blue-50 transition-colors duration-150 ${selectedLanguage === language.code ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'}`}
                          >
                            <img
                              src={language.flag}
                              alt={`${language.name} flag`}
                              className="w-4 h-3 object-cover rounded border border-gray-200"
                            />
                            <span>{language.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div> */}
                </div>
              </div>
            </div>
          </div>

          {/* Logo and Title Section - Mobile Optimized */}
          <div className="px-3 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-50 via-gray-100 to-cyan-50 w-full">
            <div className="flex flex-col sm:flex-row items-center justify-between w-full space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-8 w-full sm:w-auto">
                <div className="relative group flex-shrink-0">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-300 to-cyan-400 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                  <a href="/">
                    <img
                      src="/image/រដ្ឋាករទឹកស្វាយរៀង (4).png"
                      alt="SVR Water Utility Logo"
                      className="relative h-14 w-14 sm:h-20 sm:w-20 lg:h-30 lg:w-30 rounded-full border-2 sm:border-4 border-blue-300 object-cover shadow-xl group-hover:scale-105 transition-transform duration-300"
                    />
                  </a>
                </div>

                <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
                  <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-700 tracking-tight leading-tight khmer-title break-words">
                    រដ្ឋាករទឹកស្វាយរៀង
                  </h1>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <p className="text-xs sm:text-sm md:text-base lg:text-3xl text-blue-800 font-semibold leading-tight">SVAY RIENG WATER UTILITY</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 items-center w-full sm:w-auto">

                {/* Enhanced Search Component with Mobile Support */}
                <GlobalSearch />

                {/* Service Status Cards - Hidden on small mobile, visible on larger screens */}
                <div className="hidden md:flex items-center space-x-3 order-1 sm:order-2">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-center space-x-2">
                      <div>
                        <div className="text-blue-700 font-bold text-xs sm:text-sm">សេវាកម្ម ២៤/៧</div>
                        <div className="text-blue-600 text-xs">តែងតែបម្រើដល់អ្នក</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <Navbar activeNav={activeNav} setActiveNav={setActiveNav} />

        {/* Main Content */}
        {children}

        {/* Footer */}
        <footer className="bg-gray-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {/* Company Info Section */}
              <div className="md:col-span-1">
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src="/image/រដ្ឋាករទឹកស្វាយរៀង (4).png"
                    alt="Company Logo"
                    className="h-24 w-24 rounded-full object-cover border-2 border-gray-600"
                  />
                  <div>
                    <h3 className="font-bold text-lg mb-1 font-khmer-title">
                      រដ្ឋករទឹកស្វាយរៀង
                    </h3>
                    <p className="text-gray-300 text-sm">Svay Ring Water Utility</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  រដ្ឋករទឹកស្វាយរៀងជាស្ថាប័នឈានមុខក្នុងការផ្គត់ផ្គង់ទឹកស្អាត និងលើកកម្ពស់សុខុមាលក្នុងភាពសហគមន៍។
                </p>

              </div>

              {/* Quick Links */}
              <div className="md:col-span-1">
                <h4 className="font-semibold text-lg mb-6 text-white">តំណភ្ជាប់រហ័ស</h4>
                <ul className="space-y-3">
                  <li><a href="/about" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">អំពីយើង</a></li>
                  <li><a href="/services" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">សេវាកម្ម</a></li>
                  <li><a href="/news" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">ព័ត៌មានថ្មី</a></li>
                  <li><a href="/laws" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">ច្បាប់ និងបទបញ្ញត្តិ</a></li>
                  <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">ទំនាក់ទំនង</a></li>
                </ul>
              </div>

              {/* External Links */}
              <div className="md:col-span-1">
                <div>
                  <h5 className="font-medium text-white mb-3">ការងារសេវាកម្ម</h5>
                  <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-3 rounded-lg text-sm mb-6">
                    <div className="font-semibold">សេវាកម្ម ២៤/៧</div>
                    <div className="text-blue-100 text-xs">តែងតែបម្រើដល់អ្នក</div>
                  </div>
                </div>
                <div className="flex flex-col space-y-3 text-sm text-gray-400">
                  <div className="flex items-center space-x-3">
                    <img
                      src="/image/location_icon.png"
                      alt="Location"
                      className="w-5 h-5 text-blue-400"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'inline';
                      }}
                    />
                    <span style={{ display: 'none' }} className="text-blue-400">📍</span>
                    <span>ស្រុកស្វាយរៀង ខេត្តស្វាយរៀង</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <img
                      src="/image/phone_icon.png"
                      alt="Phone"
                      className="w-5 h-5 text-blue-400"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'inline';
                      }}
                    />
                    <span style={{ display: 'none' }} className="text-blue-400">📞</span>
                    <span>0123 456 789</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <img
                      src="/image/gmail_icon.png"
                      alt="Gmail"
                      className="w-5 h-5 text-blue-400"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'inline';
                      }}
                    />
                    <span style={{ display: 'none' }} className="text-blue-400">✉️</span>
                    <span>info@svayringwater.gov.kh</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <img
                      src="/image/facebook_icon.png"
                      alt="Facebook"
                      className="w-5 h-5 text-blue-400"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'inline';
                      }}
                    />
                    <span style={{ display: 'none' }} className="text-blue-400">fb</span>
                    <a
                      href="https://www.facebook.com/profile.php?id=61554779397494"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors duration-200 cursor-pointer"
                    >
                      រដ្ឋករទឹកស្វាយរៀង ស.រ.ស
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 mt-8 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <p className="text-sm text-gray-400">
                  &copy; 2025 រដ្ឋករទឹកស្វាយរៀង។ រក្សាសិទ្ធិគ្រប់យ៉ាង។
                </p>
                <div className="flex space-x-6 text-sm text-gray-400">
                  <a href="/privacy" className="hover:text-white transition-colors">គោលនយោបាយឯកជនភាព</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Layout