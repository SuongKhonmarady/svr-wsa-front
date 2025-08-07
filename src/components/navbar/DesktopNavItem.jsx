import React, { useState, useRef } from 'react';
import DropdownMenu from './DropdownMenu';
import { useIsTouchDevice, useClickOutside } from './hooks';

function DesktopNavItem({ 
  item, 
  isActive, 
  onItemClick, 
  location 
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isTouchDevice = useIsTouchDevice();

  // Close dropdown when clicking outside
  useClickOutside(dropdownRef, () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  });

  const handleDropdownToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMouseEnter = () => {
    // Only use hover on non-touch devices
    if (!isTouchDevice) {
      setIsDropdownOpen(true);
    }
  };

  const handleMouseLeave = () => {
    // Only use hover on non-touch devices  
    if (!isTouchDevice) {
      setIsDropdownOpen(false);
    }
  };

  if (item.hasDropdown) {
    return (
      <div 
        ref={dropdownRef}
        className="relative group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Desktop Dropdown Trigger */}
        <button
          onClick={isTouchDevice ? handleDropdownToggle : undefined}
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            location.pathname.startsWith(item.href)
              ? 'bg-blue-100 text-blue-700 shadow-md'
              : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
          }`}
          aria-haspopup="true"
          aria-expanded={isDropdownOpen}
          aria-controls={`desktop-menu-${item.id}`}
          aria-label={`${item.label} menu`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsDropdownOpen(!isDropdownOpen);
              // Focus first menu item when opened via keyboard
              setTimeout(() => {
                const firstMenuItem = document.querySelector(`#desktop-menu-${item.id} [role="menuitem"]`);
                if (firstMenuItem && !isDropdownOpen) firstMenuItem.focus();
              }, 100);
            }
            if (e.key === 'Escape') {
              setIsDropdownOpen(false);
            }
          }}
        >
          <span className="text-lg">{item.icon}</span>
          <span>{item.label}</span>
          <svg 
            className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Desktop Dropdown Menu */}
        <div className={`absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-gray-200 transition-all duration-200 transform z-50 ${
          isDropdownOpen 
            ? 'opacity-100 visible scale-100' 
            : 'opacity-0 invisible scale-95 pointer-events-none'
        }`}>
          <DropdownMenu
            item={item}
            isOpen={isDropdownOpen}
            onItemClick={(href, label, id) => {
              onItemClick(href, label, id);
              setIsDropdownOpen(false);
            }}
            menuId={`desktop-menu-${item.id}`}
            isMobile={false}
          />
        </div>
      </div>
    );
  }

  // Regular Nav Item
  return (
    <a
      href={item.href}
      onClick={(e) => {
        e.preventDefault();
        onItemClick(item.href, item.label, item.id);
      }}
      className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        location.pathname === item.href || (location.pathname === '/' && item.id === 'home')
          ? 'bg-blue-100 text-blue-700 shadow-md'
          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
      }`}
    >
      <span className="text-lg">{item.icon}</span>
      <span>{item.label}</span>
    </a>
  );
}

export default DesktopNavItem;
