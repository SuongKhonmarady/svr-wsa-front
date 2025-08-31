import React, { useEffect, useState, useRef } from 'react'
import TeamHero from './Components/TeamSection/TeamHero'
import TeamLists from './Components/TeamSection/TeamLists'

function Team() {
    const [visibleSections, setVisibleSections] = useState({
        hero: false,
        team: false
    });

    const heroRef = useRef(null);
    const teamRef = useRef(null);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const targetId = entry.target.dataset.section;
                    setVisibleSections(prev => ({
                        ...prev,
                        [targetId]: true
                    }));
                }
            });
        }, observerOptions);

        if (heroRef.current) {
            heroRef.current.dataset.section = 'hero';
            observer.observe(heroRef.current);
        }
        if (teamRef.current) {
            teamRef.current.dataset.section = 'team';
            observer.observe(teamRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div 
                ref={heroRef}
                className={`${visibleSections.hero
                    ? 'opacity-100 transform translate-y-0 animate-fade-in'
                    : 'opacity-0 transform translate-y-10'
                }`}
            >
                <TeamHero />
            </div>

            {/* Team Members List */}
            <div 
                ref={teamRef}
                className={`py-16 bg-white ${visibleSections.team
                    ? 'opacity-100 transform translate-y-0 animate-fade-in'
                    : 'opacity-0 transform translate-y-10'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <TeamLists />
                </div>
            </div>
        </div>
    )
}

export default Team