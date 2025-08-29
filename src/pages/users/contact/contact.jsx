import ContactForm from './Components/ContactForm'
import { useEffect, useState } from 'react'

function Contact() {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
    }, [])
    return (
        <div className="min-h-screen relative">
            {/* Fixed background */}
            <div className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat bg-[url('/image/fd78805f8ce862135726b6fc7f51aafc.jpg')]" />
            
            {/* Content */}
            <div className="relative z-10">
                {/* Page Header */}
                <div className="relative bg-gradient-to-r from-purple-800/40 via-purple-700/80 to-purple-800/40 text-white py-16 lg:py-20 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className={`text-4xl sm:text-5xl lg:text-6xl mb-6 font-khmer-title transition-all duration-1000 ${isLoaded
                                ? 'opacity-100 transform translate-y-0'
                                : 'opacity-0 transform -translate-y-8'
                                }`}>
                                ទំនាក់ទំនងយើង
                            </h1>
                            <p className={`text-xl sm:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto transition-all duration-1500 ${isLoaded
                                ? 'opacity-100 transform translate-x-0'
                                : 'opacity-0 transform translate-y-8'
                                }`}>
                                យើងរីករាយក្នុងការស្តាប់មតិ និងជួយដោះស្រាយបញ្ហារបស់អ្នក
                            </p>
                            <p className={`text-lg text-purple-200 max-w-4xl mx-auto leading-relaxed transition-all duration-2000 ${isLoaded
                                ? 'opacity-100 transform translate-y-0'
                                : 'opacity-0 transform translate-y-8'
                                }`}>
                                ទាក់ទងមកកាន់យើងសម្រាប់សេវាកម្ម ការប្រឹក្សា ឬសំណួរណាមួយ
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

                {/* Contact Content */}
                <ContactForm />
            </div>
        </div>
    )
}

export default Contact



