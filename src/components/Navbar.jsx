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
    { id: 'water-supply', label: 'ការផ្គត់ផ្គង់ទឹកស្អាត', href: '/services/water-supply', icon: '💧' },
    { id: 'water-treatment', label: 'ការចម្រាញ់ទឹក', href: '/services/water-treatment', icon: '🔧' },
    { id: 'maintenance', label: 'ការថែទាំ', href: '/services/maintenance', icon: '🛠️' },
    { id: 'billing', label: 'ការបង់ប្រាក់', href: '/services/billing', icon: '💳' },
    { id: 'customer-service', label: 'សេវាកម្មអតិថិជន', href: '/services/customer-service', icon: '👥' },
  ]

  const aboutDropdownItems = [
    { id: 'team', label: 'ក្រុមការងារ', href: '/about/team', icon: '👨‍💼' },
    { id: 'location-map', label: 'ផែនទីទីតាំង', href: '/about/location', icon: '📍' }
  ]

  const dataItems = [
    { id: 'monthly', label: 'របាយការណ៍ប្រចាំខែ', href: '/data/monthly', icon: '📊' },
    { id: 'yearly', label: 'របាយការណ៍ប្រចាំឆ្នាំ', href: '/data/yearly', icon: '📈' }
  ]

  const navItems = [
    { id: 'home', label: 'ទំព័រដើម', href: '/home', icon: '🏠' },
    {
      id: 'about',
      label: 'អំពី រ.ស.រ',
      href: '/about',
      icon: '🏢',
      hasDropdown: true,
      dropdownItems: aboutDropdownItems
    },
    {
      id: 'services',
      label: 'សេវាកម្ម',
      href: '/services',
      icon: '⚙️',
      hasDropdown: true,
      dropdownItems: servicesItems
    },
    { id: 'news', label: 'ពត័ម៌ាន', href: '/news', icon: '📰' },
    { id: 'laws', label: 'ច្បាប់', href: '/laws', icon: '⚖️' },
    {
      id: 'data',
      label: 'ទិន្នន័យ',
      href: '/data',
      icon: '📋',
      hasDropdown: true,
      dropdownItems: dataItems
    },
    { id: 'contact', label: 'ទំនាក់ទំនង', href: '/contact', icon: '📞' }
  ]

  const handleNavigation = (href, label, itemId) => {
    // Close all menus
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
    setActiveNav(itemId);

    // Navigate
    navigate(href);
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
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          {/* Mobile Header */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2 text-blue-700 font-bold">
              <span className="text-xl">🏢</span>
              <span>Navigation</span>
            </div>
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