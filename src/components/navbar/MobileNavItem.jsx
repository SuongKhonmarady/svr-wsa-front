import React from 'react';
import DropdownMenu from './DropdownMenu';

function MobileNavItem({ 
  item, 
  isActive, 
  onItemClick, 
  location,
  openDropdown,
  onToggleDropdown
}) {
  if (item.hasDropdown) {
    return (
      <div className="bg-white rounded-lg shadow-sm">
        {/* Mobile Dropdown Button */}
        <button
          onClick={() => onToggleDropdown(item.id)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-haspopup="true"
          aria-expanded={openDropdown === item.id}
          aria-controls={`mobile-menu-${item.id}`}
          aria-label={`Toggle ${item.label} menu`}
        >
          <div className="flex items-center space-x-3">
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium text-gray-700">{item.label}</span>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${
              openDropdown === item.id ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Mobile Submenu */}
        <DropdownMenu
          item={item}
          isOpen={openDropdown === item.id}
          onItemClick={onItemClick}
          menuId={`mobile-menu-${item.id}`}
          isMobile={true}
        />
      </div>
    );
  }

  // Mobile Regular Nav Item
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <a
        href={item.href}
        onClick={(e) => {
          e.preventDefault();
          onItemClick(item.href, item.label, item.id);
        }}
        className={`w-full flex items-center space-x-3 p-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          location.pathname === item.href || (location.pathname === '/' && item.id === 'home')
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        <span className="text-xl">{item.icon}</span>
        <span className="font-medium">{item.label}</span>
      </a>
    </div>
  );
}

export default MobileNavItem;
