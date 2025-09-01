import DataDashboard from './Components/DataDashboard'
import { useState, useEffect } from 'react'

function Data() {
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
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-700/70 via-teal-800/80 to-teal-700/70"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                    <h1 className={`text-4xl sm:text-5xl lg:text-6xl mb-6 font-khmer-title transition-all duration-1000 ${
                        isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-8'
                    }`}>
                        ទិន្នន័យ និងស្ថិតិ
                    </h1>
                    <p className={`text-xl sm:text-2xl text-teal-100 mb-6 max-w-4xl mx-auto leading-relaxed transition-all duration-1500 ${
                        isLoaded ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-y-8'
                    }`}>
                        ទិន្នន័យ របាយការណ៍ និងស្ថិតិសេវាកម្ម
                    </p>
                    <p className={`text-lg text-teal-200 max-w-5xl mx-auto leading-relaxed transition-all duration-2000 ${
                        isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
                    }`}>
                        ស្វែងយល់អំពីទិន្នន័យគុណភាពទឹក ស្ថិតិអតិថិជន និងកំណើនសេវាកម្ម
                    </p>
                </div>

                {/* Decorative wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg className="w-full h-10" viewBox="0 0 100 20" fill="none" preserveAspectRatio="none">
                        <path d="M0 20L100 0V20H0Z" fill="rgb(249 250 251)" />
                    </svg>
                </div>
            </div>

            {/* Data Content */}
            <div className="bg-gray-50">
                <DataDashboard />
            </div>
        </div>
    )
}

export default Data
