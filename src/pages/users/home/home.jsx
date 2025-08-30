import HeroSection from './Components/HeroSection'
import ServicesOverview from './Components/ServicesOverview'
import ServiceRequestSection from './Components/ServiceRequestSection'
import NewsSection from './Components/NewsSection'
import { useState, useEffect } from 'react'

function Home() {
    return (
        <div className="relative min-h-screen">
            {/* Background for mobile/iOS */}
            <div
                className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat bg-[url('/image/fd78805f8ce862135726b6fc7f51aafc.jpg')]"
                style={{ height: '100%', minHeight: '100vh' }}
            />
            {/* Content wrapper */}
            <div className="relative z-10 min-h-screen">
                <HeroSection />
                <ServicesOverview />
                <ServiceRequestSection />
                <NewsSection />
            </div>
        </div>
    )
}

export default Home
