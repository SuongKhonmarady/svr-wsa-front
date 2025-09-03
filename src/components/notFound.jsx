import { useNavigate } from 'react-router-dom';

function NotFound() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <img 
                        src="/image/Water_spigot.png" 
                        alt="Water Spigot" 
                        className="mx-auto w-40 h-40 object-contain rounded-full border-4 border-blue-500 shadow-lg"
                    />
                </div>
                <h1 className="text-5xl font-extrabold text-blue-600 mb-4">404</h1>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
                <p className="text-gray-500 mb-8">Sorry, the page you are looking for does not exist or has been moved.</p>
                <button
                    onClick={() => navigate('/', { replace: true })}
                    className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
                >
                    ← Go to Homepage
                </button>
            </div>
        </div>
    );
}

export default NotFound;
