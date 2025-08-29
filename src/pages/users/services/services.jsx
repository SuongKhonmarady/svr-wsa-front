import ServicesList from './Components/ServicesList'

function Services() {
    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1577495508048-b635879837f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')"
            }}>
            {/* Page Header */}
            <div className="relative bg-gradient-to-r from-blue-600/30 via-blue-800/80 to-blue-800/50 text-white py-16 lg:py-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6 font-khmer-title">
                            សេវាកម្មរបស់យើង
                        </h1>
                        <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                            ផ្តល់សេវាកម្មគុណភាពខ្ពស់ និងគ្រប់គ្រាន់ដល់សហគមន៍
                        </p>
                        <p className="text-lg text-blue-200 max-w-4xl mx-auto leading-relaxed">
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
    )
}

export default Services
