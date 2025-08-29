import NewsList from './Components/NewsList'
import { useState, useEffect } from 'react'

function News() {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
    }, [])
    return (
        <div
            className="min-h-5 bg-cover bg-center bg-no-repeat bg-fixed"
            style={{
                backgroundImage: "url('image/fd78805f8ce862135726b6fc7f51aafc.jpg')"
            }}>
            {/* Page Header */}
            <div className="relative bg-gradient-to-r from-green-700/40 via-green-800/80 to-green-700/40 text-white py-16 lg:py-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className={`text-4xl sm:text-5xl lg:text-6xl mb-6 transition-all duration-1000 ${isLoaded
                            ? 'opacity-100 transform translate-y-0'
                            : 'opacity-0 transform -translate-y-8'
                            }`}>
                            ព័ត៌មាន និងសកម្មភាព
                        </h1>
                        <p className={`text-xl sm:text-2xl text-green-100 mb-8 max-w-3xl mx-auto transition-all duration-1500 ${isLoaded
                                ? 'opacity-100 transform translate-y-0'
                                : 'opacity-0 transform translate-y-8'
                            }`}>
                            ព័ត៌មានថ្មីៗ និងសកម្មភាពរបស់រដ្ឋករទឹកស្វាយរៀង
                        </p>
                        <p className={`text-lg text-green-200 max-w-4xl mx-auto leading-relaxed transition-all duration-2000 ${isLoaded
                                ? 'opacity-100 transform translate-y-0'
                                : 'opacity-0 transform translate-y-8'
                            }`}>
                            ស្វែងយល់អំពីការអភិវឌ្ឍន៍ គម្រោងថ្មីៗ និងសកម្មភាពសហគមន៍របស់យើង
                        </p>
                    </div>

                </div>
                {/* Decorative wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg className="w-full h-10" viewBox="0 0 100 20" fill="none" preserveAspectRatio="none">
                        <path d="M0 20L100 0V20H0Z" fill="rgb(255 255 255)" />
                    </svg>
                </div>

            </div>

            {/* News Content */}
            <NewsList />
        </div >
    )
}

export default News


