import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import DesktopNavItem from './navbar/DesktopNavItem'
import MobileNavItem from './navbar/MobileNavItem'

function Navbar({ activeNav, setActiveNav }) {
  const navigate = useNavigate();
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null) // for mobile dropdown control
  const navRef = useRef(null) // for click outside detection

  const servicesItems = [
    { id: 'services', label: 'សេវវាកម្ម', href: '/services'},
    { id: 'water-supply', label: 'បំពេញពាក្យស្នើរសុំសេវាកម្ម', href: '/services/water-supply'},
    { id: 'water-treatment', label: 'ការចម្រាញ់ទឹក', href: '/services/water-treatment'},
    { id: 'maintenance', label: 'ការថែទាំ', href: '/services/maintenance'},
    { id: 'billing', label: 'ការបង់ប្រាក់', href: '/services/billing'},
    { id: 'customer-service', label: 'សេវាកម្មអតិថិជន', href: '/services/customer-service'},
  ]

  const aboutDropdownItems = [
    { id: 'about', label: 'អំពី រ.ស.រ', href: '/about'},
    { id: 'team', label: 'ក្រុមការងារ', href: '/about/team'},
    { id: 'location-map', label: 'ផែនទីទីតាំង', href: '/about/location'}
  ]

  const dataItems = [
    { id: 'data', label: 'ទិន្នន័យ', href: '/data'},
    { id: 'monthly', label: 'របាយការណ៍ប្រចាំខែ', href: '/data/monthly'},
    { id: 'yearly', label: 'របាយការណ៍ប្រចាំឆ្នាំ', href: '/data/yearly'}
  ]

  const navItems = [
    { 
      id: 'home', 
      label: 'ទំព័រដើម', 
      href: '/home', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 'about',
      label: 'អំពី រ.ស.រ',
      href: '/about',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      hasDropdown: true,
      dropdownItems: aboutDropdownItems
    },
    {
      id: 'services',
      label: 'សេវាកម្ម',
      href: '/services',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      hasDropdown: true,
      dropdownItems: servicesItems
    },
    { 
      id: 'news', 
      label: 'ពត័ម៌ាន', 
      href: '/news', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      )
    },
    { 
      id: 'laws', 
      label: 'ច្បាប់', 
      href: '/laws', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      )
    },
    {
      id: 'data',
      label: 'ទិន្នន័យ',
      href: '/data',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      hasDropdown: true,
      dropdownItems: dataItems
    },
    { 
      id: 'contact', 
      label: 'ទំនាក់ទំនង', 
      href: '/contact', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      )
    }
  ]

  const handleNavigation = (href, label, itemId) => {
    // Close all menus
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
    setActiveNav(itemId);

    // Navigate
    navigate(href);
    
    // Scroll to top of the new page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const toggleDropdown = (itemId) => {
    setOpenDropdown(openDropdown === itemId ? null : itemId);
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileMenuOpen) {
      setOpenDropdown(null); // Close any open dropdowns when closing mobile menu
    }
  }

  // Close mobile menu and dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
        setOpenDropdown(null);
      }
    };

    if (isMobileMenuOpen || openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMobileMenuOpen, openDropdown]);

  return (
    <nav 
      ref={navRef}
      className="bg-white shadow-lg border-b-4 border-blue-500 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-center py-1.5">
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <DesktopNavItem
                key={item.id}
                item={item}
                isActive={activeNav === item.id}
                onItemClick={handleNavigation}
                location={location}
              />
            ))}
            
            {/* Service Request Button */}
            <a
              href="/services/water-supply"
              className="ml-4 flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-green-400"
            >
              <span className="font-semibold">ស្នើសុំសេវាកម្ម</span>
            </a>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          {/* Mobile Header */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2 text-blue-700 font-bold">
              <span>{navItems.find(item => item.id === activeNav)?.label}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Mobile Service Request Button */}
              <a
                href="/services/water-supply"
                className="flex items-center space-x-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-2 py-1.5 rounded-full text-xs font-medium shadow-lg hover:shadow-xl transition-all duration-200 border border-green-400"
              >
                <span className="font-semibold">ស្នើសុំសេវាកម្ម</span>
              </a>
              
              <button
              onClick={toggleMobileMenu}
              className="relative w-10 h-10 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-menu"
            >
              <div className="relative">
                <span className={`block w-6 h-0.5 bg-blue-600 transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} aria-hidden="true"></span>
                <span className={`block w-6 h-0.5 bg-blue-600 mt-1.5 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} aria-hidden="true"></span>
                <span className={`block w-6 h-0.5 bg-blue-600 mt-1.5 transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} aria-hidden="true"></span>
              </div>
            </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen pb-4' : 'max-h-0'}`}
            id="mobile-navigation-menu"
            role="navigation"
            aria-label="Mobile navigation menu"
          >
            <div className="bg-gray-50 rounded-xl p-3 space-y-2">
              {navItems.map((item) => (
                <MobileNavItem
                  key={item.id}
                  item={item}
                  isActive={activeNav === item.id}
                  onItemClick={handleNavigation}
                  location={location}
                  openDropdown={openDropdown}
                  onToggleDropdown={toggleDropdown}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar