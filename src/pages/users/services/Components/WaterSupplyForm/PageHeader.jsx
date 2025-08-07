import React from 'react';

function PageHeader({ titleRef, subtitleRef, visibleSections }) {
    return (
        <div className="relative bg-gradient-to-r from-blue-600/30 via-blue-800/80 to-blue-800/50 text-white py-16 lg:py-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 ref={titleRef} className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-khmer-title transition-all duration-1000 ${visibleSections.title
                        ? 'opacity-100 transform translate-y-0 animate-fade-in-up'
                        : 'opacity-0 transform translate-y-10'
                        }`}>
                        សំណើសេវាកម្មផ្គត់ផ្គង់ទឹកស្អាត
                    </h1>
                    <p ref={subtitleRef} className={`text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto ${visibleSections.subtitle
                        ? 'opacity-100 transform translate-y-0 animate-slide-in-left' 
                        : 'opacity-0 transform translate-y-10'
                        }`}>
                        ដាក់ពាក្យសុំសេវាកម្មផ្គត់ផ្គង់ទឹកស្អាតសម្រាប់ផ្ទះ ឬអាជីវកម្មរបស់អ្នក
                    </p>
                </div>
            </div>

            {/* Decorative wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg className="w-full h-8" viewBox="0 0 100 20" fill="none" preserveAspectRatio="none">
                    <path d="M0 20L100 0V20H0Z" fill="rgb(255 255 255)" />
                </svg>
            </div>
        </div>
    );
}

export default PageHeader;
