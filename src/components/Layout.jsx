import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

function Layout({ children, activeNav, setActiveNav }) {
  const navigate = useNavigate();
  const location = useLocation()
  const [selectedLanguage, setSelectedLanguage] = useState('kh')
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false)
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false)
  const [isDataDropdownOpen, setIsDataDropdownOpen] = useState(false)
  const servicesDropdownRef = useRef(null)
  const aboutDropdownRef = useRef(null)
  const dataDropdownRef = useRef(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target)) {
        setIsServicesDropdownOpen(false)
      }
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(event.target)) {
        setIsAboutDropdownOpen(false)
      }
      if (dataDropdownRef.current && !dataDropdownRef.current.contains(event.target)) {
        setIsDataDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const languages = [
    { code: 'kh', name: 'ខ្មែរ', flag: '/image/kh-flag.jpg' },
    { code: 'en', name: 'EN', flag: '/image/en-flag.jpg' }
  ]

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage)

  const servicesItems = [
    { id: 'water-supply', label: 'ការផ្គត់ផ្គង់ទឹកស្អាត', href: '/services/water-supply' },
    { id: 'water-treatment', label: 'ការចម្រាញ់ទឹក', href: '/services/water-treatment' },
    { id: 'maintenance', label: 'ការថែទាំ', href: '/services/maintenance' },
    { id: 'billing', label: 'ការបង់ប្រាក់', href: '/services/billing' },
    { id: 'customer-service', label: 'សេវាកម្មអតិថិជន', href: '/services/customer-service' },
  ]
  const aboutDropdownItems = [
    { id: 'team', label: 'ក្រុមការងារ', href: '/about/team' },
    { id: 'location-map', label: 'ផែនទីទីតាំង', href: '/about/location' }
  ]
  const dataItems = [
    { id: 'monthly', label: 'របាយការណ៍ប្រចាំខែ', href: '/data/monthly' },
    { id: 'yearly', label: 'របាយការណ៍ប្រចាំឆ្នាំ', href: '/data/yearly' }
  ]

  const navItems = [
    { id: 'home', label: 'ទំព័រដើម', href: '/home' },
    {
      id: 'about',
      label: 'អំពី រ.ស.រ',
      href: '/about',
      hasDropdown: true,
      dropdownItems: aboutDropdownItems
    },
    {
      id: 'services',
      label: 'សេវាកម្មពាក់ព័ន្ធនឹងការងារ',
      href: '/services',
      hasDropdown: true,
      dropdownItems: servicesItems
    },
    { id: 'news', label: 'ពត័ម៌ាន', href: '/news' },
    { id: 'laws', label: 'ច្បាប់', href: '/laws' },
    {
      id: 'data',
      label: 'ទិន្នន័យ',
      href: '/data',
      hasDropdown: true,
      dropdownItems: dataItems
    },
    { id: 'contact', label: 'ទំនាក់ទំនង', href: '/contact' }
  ]

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

          {/* Logo and Title Section */}
          <div className="px-3 sm:px-6 py-4 sm:py-8 bg-gradient-to-r from-blue-50 via-white to-cyan-50 w-full">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-4 sm:space-x-8">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-300 to-cyan-400 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                  <img
                    src="/image/រដ្ឋាករទឹកស្វាយរៀង (4).png"
                    alt="SVR Water Utility Logo"
                    className="relative h-16 w-16 sm:h-28 sm:w-28 rounded-full border-4 border-white object-cover shadow-xl group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-blue-700 tracking-tight leading-tight khmer-title">
                    រដ្ឋាករទឹកស្វាយរៀង
                  </h1>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <p className="text-sm sm:text-lg text-blue-800 font-semibold leading-tight">Svay Rieng Water Utility</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 items-end sm:items-center">
                {/* Search Button */}
                <button className="flex items-center justify-center space-x-1 sm:space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 sm:px-5 py-2 sm:py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-xs sm:text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>ស្វែងរក</span>
                </button>

                {/* Service Status Cards */}
                <div className="hidden lg:flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 px-4 py-3 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-center space-x-2">
                      <div>
                        <div className="text-blue-700 font-bold text-sm">សេវាកម្ម ២៤/៧</div>
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
        <nav className="shadow-sm border-b border-blue-200"
          style={{
            background: 'linear-gradient(to right, #FFE4E1, #F5FFFA)',
          }}>
          <div className="max-w-7xl mx-auto">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center px-4 sm:px-6 py-3">
              <div className="flex items-center space-x-4 lg:space-x-6">
                {navItems.map((item) => (
                  <div key={item.id} className="relative" ref={item.hasDropdown ? (item.id === 'services' ? servicesDropdownRef : item.id === 'about' ? aboutDropdownRef : dataDropdownRef) : null}>
                    {item.hasDropdown ? (
                      <>
                        <button
                          onClick={() => {
                            if (item.id === 'services') {
                              setIsServicesDropdownOpen(!isServicesDropdownOpen)
                              setIsAboutDropdownOpen(false)
                              setIsDataDropdownOpen(false)
                            } else if (item.id === 'about') {
                              setIsAboutDropdownOpen(!isAboutDropdownOpen)
                              setIsServicesDropdownOpen(false)
                              setIsDataDropdownOpen(false)
                            } else if (item.id === 'data') {
                              setIsDataDropdownOpen(!isDataDropdownOpen)
                              setIsServicesDropdownOpen(false)
                              setIsAboutDropdownOpen(false)
                            }
                          }}
                          className={`flex items-center space-x-1 px-3 lg:px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg ${location.pathname.startsWith(item.href)
                              ? 'bg-white text-blue-700 shadow-md'
                              : 'text-black-800 hover:text-blue-900 hover:bg-white/60'
                            }`}
                        >
                          <span>{item.label}</span>
                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${(item.id === 'services' && isServicesDropdownOpen) ||
                                (item.id === 'about' && isAboutDropdownOpen) ||
                                (item.id === 'data' && isDataDropdownOpen)
                                ? 'rotate-180' : ''
                              }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {((item.id === 'services' && isServicesDropdownOpen) || (item.id === 'about' && isAboutDropdownOpen) || (item.id === 'data' && isDataDropdownOpen)) && (
                          <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] overflow-hidden">
                            <div className="py-2">                                <Link
                                  to={item.href}
                                  onClick={() => {
                                    setActiveNav(item.id)
                                    if (item.id === 'services') {
                                      setIsServicesDropdownOpen(false)
                                    } else if (item.id === 'about') {
                                      setIsAboutDropdownOpen(false)
                                    } else if (item.id === 'data') {
                                      setIsDataDropdownOpen(false)
                                    }
                                  }}
                                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 border-b border-gray-100 font-medium"
                                >
                                  {item.id === 'services' ? 'សេវាកម្មទាំងអស់' : item.id === 'about' ? 'បេសកកម្មនិងចក្ខុវិស័យ' : 'ទិន្នន័យទាំងអស់'}
                                </Link>
                              {item.dropdownItems.map((dropdownItem) => (
                                <Link
                                  key={dropdownItem.id}
                                  to={dropdownItem.href}                                    onClick={() => {
                                      setActiveNav(item.id)
                                      if (item.id === 'services') {
                                        setIsServicesDropdownOpen(false)
                                      } else if (item.id === 'about') {
                                        setIsAboutDropdownOpen(false)
                                      } else if (item.id === 'data') {
                                        setIsDataDropdownOpen(false)
                                      }
                                    }}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                >
                                  {dropdownItem.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        to={item.href}
                        onClick={() => setActiveNav(item.id)}
                        className={`px-3 lg:px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg ${location.pathname === item.href || (location.pathname === '/' && item.id === 'home')
                            ? 'bg-white text-blue-700 shadow-md'
                            : 'text-black-800 hover:text-blue-900 hover:bg-white/60'
                          }`}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="text-blue-700 font-medium text-sm">
                  {navItems.find(item => location.pathname === item.href || (location.pathname === '/' && item.id === 'home'))?.label || 'ប្រការទ័រ'}
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-md text-blue-700 hover:text-blue-900 hover:bg-white/60 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isMobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>

              {/* Mobile Menu Dropdown */}
              {isMobileMenuOpen && (
                <div className="border-t border-blue-200 bg-white/90 backdrop-blur-sm">
                  <div className="px-2 pt-2 pb-3 space-y-1">
                    {navItems.map((item) => (
                      <div key={item.id}>
                        {item.hasDropdown ? (
                          <>
                            <button
                              onClick={() => {
                                if (item.id === 'services') {
                                  setIsServicesDropdownOpen(!isServicesDropdownOpen)
                                  setIsAboutDropdownOpen(false)
                                  setIsDataDropdownOpen(false)
                                } else if (item.id === 'about') {
                                  setIsAboutDropdownOpen(!isAboutDropdownOpen)
                                  setIsServicesDropdownOpen(false)
                                  setIsDataDropdownOpen(false)
                                } else if (item.id === 'data') {
                                  setIsDataDropdownOpen(!isDataDropdownOpen)
                                  setIsServicesDropdownOpen(false)
                                  setIsAboutDropdownOpen(false)
                                }
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md ${location.pathname.startsWith(item.href)
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'text-blue-700 hover:text-blue-900 hover:bg-blue-50'
                                }`}
                            >
                              <span>{item.label}</span>
                              <svg
                                className={`w-4 h-4 transition-transform duration-200 ${(item.id === 'services' && isServicesDropdownOpen) ||
                                    (item.id === 'about' && isAboutDropdownOpen) ||
                                    (item.id === 'data' && isDataDropdownOpen)
                                    ? 'rotate-180' : ''
                                  }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>

                            {/* Mobile Submenu */}
                            {((item.id === 'services' && isServicesDropdownOpen) || (item.id === 'about' && isAboutDropdownOpen) || (item.id === 'data' && isDataDropdownOpen)) && (
                              <div className="ml-4 mt-1 space-y-1">
                                <Link
                                  to={item.href}
                                  onClick={e => {
                                    e.preventDefault();
                                    setActiveNav(item.id);
                                    setIsMobileMenuOpen(false);
                                    if (item.id === 'services') {
                                      setIsServicesDropdownOpen(false);
                                    } else if (item.id === 'about') {
                                      setIsAboutDropdownOpen(false);
                                    } else if (item.id === 'data') {
                                      setIsDataDropdownOpen(false);
                                    }
                                    // Use SPA navigation for mobile submenu
                                    navigate(item.href);
                                  }}
                                  className="block px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md border-l-2 border-blue-200"
                                >
                                  📋 {item.id === 'services' ? 'សេវាកម្មទាំងអស់' : item.id === 'about' ? 'អំពីយើងទាំងអស់' : 'ទិន្នន័យទាំងអស់'}
                                </Link>
                                {item.dropdownItems.map((dropdownItem) => (
                                  <Link
                                    key={dropdownItem.id}
                                    to={dropdownItem.href}
                                    onClick={() => {
                                      setActiveNav(item.id)
                                      setIsMobileMenuOpen(false)
                                      if (item.id === 'services') {
                                        setIsServicesDropdownOpen(false)
                                      } else if (item.id === 'about') {
                                        setIsAboutDropdownOpen(false)
                                      } else if (item.id === 'data') {
                                        setIsDataDropdownOpen(false)
                                      }
                                    }}
                                    className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-800 hover:bg-blue-50 rounded-md border-l-2 border-gray-200"
                                  >
                                    {dropdownItem.label}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <Link
                            to={item.href}
                            onClick={() => {
                              setActiveNav(item.id)
                              setIsMobileMenuOpen(false)
                            }}
                            className={`block px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md ${location.pathname === item.href || (location.pathname === '/' && item.id === 'home')
                                ? 'bg-blue-100 text-blue-800'
                                : 'text-blue-700 hover:text-blue-900 hover:bg-blue-50'
                              }`}
                          >
                            {item.label}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

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
                      រដ្ឋករទឹកខេត្តស្វាយរៀង
                    </h3>
                    <p className="text-gray-300 text-sm">Svay Ring Water Utility</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  យើងជាស្ថាប័នឈានមុខគេក្នុងការផ្គត់ផ្គង់ទឹកស្អាត និងលើកកម្ពស់សុខុមាលភាពសហគមន៍។
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
