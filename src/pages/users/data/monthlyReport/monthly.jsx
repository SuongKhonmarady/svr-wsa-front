import MonthlyYearsList from '../Components/monthly/MonthlyYearsList'
import { useState, useEffect } from 'react'

function Monthly() {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
    }, [])
    
    return (
        <div className="min-h-screen">
            {/* Hero Section with Background Image */}
            <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/image/fd78805f8ce862135726b6fc7f51aafc.jpg')" }}
                >
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700/70 via-blue-800/80 to-blue-700/70"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                    <h1 className={`text-4xl sm:text-5xl lg:text-6xl mb-6 font-khmer-title transition-all duration-1000 ${
                        isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-8'
                    }`}>
                        របាយការណ៍ប្រចាំខែ
                    </h1>
                    <p className={`text-xl sm:text-2xl text-blue-100 mb-6 max-w-4xl mx-auto leading-relaxed transition-all duration-1500 ${
                        isLoaded ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-y-8'
                    }`}>
                        របាយការណ៍ទិន្នន័យប្រចាំខែនៃការផ្គត់ផ្គង់ទឹកស្អាត
                    </p>
                </div>

                {/* Decorative wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg className="w-full h-10" viewBox="0 0 100 20" fill="none" preserveAspectRatio="none">
                        <path d="M0 20L100 0V20H0Z" fill="rgb(249 250 251)" />
                    </svg>
                </div>
            </div>

            {/* Monthly Years List Component */}
            <div className="bg-gray-50">
                <MonthlyYearsList />
            </div>
        </div>
    )
}

export default Monthly

