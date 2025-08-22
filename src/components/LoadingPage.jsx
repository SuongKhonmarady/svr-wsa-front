import React from 'react';

const LoadingFallback = () => {
  return (
    // Full-screen container with gradient background
    <div className="fixed inset-0 z-[9999] flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo container with enhanced animations */}
        <div className="relative mb-8">
          {/* Outer ring animation */}
          <div className="absolute -inset-6 rounded-full border-2 border-blue-200 animate-ping opacity-30"></div>
          <div className="absolute -inset-4 rounded-full border border-cyan-300 animate-pulse opacity-40"></div>
          
          {/* Logo with enhanced styling */}
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur opacity-30 animate-pulse"></div>
            <img
              src="/image/រដ្ឋាករទឹកស្វាយរៀង (4).png"
              alt="Svay Rieng Water Utility"
              className="relative h-32 w-32 sm:h-40 sm:w-40 object-contain rounded-full border-4 border-white shadow-2xl animate-bounce-slow"
            />
          </div>
        </div>

        {/* Enhanced spinner with multiple layers */}
        <div className="relative mb-6">
          {/* Outer spinner */}
          <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-200 border-t-transparent opacity-40"></div>
          {/* Middle spinner */}
          <div className="absolute inset-1 h-14 w-14 animate-spin rounded-full border-3 border-solid border-cyan-300 border-r-transparent opacity-60" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
          {/* Inner spinner */}
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent"></div>
        </div>

        {/* Loading text with typing animation */}
        <div className="text-center space-y-2">
          <p className="text-xl sm:text-2xl font-bold text-blue-700 animate-pulse font-khmer-title">
            កំពុងដំណើរការ...
          </p>
          <p className="text-sm sm:text-base font-medium text-blue-600 animate-fade-in-out">
            Loading Svay Rieng Water Utility
          </p>
          
          {/* Progress dots */}
          <div className="flex justify-center space-x-1 mt-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-20 opacity-20" viewBox="0 0 1200 120" fill="none" preserveAspectRatio="none">
          <path d="M0,60 C300,120 600,0 900,60 C1050,90 1200,30 1200,60 L1200,120 L0,120 Z" fill="url(#wave-gradient)" />
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{stopColor: '#3B82F6', stopOpacity: 0.3}} />
              <stop offset="50%" style={{stopColor: '#06B6D4', stopOpacity: 0.5}} />
              <stop offset="100%" style={{stopColor: '#3B82F6', stopOpacity: 0.3}} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes bounce-slow {
          0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
          40%, 43% { transform: translate3d(0,-15px,0); }
          70% { transform: translate3d(0,-7px,0); }
          90% { transform: translate3d(0,-2px,0); }
        }
        
        @keyframes fade-in-out {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        .animate-blob { animation: blob 7s infinite; }
        .animate-bounce-slow { animation: bounce-slow 3s infinite; }
        .animate-fade-in-out { animation: fade-in-out 2s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default LoadingFallback;