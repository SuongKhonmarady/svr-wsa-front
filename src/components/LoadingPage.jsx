import React from 'react';

const LoadingFallback = () => {
  return (
    // Full-screen container, centered using flexbox
    <div className="fixed inset-0 z-[9999] flex h-screen w-screen flex-col items-center justify-center bg-white">
      
      {/* Spinner Element */}
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent"></div>

      {/* Optional: Loading Text */}
      <p className="mt-4 text-lg font-medium text-gray-600">Loading...</p>

    </div>
  );
};

export default LoadingFallback;