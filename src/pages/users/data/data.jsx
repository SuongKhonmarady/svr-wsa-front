import DataDashboard from './Components/DataDashboard'

function Data() {
    return (
        <div className="min-h-screen relative">
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
                <div className="relative bg-gradient-to-r from-teal-800/40 via-teal-700/80 to-teal-800/40 text-white py-16 lg:py-20 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 md:mb-8">
                                ទិន្នន័យ និងស្ថិតិ
                            </h1>
                            <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 md:mb-12 max-w-3xl mx-auto">
                                ទិន្នន័យ របាយការណ៍ និងស្ថិតិសេវាកម្ម
                            </p>
                            <p className="text-base sm:text-lg md:text-xl leading-relaxed">
                                ស្វែងយល់អំពីទិន្នន័យគុណភាពទឹក ស្ថិតិអតិថិជន និងកំណើនសេវាកម្ម
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

                {/* Data Content */}
                <DataDashboard />
            </div>
        </div>
    )
}

export default Data
              