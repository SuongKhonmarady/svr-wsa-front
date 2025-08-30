import HeroSection from './Components/HeroSection'
import ServicesOverview from './Components/ServicesOverview'
import ServiceRequestSection from './Components/ServiceRequestSection'
import NewsSection from './Components/NewsSection'

function Home() {
    // Solution 1: Use min-height with viewport units and ensure full coverage
    return (
        <div className="min-h-screen relative">
            {/* Fixed background with full coverage */}
            <div
                className="fixed inset-0 -z-10 w-full h-full bg-cover bg-center bg-no-repeat bg-[url('/image/fd78805f8ce862135726b6fc7f51aafc.jpg')]"
                style={{
                    minHeight: '100vh',
                    backgroundAttachment: 'fixed'
                }}
            />
            {/* Content */}
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
