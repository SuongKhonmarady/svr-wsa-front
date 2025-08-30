import HeroSection from './Components/HeroSection'
import ServicesOverview from './Components/ServicesOverview'
import ServiceRequestSection from './Components/ServiceRequestSection'
import NewsSection from './Components/NewsSection'

function Home() {

    const backgroundStyle = {
        backgroundImage: "url('/image/fd78805f8ce862135726b6fc7f51aafc.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh'
      }
      return (
        <div className="min-h-screen" style={backgroundStyle}>
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
