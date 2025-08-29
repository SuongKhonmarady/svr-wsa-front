import MonthlyYearsList from '../Components/monthly/MonthlyYearsList'
import { useState, useEffect } from 'react'

function Monthly() {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
    }, [])
    return (
        <div
            className="min-h-50 bg-cover bg-center bg-no-repeat bg-fixed"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
            }}>
            {/* Page Header */}
            <div className="relative bg-gradient-to-r from-blue-800/40 via-blue-700/80 to-blue-800/40 text-white py-16 lg:py-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className={`text-5xl sm:text-6xl lg:text-7x mb-8 font-khmer-title transition-all duration-1000 ${isLoaded
                                ? 'opacity-100 transform translate-y-0'
                                : 'opacity-0 transform -translate-y-8'
                            }`}>
                            របាយការណ៍ប្រចាំខែ
                        </h1>
                        <p className={`text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto transition-all duration-1500 ${isLoaded
                                ? 'opacity-100 transform translate-y-0'
                                : 'opacity-0 transform translate-y-8'
                            }`}>
                            របាយការណ៍ទិន្នន័យប្រចាំខែនៃការផ្គត់ផ្គង់ទឹកស្អាត
                        </p>
                        <p className={`text-lg text-blue-200 max-w-4xl mx-auto leading-relaxed transition-all duration-2000 ${isLoaded
                                ? 'opacity-100 transform translate-y-0'
                                : 'opacity-0 transform translate-y-8'
                            }`}>
                            ជ្រើសរើសឆ្នាំដើម្បីមើលរបាយការណ៍ប្រចាំខែទាំងអស់
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
    )
}

export default Monthly

