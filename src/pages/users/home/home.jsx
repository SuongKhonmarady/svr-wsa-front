import HeroSection from './Components/HeroSection'
import ServicesOverview from './Components/ServicesOverview'
import NewsSection from './Components/NewsSection'

function Home() {
    return (
        <div 
            className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
            style={{
                backgroundImage: "url('/image/mohamed-shaik-ScftZZiZnB8-unsplash.jpg')",
            }}
        >
            <HeroSection />
            <ServicesOverview />
            <NewsSection />
        </div>
    )
}

export default Home
