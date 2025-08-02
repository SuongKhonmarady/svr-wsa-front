import React from 'react';

const LoadingFallback = () => {
  return (
    // Full-screen container, centered using flexbox
    <div className="fixed inset-0 z-[9999] flex h-screen w-screen flex-col items-center justify-center bg-white">
      {/* Logo or Image */}
      <img
        src="/image/រដ្ឋាករទឹកស្វាយរៀង (4).png"
        alt="Loading Logo"
        className="mb-6 h-40 w-40 object-contain"
      />

      {/* Spinner Element */}
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent"></div>

      <p className="mt-4 text-lg font-medium text-gray-600">Loading...</p>
    </div>
  );
};

export default LoadingFallback;