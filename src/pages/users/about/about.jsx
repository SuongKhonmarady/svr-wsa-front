import AboutHero from './Components/about/AboutHero'
import MissionVision from './Components/about/MissionVision'

function About() {
    return (
        <div className="min-h-screen relative">
            {/* Fixed background */}
            <div className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat bg-[url('/image/fd78805f8ce862135726b6fc7f51aafc.jpg')]" 
            style={{
                top: '-35vh',
                bottom: '-10vh',
                height: '100vh'
            }} 
            />
            
            {/* Content */}
            <div className="relative z-10">
                <AboutHero />
                <MissionVision />
            </div>
        </div>
    )
}

export default About
