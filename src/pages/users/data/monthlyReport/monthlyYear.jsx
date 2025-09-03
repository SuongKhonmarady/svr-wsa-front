import MonthlyYearlyReports from '../Components/monthly/MonthlyYearlyReports'

function MonthlyYear() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section with Background Image */}
            <div className="relative h-[30vh] min-h-[300px] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ 
                        backgroundImage: "url('/image/fd78805f8ce862135726b6fc7f51aafc.jpg')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 via-blue-700/85 to-blue-800/90"></div>
                </div>
                
                {/* Content */}
                <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6">
                        របាយការណ៍ប្រចាំខែ
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
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

            {/* Content Section */}
            <div className="relative z-10 -mt-8">
                <MonthlyYearlyReports />
            </div>
        </div>
    )
}

export default MonthlyYear
