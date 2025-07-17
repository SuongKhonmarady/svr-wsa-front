import LocationMap from "./Components/LocationMap";
import img from '../../../assets/image/water.png';

function Location() {
    return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed">
            <div>
                <LocationMap />
            </div>
        </div>
    );
}

export default Location;