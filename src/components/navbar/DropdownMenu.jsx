import React from 'react';

function DropdownMenu({ 
  item, 
  isOpen, 
  onItemClick, 
  menuId,
  isMobile = false 
}) {
  const containerClasses = isMobile 
    ? `overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-screen' : 'max-h-0'}`
    : "p-3"; // Simplified for desktop since positioning is handled by parent

  const contentClasses = isMobile
    ? "px-4 pb-3 space-y-1 border-t border-gray-100"
    : "p-3";

  const handleKeyDown = (e, index, isLast = false) => {
    if (e.key === 'ArrowDown' && !isLast) {
      e.preventDefault();
      const nextItem = e.currentTarget.parentElement.querySelector(`[role="menuitem"]:nth-child(${index + 2})`);
      if (nextItem) nextItem.focus();
    }
    if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault();
      const prevItem = e.currentTarget.parentElement.querySelector(`[role="menuitem"]:nth-child(${index})`);
      if (prevItem) prevItem.focus();
    }
    if (e.key === 'Escape') {
      const trigger = document.querySelector(`[aria-controls="${menuId}"]`);
      if (trigger) trigger.focus();
    }
  };

  return (
    <div 
      className={containerClasses}
      id={menuId}
      role="menu"
    >
      <div className={contentClasses}>
        {/* Main Category Link */}
        <a
          href={item.href}
          onClick={(e) => {
            e.preventDefault();
            onItemClick(item.href, item.label, item.id);
          }}
          className={`flex items-center space-x-3 w-full p-3 rounded-lg text-blue-600 font-semibold hover:bg-blue-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isMobile ? 'mt-2' : 'border-b border-gray-100 mb-2'
          }`}
          role="menuitem"
          onKeyDown={(e) => handleKeyDown(e, 0)}
        >
          <span className="text-xl">📋</span>
          <span>ទាំងអស់ - View All</span>
        </a>
        
        {/* Dropdown Items */}
        <div className="space-y-1">
          {item.dropdownItems.map((dropdownItem, index) => (
            <a
              key={dropdownItem.id}
              href={dropdownItem.href}
              onClick={(e) => {
                e.preventDefault();
                onItemClick(dropdownItem.href, dropdownItem.label, item.id);
              }}
              className="flex items-center space-x-3 w-full p-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              role="menuitem"
              onKeyDown={(e) => handleKeyDown(e, index + 1, index === item.dropdownItems.length - 1)}
            >
              <span className="text-lg">{dropdownItem.icon}</span>
              <span>{dropdownItem.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DropdownMenu;
