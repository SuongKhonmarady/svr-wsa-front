import DataDashboard from './Components/DataDashboard'

function Data() {
    return (
        <div 
            className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1577495508048-b635879837f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')"
            }}>
            {/* Page Header */}
            <div className="relative bg-gradient-to-r from-teal-800/40 via-teal-700/80 to-teal-800/40 text-white py-16 lg:py-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6 font-khmer-title">
                            ទិន្នន័យ និងស្ថិតិ
                        </h1>
                        <p className="text-xl sm:text-2xl text-teal-100 mb-8 max-w-3xl mx-auto">
                            ទិន្នន័យ របាយការណ៍ និងស្ថិតិសេវាកម្ម
                        </p>
                        <p className="text-lg text-teal-200 max-w-4xl mx-auto leading-relaxed">
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
    )
}

export default Data
              