import AboutHero from './Components/about/AboutHero'
import MissionVision from './Components/about/MissionVision'

function About() {
    return (
        <div className="min-h-50 relative">
            {/* Fixed background */}
            <div className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat bg-[url('/image/fd78805f8ce862135726b6fc7f51aafc.jpg')]" />
            
            {/* Content */}
            <div className="relative z-10">
                <AboutHero />
                <MissionVision />
            </div>
        </div>
    )
}

export default About
