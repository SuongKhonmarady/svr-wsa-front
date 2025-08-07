import { useLocation } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react' // 1. Import new hooks
import Navbar from './Navbar'

function Layout({ children, activeNav, setActiveNav }) {
  const location = useLocation()
  const [selectedLanguage, setSelectedLanguage] = useState('kh')
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)

  // 2. Add state and ref for the search functionality
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef(null)
  const searchContainerRef = useRef(null)

  const languages = [
    { code: 'kh', name: 'ខ្មែរ', flag: '/image/kh-flag.jpg' },
    { code: 'en', name: 'EN', flag: '/image/en-flag.jpg' }
  ]

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage)

  // 3. Add an effect to auto-focus the input when it appears
  useEffect(() => {
    if (isSearchOpen) {
      // Use a tiny delay to ensure the input is rendered before focusing
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isSearchOpen]) // This effect runs whenever isSearchOpen changes

  // 4. Create handler functions for search interaction
  const handleSearchClick = () => {
    setIsSearchOpen(true)
  }

  const handleSearchBlur = () => {
    // Only close if search is empty
    if (searchQuery.trim() === '') {
      setIsSearchOpen(false)
    }
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Handle search logic here
      console.log('Searching for:', searchQuery)
      // You can add your search logic here
    }
  }

  const handleSearchClose = () => {
    setIsSearchOpen(false)
    setSearchQuery('')
  }

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        if (searchQuery.trim() === '') {
          setIsSearchOpen(false)
        }
      }
    }

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isSearchOpen, searchQuery])

  return (
    <div className="min-h-screen bg-gray-50/70 relative">
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white shadow-xl border-b border-blue-100">
          {/* Top bar */}
          <div
            className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm w-full"
            style={{
              background: 'linear-gradient(120deg, #4169E1 10%, #483D8B 70%, #1E90FF 100%)',
              borderBottom: '2px solid rgba(6, 182, 212, 0.3)'
            }}
          >
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center space-x-3 sm:space-x-8 text-white">
                <div className="hidden sm:flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm">
                  <span className="text-yellow-300">📍</span>
                  <span className="font-medium">ស្រុកស្វាយរៀង ខេត្តស្វាយរៀង ព្រះរាជាណាចក្រកម្ពុជា</span>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-6">
                  <div className="flex items-center space-x-1 sm:space-x-2 bg-white/10 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 backdrop-blur-sm">
                    <span className="text-green-300">📞</span>
                    <span className="font-medium">0123 456 789</span>
                  </div>
                  <div className="xs:flex items-center space-x-1 sm:space-x-2 bg-white/10 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 backdrop-blur-sm">
                    <span className="text-blue-300">✉️</span>
                    <span className="hidden sm:inline font-medium">info@svayringwater.gov.kh</span>
                    <span className="sm:hidden font-medium">Email</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Language Selector */}
                <div className="relative">
                  <button
                    onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                    className="flex items-center space-x-1 sm:space-x-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 pr-4 sm:pr-6 text-xs sm:text-sm text-white hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 cursor-pointer shadow-lg min-w-[60px] sm:min-w-[80px]"
                  >
                    <img
                      src={currentLanguage.flag}
                      alt={`${currentLanguage.name} flag`}
                      className="w-4 sm:w-5 h-3 sm:h-4 object-cover rounded border border-white/30 shadow-sm"
                    />
                    <span className="font-medium">{currentLanguage.name}</span>
                  </button>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-1 sm:pr-2 pointer-events-none">
                    <svg className={`w-3 sm:w-4 h-3 sm:h-4 text-white/80 transition-transform duration-200 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                          className={`w-full flex items-center space-x-1 sm:space-x-2 px-3 py-2 text-xs sm:text-sm hover:bg-blue-50 transition-colors duration-150 ${selectedLanguage === language.code ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'
                            }`}
                        >
                          <img
                            src={language.flag}
                            alt={`${language.name} flag`}
                            className="w-4 sm:w-5 h-3 sm:h-4 object-cover rounded border border-gray-200"
                          />
                          <span>{language.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
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
                  <img
                    src="/image/រដ្ឋាករទឹកស្វាយរៀង (4).png"
                    alt="SVR Water Utility Logo"
                    className="relative h-14 w-14 sm:h-20 sm:w-20 lg:h-24 lg:w-24 rounded-full border-3 sm:border-4 border-white object-cover shadow-xl group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
                  <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-700 tracking-tight leading-tight khmer-title break-words">
                    រដ្ឋាករទឹកស្វាយរៀង
                  </h1>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-blue-800 font-semibold leading-tight">Svay Rieng Water Utility</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 items-center w-full sm:w-auto">

                {/* Enhanced Search Component with Mobile Support */}
                <div ref={searchContainerRef} className="relative flex items-center h-full w-full sm:w-auto order-2 sm:order-1">
                  {isSearchOpen ? (
                    // Search input form with mobile optimization
                    <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-auto">
                      <div className="flex items-center bg-white border-2 border-blue-500 rounded-xl shadow-lg overflow-hidden w-full sm:w-56 md:w-64">
                        <input
                          ref={searchInputRef}
                          value={searchQuery}
                          onChange={handleSearchChange}
                          onBlur={handleSearchBlur}
                          type="text"
                          placeholder="វាយបញ្ចូលដើម្បីស្វែងរក..."
                          className="flex-1 px-4 py-2.5 sm:py-3 focus:outline-none text-sm sm:text-base text-gray-700 placeholder-gray-400"
                        />
                        <div className="flex items-center">
                          {searchQuery && (
                            <button
                              type="button"
                              onClick={handleSearchClose}
                              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                          <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2.5 sm:p-3 transition-colors duration-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      {/* Mobile: Show search suggestions/results dropdown */}
                      {searchQuery && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-[60] max-h-60 overflow-y-auto">
                          <div className="p-3 text-sm text-gray-500 border-b bg-gray-50">
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                              <span>ស្វែងរក: "{searchQuery}"</span>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="text-sm text-gray-500 text-center">
                              <div className="space-y-2">
                                <div className="text-gray-400">មិនមានលទ្ធផលស្វែងរក</div>
                                <div className="text-xs text-gray-300">សូមព្យាយាមជាមួយពាក្យគន្លឹះផ្សេងទៀត</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </form>
                  ) : (
                    // Search button with improved mobile design
                    <button
                      onClick={handleSearchClick}
                      className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 sm:px-5 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm font-medium w-full sm:w-auto min-w-[140px]"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="whitespace-nowrap">ស្វែងរក</span>
                    </button>
                  )}
                </div>

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
                <div className="flex flex-col space-y-2 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-400">📍</span>
                    <span>ស្រុកស្វាយរៀង ខេត្តស្វាយរៀង</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-400">📞</span>
                    <span>0123 456 789</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-400">✉️</span>
                    <span>info@svayringwater.gov.kh</span>
                  </div>
                </div>
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
                <h4 className="font-semibold text-lg mb-6 text-white">តំណភ្ជាប់ខាងក្រៅ</h4>
                <ul className="space-y-3 mb-6">
                  <li><a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">ក្រសួងមហាផ្ទៃ</a></li>
                  <li><a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">ក្រុមប្រឹក្សាខេត្ត</a></li>
                  <li><a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">រាជរដ្ឋាភិបាលកម្ពុជា</a></li>
                </ul>

                <div>
                  <h5 className="font-medium text-white mb-3">ការងារសេវាកម្ម</h5>
                  <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-3 rounded-lg text-sm">
                    <div className="font-semibold">សេវាកម្ម ២៤/៧</div>
                    <div className="text-blue-100 text-xs">តែងតែបម្រើដល់អ្នក</div>
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
                  <a href="#" className="hover:text-white transition-colors">គោលនយោបាយឯកជនភាព</a>
                  <a href="#" className="hover:text-white transition-colors">លក្ខខណ្ឌប្រើប្រាស់</a>
                  <a href="#" className="hover:text-white transition-colors">ផែនទីគេហទំព័រ</a>
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