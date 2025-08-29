import ComingSoonPage from '../../../components/ComingSoonPage';


function Laws() {
    return (
        <div className="min-h-screen relative">
            {/* Fixed background */}
            <div className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat bg-[url('/image/fd78805f8ce862135726b6fc7f51aafc.jpg')]" />
            
            {/* Content */}
            <div className="relative z-10">
                {/* Page Header */}
                <div className="relative bg-gradient-to-r from-indigo-800/40 via-indigo-700/80 to-indigo-800/40 text-white py-16 lg:py-20 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 md:mb-8 font-khmer-title">
                                ច្បាប់ និងបទបញ្ញត្តិ
                            </h1>
                            <p className="text-xl sm:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto">
                                ច្បាប់ បទបញ្ញត្តិ និងគោលការណ៍ណែនាំ
                            </p>
                            <p className="text-lg text-indigo-200 max-w-4xl mx-auto leading-relaxed">
                                ស្វែងយល់អំពីច្បាប់ បទបញ្ញត្តិ និងនីតិវិធីទាក់ទងនឹងសេវាកម្មទឹកស្អាត
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

                {/* Coming Soon Content */}
                <ComingSoonPage
                    title="ទំព័រនេះកំពុងស្ថិតក្នុងការកែសម្រួល"
                    subtitle="ច្បាប់ បទបញ្ញត្តិ និងគោលការណ៍ណែនាំ"
                    description="ស្វែងយល់អំពីច្បាប់ បទបញ្ញត្តិ និងនីតិវិធីទាក់ទងនឹងសេវាកម្មទឹកស្អាត"
                    englishDescription="Learn about laws, regulations, and policies related to water supply services"
                />
            </div>
        </div>
    )
}
export default Laws
                                