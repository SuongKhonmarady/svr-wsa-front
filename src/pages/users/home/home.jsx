import HeroSection from './Components/HeroSection'
import ServicesOverview from './Components/ServicesOverview'
import ServiceRequestSection from './Components/ServiceRequestSection'
import NewsSection from './Components/NewsSection'

function Home() {
    return (
        <div 
            className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
            style={{
                backgroundImage: "url('/image/fd78805f8ce862135726b6fc7f51aafc.jpg')",
            }}
        >
            <HeroSection />
            <ServicesOverview />
            <ServiceRequestSection />
            <NewsSection />
        </div>
    )
}

export default Home
