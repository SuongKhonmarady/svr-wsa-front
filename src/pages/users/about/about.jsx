import AboutHero from './Components/about/AboutHero'
import MissionVision from './Components/about/MissionVision'

function About() {
    return (
        <div className="min-h-50 relative">
            {/* Fixed background */}
            <div className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat bg-[url('image/patrik-maki-RKRvSeX2sPs-unsplash.jpg')]" />
            
            {/* Content */}
            <div className="relative z-10">
                <AboutHero />
                <MissionVision />
            </div>
        </div>
    )
}

export default About
