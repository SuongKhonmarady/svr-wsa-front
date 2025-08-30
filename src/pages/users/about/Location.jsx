import LocationMap from "./Components/LocationMap";

function Location() {
    return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat absolute"
        style={{
                backgroundImage: "url('/image/patrik-maki-RKRvSeX2sPs-unsplash.jpg')"
            }}>
                <LocationMap />
        </div>
    )
}

export default Location;