import YearlyReports from '../Components/yearly/YearlyReports'
import { useState, useEffect } from 'react'

function Yearly() {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
    }, [])
    return (
        <div className="min-h-50 relative">
            {/* Fixed background */}
            <div className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: "url('/image/fd78805f8ce862135726b6fc7f51aafc.jpg')",
                top: '-35vh',
                bottom: '-10vh',
                height: '100vh'
            }} 
            />
            
            {/* Content */}
            <div className="relative z-10">
                {/* Page Header */}
                <div className="relative bg-gradient-to-r from-green-800/40 via-green-700/90 to-green-800/40 text-white py-16 lg:py-20 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className={`text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 md:mb-8 transition-all duration-1000 ${isLoaded
                                ? 'opacity-100 transform translate-y-0'
                                : 'opacity-0 transform -translate-y-8'
                                }`}>
                                របាយការណ៍ប្រចាំឆ្នាំ
                            </h1>
                            <p className={`text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl sm:mb-8 md:mb-12 text-green-100 mb-8 max-w-3xl mx-auto transition-all duration-1500 ${isLoaded
                                ? 'opacity-100 transform translate-y-0'
                                : 'opacity-0 transform translate-y-8'
                            }`}>
                                របាយការណ៍សង្ខេបប្រចាំឆ្នាំនៃដំណើរការសេវាកម្ម
                            </p>
                            <p className={`text-base sm:text-lg md:text-xl text-green-200 max-w-4xl mx-auto leading-relaxed transition-all duration-2000 ${isLoaded
                                ? 'opacity-100 transform translate-y-0'
                                : 'opacity-0 transform translate-y-8'
                            }`}>
                                ស្វែងយល់ពីសមិទ្ធផលប្រចាំឆ្នាំ ការអភិវឌ្ឍន៍ និងទិសដៅអនាគត
                            </p>
                        </div>
                    </div>

                    {/* Decorative wave */}
                    <div className="absolute bottom-0 left-0 right-0">
                        <svg className="w-full h-8" viewBox="0 0 100 20" fill="none" preserveAspectRatio="none">
                            <path d="M0 20L100 0V20H0Z" fill="rgb(249 250 251)" />
                        </svg>
                    </div>
                </div>

                {/* Yearly Reports Component */}
                <YearlyReports />
            </div>
        </div>
    )
}

export default Yearly
