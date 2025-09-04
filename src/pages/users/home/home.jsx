import HeroSection from './Components/HeroSection'
import ImageSection from './Components/ImageSection'
import ServicesOverview from './Components/ServicesOverview'
import ServiceRequestSection from './Components/ServiceRequestSection'
import NewsSection from './Components/NewsSection'

function Home() {
    return (
        <div className="min-h-screen relative">
            {/* Content */}
            <div className="relative z-10">
                <HeroSection />
                <ImageSection />
                <ServicesOverview />
                <ServiceRequestSection />
                <NewsSection />
            </div>
        </div>
    )
}

export default Home
