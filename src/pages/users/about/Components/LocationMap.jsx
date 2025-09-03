import { useState, useEffect, useRef } from 'react'

// Custom hook for iframe zoom controls
const useCustomZoom = (iframeRef) => {
    useEffect(() => {
        if (!iframeRef.current) return

        const iframeContainer = iframeRef.current.parentElement
        let isZoomEnabled = false

        // Handle wheel events for Ctrl+scroll zoom
        const handleWheel = (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault()
                isZoomEnabled = true
                
                // Show zoom indicator
                const indicator = document.getElementById('zoom-indicator')
                if (indicator) {
                    indicator.style.display = 'block'
                    indicator.textContent = e.deltaY > 0 ? 'Zoom Out' : 'Zoom In'
                    
                    // Hide after 1 second
                    setTimeout(() => {
                        indicator.style.display = 'none'
                    }, 1000)
                }
            }
        }

        // Handle keydown to enable zoom mode
        const handleKeyDown = (e) => {
            if (e.ctrlKey || e.metaKey) {
                isZoomEnabled = true
                iframeContainer.style.pointerEvents = 'auto'
            }
        }

        // Handle keyup to disable zoom mode
        const handleKeyUp = (e) => {
            if (!e.ctrlKey && !e.metaKey) {
                isZoomEnabled = false
            }
        }

        // Add event listeners
        iframeContainer.addEventListener('wheel', handleWheel, { passive: false })
        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('keyup', handleKeyUp)

        return () => {
            iframeContainer.removeEventListener('wheel', handleWheel)
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('keyup', handleKeyUp)
        }
    }, [iframeRef])
}

function LocationMap() {
    const [activeLocation, setActiveLocation] = useState(0)
    const [mapLoaded, setMapLoaded] = useState(false)
    const iframeRef = useRef(null)

    // Coordinates for 11°04'58.3"N 105°48'50.0"E, Krong Svay Rieng, Cambodia
    const locations = [
        {
            name: "កន្លែងផ្ដល់សេវាកម្ម",
            address: "3RM7+3G8, Krong Svay Rieng, Cambodia",
            phone: "023 991 235",
            hours: "ចន្លោះម៉ោង 7:30-12:00 និង 14:00-17:30 (ច័ន្ទ-សុក្រ)",
            coordinates: { lat: 11.082861, lng: 105.813889 },
            description: "ការបំរុងទឹក និងការថែទាំប្រព័ន្ធ សេវាសេវាកម្ម ផ្សេងៗ",
            placeId: "ChIJX8K8_2FK_zARFNH8L8K8_2F"
        },
        {
            name: "កន្លែងបង់ថ្លៃទឹកស្អាតប្រចាំខែ និងបង់ថ្លៃសេវាកម្ម", 
            address: "3RM7+3G8, Krong Svay Rieng, Cambodia",
            phone: "023 991 236", 
            hours: "ចន្លោះម៉ោង 7:30-12:00 និង 14:00-17:30 (ច័ន្ទ-សុក្រ)",
            coordinates: { lat: 11.080583, lng: 105.804361 },
            description: "ការទូទាត់បង់ប្រាក់ និងសេវាកម្មទឹកស្អាត",
            placeId: "ChIJX8K8_2FK_zARFNH8L8K8_2G"
        }
    ]

    // Simulate map loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setMapLoaded(true)
        }, 1000)
        return () => clearTimeout(timer)
    }, [])

    // Use custom zoom controls
    useCustomZoom(iframeRef)

    // Generate Google Maps embed URL
    const getMapEmbedUrl = () => {
        const { lat, lng } = locations[activeLocation].coordinates
        const query = encodeURIComponent(`${locations[activeLocation].name}, ${locations[activeLocation].address}`)
        
        // Use the most reliable Google Maps embed approach
        return `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=14&output=embed`
    }

    return (
        <div className="py-16 bg-gray-50 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        ទីតាំងរបស់ ស.រ.ស
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        ស្វែងរកការិយាល័យទាំងពីររបស់រដ្ឋាករទឹកស្វាយរៀងនៅ ស្រុកស្វាយរៀង ក្រុងស្វាយរៀង ខេត្តស្វាយរៀង
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Real Map Section */}
                    <div className="bg-white rounded-xl overflow-hidden shadow-lg relative z-10">
                        <div className="h-96 w-full relative" style={{ minHeight: '615px' }}>
                            {/* Zoom Indicator */}
                            <div 
                                id="zoom-indicator" 
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-black/80 text-white px-4 py-2 rounded-lg font-medium"
                                style={{ display: 'none' }}
                            >
                                Zoom In
                            </div>
                            
                            {/* Loading overlay */}
                            {!mapLoaded && (
                                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                        <p className="text-gray-600">កំពុងផ្ទុកផែនទី Google...</p>
                                    </div>
                                </div>
                            )}
                            
                            {/* Google Maps Embed */}
                            {mapLoaded && (
                                <iframe
                                    ref={iframeRef}
                                    src={getMapEmbedUrl()}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, borderRadius: '12px' }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title={`Map showing ${locations[activeLocation].name}`}
                                ></iframe>
                            )}
                        </div>
                    </div>

                    {/* Location Details */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 mb-6">
                            {locations.map((location, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveLocation(index)}
                                    className={`text-left p-4 rounded-lg border-2 transition-all duration-300 ${activeLocation === index
                                            ? 'border-blue-500 bg-blue-50 shadow-md'
                                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                                        }`}
                                >
                                    <h3 className="font-semibold text-lg text-gray-900">
                                        {location.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {location.description}
                                    </p>
                                </button>
                            ))}
                        </div>

                        {/* Selected Location Details */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                {locations[activeLocation].name}
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="font-medium text-gray-900">អាស័យដ្ឋាន</p>
                                        <p className="text-gray-600">{locations[activeLocation].address}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                    <div>
                                        <p className="font-medium text-gray-900">លេខទូរស័ព្ទ</p>
                                        <p className="text-gray-600">{locations[activeLocation].phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="font-medium text-gray-900">ម៉ោងធ្វើការ</p>
                                        <p className="text-gray-600">{locations[activeLocation].hours}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="font-medium text-gray-900">ព័ត៌មានទីតាំង</p>
                                        <p className="text-gray-600">ស្វែងរកពួកយើងនៅផែនទីខាងលើ</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                <button 
                                    onClick={() => {
                                        const { lat, lng } = locations[activeLocation].coordinates
                                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank')
                                    }}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    ទទួលបានទិសដៅ
                                </button>
                                <button 
                                    onClick={() => {
                                        window.location.href = `tel:${locations[activeLocation].phone}`
                                    }}
                                    className="flex-1 border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                                >
                                    ទាក់ទងយើង
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">ហៅបន្ទាន់</h3>
                        <p className="text-gray-600">023 991 999</p>
                        <p className="text-sm text-gray-500 mt-1">២៤ ម៉ោង/ថ្ងៃ</p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">អ៊ីម៉ែល</h3>
                        <p className="text-gray-600">info@svrwsa.com.kh</p>
                        <p className="text-sm text-gray-500 mt-1">ការិយាល័យសំណួរ</p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">ព័ត៌មានបន្ថែម</h3>
                        <p className="text-gray-600">រកមើលគេហទំព័រ</p>
                        <p className="text-sm text-gray-500 mt-1">សេវាកម្មអនឡាញ</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LocationMap
