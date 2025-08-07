import TeamSection from './Components/TeamSection'

function Team() {
    return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
            style={{
                backgroundImage: "url('image/patrik-maki-RKRvSeX2sPs-unsplash.jpg')"
            }}>
            <TeamSection />
        </div>
    )
}
export default Team