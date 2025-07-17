import NewsList from './Components/NewsList'

function News() {
    return (
        <div 
            className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1577495508048-b635879837f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')"
            }}>
            {/* Page Header */}
            <div className="relative bg-gradient-to-r from-green-700/40 via-green-800/80 to-green-700/40 text-white py-16 lg:py-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-khmer-title">
                            ព័ត៌មាន និងសកម្មភាព
                        </h1>
                        <p className="text-xl sm:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
                            ព័ត៌មានថ្មីៗ និងសកម្មភាពរបស់រដ្ឋករទឹកស្វាយរៀង
                        </p>
                        <p className="text-lg text-green-200 max-w-4xl mx-auto leading-relaxed">
                            ស្វែងយល់អំពីការអភិវឌ្ឍន៍ គម្រោងថ្មីៗ និងសកម្មភាពសហគមន៍របស់យើង
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

            {/* News Content */}
            <NewsList />
        </div>
    )
}

export default News
                                   
