import React from 'react';

function SuccessMessage({ isOpen, onClose, title, message }) {
  if (!isOpen) {
    return null;
  }

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300">
      {/* Modal Panel */}
      <div className="relative w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-scale-in">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>

          {/* Modal Title */}
          <h3 className="text-2xl font-semibold leading-6 text-gray-900 mb-2">
            {title}
          </h3>

          {/* Modal Message */}
          <div className="mt-2">
            <p className="text-md text-gray-600">
              {message}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-3 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-lg transition-colors duration-200"
          >
            យល់ព្រម
          </button>
        </div>
      </div>
      <style>{`
        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SuccessMessage;
