import HeroSection from './Components/HeroSection'
import ServicesOverview from './Components/ServicesOverview'
import ServiceRequestSection from './Components/ServiceRequestSection'
import NewsSection from './Components/NewsSection'

function Home() {

    return (
        <div className="min-h-screen bg-fixed bg-cover bg-center bg-no-repeat bg-[url('/image/fd78805f8ce862135726b6fc7f51aafc.jpg')]">
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
