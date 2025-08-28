import React from 'react';

function FormHeader({ currentStep, steps }) {
    return (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <p className="text-blue-100 mt-2">
                សូមបំពេញព័ត៌មានខាងក្រោម ដើម្បីដាក់ពាក្យសុំសេវាកម្មផ្គត់ផ្គង់ទឹកស្អាត
            </p>

            <div className="w-full mt-10 px-6 relative">
                {/* Step Bar */}
                <div className="flex justify-between relative z-10">
                    {steps.map((step, index) => (
                        <div key={step.id} className="relative flex flex-col items-center w-1/3">
                            {/* Circle */}
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${currentStep >= step.id
                                    ? 'bg-white text-blue-600 scale-110 shadow-lg'
                                    : 'bg-blue-500 text-white scale-100'
                                    }`}
                            >
                                {currentStep > step.id ? (
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                ) : (
                                    step.id
                                )}
                            </div>

                            {/* Label */}
                            <span className="mt-2 text-xs text-blue-100 text-center">{step.label}</span>
                        </div>
                    ))}
                </div>

                {/* Connector lines */}
                {/* Line between Step 1 and Step 2 */}
                <div className="absolute top-5 left-[16.66%] w-[33.33%] h-0.5 z-0 bg-white/30">
                    <div
                        className={`h-full transition-all duration-500 ease-out ${currentStep > 1 ? 'bg-white w-full' : 'bg-white/30 w-0'}`}
                    />
                </div>

                {/* Line between Step 2 and Step 3 */}
                <div className="absolute top-5 left-[49.99%] w-[33.33%] h-0.5 z-0 bg-white/30">
                    <div
                        className={`h-full transition-all duration-500 ease-out ${currentStep > 2 ? 'bg-white w-full' : 'bg-white/30 w-0'}`}
                    />
                </div>
            </div>
        </div>
    );
}

export default FormHeader;
