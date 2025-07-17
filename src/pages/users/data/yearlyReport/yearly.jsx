import YearlyReports from '../Components/YearlyReports'

function Yearly() {
    return (
        <div 
            className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
            }}>
            {/* Page Header */}
            <div className="relative bg-gradient-to-r from-green-800/40 via-green-700/80 to-green-800/40 text-white py-16 lg:py-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-khmer-title">
                            របាយការណ៍ប្រចាំឆ្នាំ
                        </h1>
                        <p className="text-xl sm:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
                            របាយការណ៍សង្ខេបប្រចាំឆ្នាំនៃដំណើរការសេវាកម្ម
                        </p>
                        <p className="text-lg text-green-200 max-w-4xl mx-auto leading-relaxed">
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
    )
}

export default Yearly
