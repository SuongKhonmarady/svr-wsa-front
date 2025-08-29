import MonthlyYearsList from '../Components/monthly/MonthlyYearsList'
import { useState, useEffect } from 'react'

function Monthly() {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
    }, [])
    return (
        <div className="min-h-50 relative">
            {/* Fixed background */}
            <div className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')]" />
            
            {/* Content */}
            <div className="relative z-10">
                {/* Page Header */}
                <div className="relative bg-gradient-to-r from-blue-800/40 via-blue-700/80 to-blue-800/40 text-white py-16 lg:py-20 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className={`text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 md:mb-8 transition-all duration-1000 ${isLoaded
                                    ? 'opacity-100 transform translate-y-0'
                                    : 'opacity-0 transform -translate-y-8'
                                }`}>
                                របាយការណ៍ប្រចាំខែ
                            </h1>
                            <p className={`text-sm xs:text-base sm:text-lg text-blue-200 md:text-xl lg:text-2xl mb-6 sm:mb-8 md:mb-12 transition-all duration-1500 ${isLoaded
                                    ? 'opacity-100 transform translate-y-0'
                                    : 'opacity-0 transform translate-y-8'
                                }`}>
                                របាយការណ៍ទិន្នន័យប្រចាំខែនៃការផ្គត់ផ្គង់ទឹកស្អាត
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

                {/* Monthly Years List Component */}
                <MonthlyYearsList />
            </div>
        </div>
    )
}

export default Monthly

