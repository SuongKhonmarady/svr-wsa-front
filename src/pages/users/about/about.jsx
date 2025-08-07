import AboutHero from './Components/about/AboutHero'
import MissionVision from './Components/about/MissionVision'

function About() {
    return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
                backgroundImage: "url('image/patrik-maki-RKRvSeX2sPs-unsplash.jpg')"
            }}>
            <AboutHero />
            <MissionVision />
        </div>
    )
}

export default About
