import React from 'react';

function NavigationButtons({ 
    currentStep, 
    isSubmitting, 
    onPrevStep, 
    onNextStep, 
    onSubmit,
    privacyAccepted
}) {
    return (
        <div className="flex justify-between pt-6">
            {currentStep > 1 && (
                <button
                    type="button"
                    onClick={onPrevStep}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    ថយក្រោយ
                </button>
            )}

            <div className="ml-auto">
                {currentStep < 3 ? (
                    <button
                        type="button"
                        onClick={onNextStep}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        បន្ទាប់
                    </button>
                ) : (
                    <button
                        type="submit"
                        onClick={onSubmit}
                        disabled={isSubmitting || !privacyAccepted}
                        className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${(isSubmitting || !privacyAccepted)
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:shadow-lg transform hover:-translate-y-0.5'
                            }`}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                កំពុងដាក់ស្នើ...
                            </div>
                        ) : (
                            'ស្នើសុំសេវាកម្ម'
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

export default NavigationButtons;
