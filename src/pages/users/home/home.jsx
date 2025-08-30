import HeroSection from './Components/HeroSection'
import ServicesOverview from './Components/ServicesOverview'
import ServiceRequestSection from './Components/ServiceRequestSection'
import NewsSection from './Components/NewsSection'
import { useState, useEffect } from 'react'

function Home() {
    const BackgroundWrapper = ({ children }) => {
        const [isMobile, setIsMobile] = useState(false);

        useEffect(() => {
            const checkMobile = () => {
                setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
            };
            checkMobile();
            window.addEventListener('resize', checkMobile);
            return () => window.removeEventListener('resize', checkMobile);
        }, []);

        const backgroundClass = isMobile
            ? "min-h-screen bg-cover bg-center bg-no-repeat bg-[url('/image/fd78805f8ce862135726b6fc7f51aafc.jpg')]"
            : "min-h-screen bg-fixed bg-cover bg-center bg-no-repeat bg-[url('/image/fd78805f8ce862135726b6fc7f51aafc.jpg')]";

        return (
            <div className={backgroundClass}>
                <div className="relative z-10">
                    {children}
                </div>
            </div>
        );
    };

    return (
        <BackgroundWrapper>
            <HeroSection />
            <ServicesOverview />
            <ServiceRequestSection />
            <NewsSection />
        </BackgroundWrapper>
    )
}

export default Home
