import ServicesList from './Components/ServicesList'

function Services() {
    return (
        <div className="min-h-screen relative">
            {/* Fixed background */}
            <div className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat bg-[url('image/fd78805f8ce862135726b6fc7f51aafc.jpg')]" />
            
            {/* Content */}
            <div className="relative z-10">
                {/* Page Header */}
                <div className="relative bg-gradient-to-r from-blue-600/30 via-blue-800/80 to-blue-800/50 text-white py-16 lg:py-20 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 md:mb-8">
                                សេវាកម្មរបស់យើង
                            </h1>
                            <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 md:mb-12 max-w-3xl mx-auto">
                                ផ្តល់សេវាកម្មគុណភាពខ្ពស់ និងគ្រប់គ្រាន់ដល់សហគមន៍
                            </p>
                            <p className="text-base sm:text-lg md:text-xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
                                យើងផ្តល់សេវាកម្មទូលំទូលាយ ចាប់ពីការផ្គត់ផ្គង់ទឹកស្អាត ការជួសជុល ការតេស្តគុណភាព រហូតដល់ការប្រឹក្សាបច្ចេកទេស
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

                {/* Services Content */}
                <ServicesList />
            </div>
        </div>
    )
}

export default Services
