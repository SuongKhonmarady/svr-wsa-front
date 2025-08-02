import { useNavigate } from 'react-router-dom';

function NotFound() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <svg className="mx-auto w-32 h-32 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="30" strokeWidth="4" className="text-blue-200" />
                        <path d="M24 28c0-4 8-4 8 0m-8 8h8" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="24" cy="24" r="2" fill="currentColor" />
                        <circle cx="40" cy="24" r="2" fill="currentColor" />
                    </svg>
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
