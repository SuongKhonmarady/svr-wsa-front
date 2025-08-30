import HeroSection from './Components/HeroSection'
import ServicesOverview from './Components/ServicesOverview'
import ServiceRequestSection from './Components/ServiceRequestSection'
import NewsSection from './Components/NewsSection'
import { useState, useEffect } from 'react'

function Home() {
    return (
        <div className="min-h-screen relative">
          {/* Extended fixed background using Tailwind arbitrary values */}
          <div className="fixed -top-[20vh] -left-[20vw] -right-[20vw] -bottom-[20vh] w-[140vw] h-[140vh] -z-10 bg-cover bg-center bg-no-repeat bg-fixed bg-[url('/image/fd78805f8ce862135726b6fc7f51aafc.jpg')]" />
          {/* Content */}
          <div className="relative z-10">
            <HeroSection />
            <ServicesOverview />
            <ServiceRequestSection />
            <NewsSection />
          </div>
        </div>
      )
}

export default Home
