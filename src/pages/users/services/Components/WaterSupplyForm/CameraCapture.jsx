import React, { useState, useRef, useEffect } from 'react';
import { cropToFrame, createFileFromCanvas } from '../../../../../utils/imageCompression';

function CameraCapture({ 
    isOpen, 
    onClose, 
    onCapture, 
    documentType = 'id_card_front',
    title = 'ថតរូបអត្តសញ្ញាណប័ណ្ណ'
}) {
    const [stream, setStream] = useState(null);
    const [error, setError] = useState('');
    const [isCapturing, setIsCapturing] = useState(false);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [facingMode, setFacingMode] = useState('environment'); // 'user' for front, 'environment' for back
    
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const frameRef = useRef(null);

    // Initialize camera when component opens
    useEffect(() => {
        if (isOpen) {
            initializeCamera();
        } else {
            // Ensure cleanup happens when modal closes
            cleanup();
        }

        // Cleanup function for component unmount or dependencies change
        return () => {
            cleanup();
        };
    }, [isOpen, facingMode]);

    // Handle escape key to close modal
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape' && isOpen) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            
            // Prevent body scroll when modal is open (mobile)
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            
            // Set viewport meta for mobile
            const viewport = document.querySelector('meta[name=viewport]');
            if (viewport) {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
            }
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            
            // Restore body scroll
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            
            // Restore viewport
            const viewport = document.querySelector('meta[name=viewport]');
            if (viewport) {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
            }
        };
    }, [isOpen]);

    const initializeCamera = async () => {
        try {
            setError('');
            setIsCameraReady(false);

            // Check if device supports camera
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Camera not supported on this device');
            }

            const constraints = {
                video: {
                    facingMode: facingMode,
                    width: { 
                        ideal: window.innerWidth > 768 ? 1920 : 1280, 
                        min: 640 
                    },
                    height: { 
                        ideal: window.innerWidth > 768 ? 1080 : 720, 
                        min: 480 
                    },
                    frameRate: { ideal: 30, min: 15 }
                }
            };

            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(mediaStream);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.onloadedmetadata = () => {
                    setIsCameraReady(true);
                };
            }
        } catch (err) {
            console.error('Camera initialization failed:', err);
            let errorMessage = '';
            
            if (err.name === 'NotAllowedError') {
                errorMessage = 'សូមអនុញ្ញាតការចូលប្រើកាមេរ៉ា ដើម្បីថតរូបឯកសារ';
            } else if (err.name === 'NotFoundError') {
                errorMessage = 'រកមិនឃើញកាមេរ៉ានៅលើឧបករណ៍នេះ';
            } else if (err.name === 'NotSupportedError') {
                errorMessage = 'កាមេរ៉ាមិនត្រូវបានគាំទ្រនៅលើឧបករណ៍នេះ';
            } else {
                errorMessage = 'មានបញ្ហាក្នុងការចូលប្រើកាមេរ៉ា';
            }
            
            setError(errorMessage);
        }
    };

    const cleanup = () => {
        if (stream) {
            // Stop all tracks to properly release camera
            stream.getTracks().forEach(track => {
                track.stop();
                console.log('Camera track stopped:', track.kind);
            });
            setStream(null);
        }
        
        // Clear video src to ensure complete cleanup
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        
        setIsCameraReady(false);
        setError('');
    };

    const handleClose = () => {
        // Ensure immediate cleanup before closing
        cleanup();
        onClose();
    };

    const switchCamera = () => {
        // Clean up current stream before switching
        cleanup();
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    };

    const capturePhoto = async () => {
        if (!videoRef.current || !canvasRef.current || !frameRef.current || isCapturing) return;

        try {
            setIsCapturing(true);

            const video = videoRef.current;
            const canvas = canvasRef.current;
            const frameElement = frameRef.current;

            // Get frame position and dimensions
            const videoRect = video.getBoundingClientRect();
            const frameRect = frameElement.getBoundingClientRect();
            
            // Calculate frame position relative to video
            const relativeFrame = {
                x: frameRect.left - videoRect.left,
                y: frameRect.top - videoRect.top,
                width: frameRect.width,
                height: frameRect.height
            };

            // Crop the video to frame area while maintaining original quality
            cropToFrame(video, canvas, relativeFrame, true);

            // Create file from canvas without compression (PNG for lossless quality)
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileName = `${documentType}_cropped_${timestamp}.png`;
            
            // Use PNG for lossless quality
            const capturedFile = await createFileFromCanvas(canvas, fileName, 'image/png');

            // Send the original quality cropped file directly to callback
            onCapture(capturedFile);
            handleClose();

        } catch (error) {
            console.error('Photo capture failed:', error);
            setError('មានបញ្ហាក្នុងការថតរូប។ សូមព្យាយាមម្តងទៀត');
        } finally {
            setIsCapturing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center overflow-hidden"
            onClick={(e) => {
                // Close modal if clicking the backdrop (not the content)
                if (e.target === e.currentTarget) {
                    handleClose();
                }
            }}
        >
            <div className="relative w-full h-full max-w-lg mx-auto flex flex-col">
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-4 safe-area-top">
                    <div className="flex items-center justify-between text-white">
                        <button
                            onClick={handleClose}
                            className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors touch-manipulation"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <h3 className="text-lg font-semibold text-center flex-1 px-2">{title}</h3>
                        {/* Camera switch button (only show on mobile) */}
                        <button
                            onClick={switchCamera}
                            className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors sm:hidden touch-manipulation"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Camera view */}
                <div className="relative w-full h-full flex items-center justify-center min-h-0">{error ? (
                        <div className="text-center p-6 text-white">
                            <div className="mb-4">
                                <svg className="w-16 h-16 mx-auto text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 15.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <p className="text-lg mb-4">{error}</p>
                            <button
                                onClick={handleClose}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                ជ្រើសរើសឯកសារ
                            </button>
                        </div>
                    ) : (
                        <>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                                style={{ 
                                    transform: facingMode === 'user' ? 'scaleX(-1)' : 'none'
                                }}
                            />
                            
                            {/* ID Card Frame Overlay */}
                            {isCameraReady && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative">
                                        {/* Card frame - responsive sizing */}
                                        <div 
                                            ref={frameRef}
                                            className="border-4 border-yellow-400 rounded-lg relative"
                                            style={{
                                                width: Math.min(320, window.innerWidth * 0.8),
                                                height: Math.min(200, window.innerWidth * 0.5)
                                            }}
                                        >
                                            {/* Corner indicators */}
                                            <div className="absolute -top-2 -left-2 w-6 h-6 border-l-4 border-t-4 border-yellow-400"></div>
                                            <div className="absolute -top-2 -right-2 w-6 h-6 border-r-4 border-t-4 border-yellow-400"></div>
                                            <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-4 border-b-4 border-yellow-400"></div>
                                            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-4 border-b-4 border-yellow-400"></div>
                                        </div>
                                        
                                        {/* Instructions */}
                                        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
                                            <p className="text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                                                ដាក់អត្តសញ្ញាណប័ណ្ណនៅកណ្តាលស៊ុម
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Bottom controls */}
                {!error && isCameraReady && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 safe-area-bottom">
                        <div className="flex items-center justify-center space-x-8">
                            {/* File upload alternative */}
                            <label className="flex flex-col items-center cursor-pointer touch-manipulation">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors active:bg-white/40">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="text-white text-xs mt-1">ជ្រើសឯកសារ</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            onCapture(e.target.files[0]);
                                            handleClose();
                                        }
                                    }}
                                    className="sr-only"
                                />
                            </label>

                            {/* Capture button */}
                            <button
                                onClick={capturePhoto}
                                disabled={isCapturing}
                                className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation active:scale-95"
                            >
                                {isCapturing ? (
                                    <div className="w-6 h-6 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <div className="w-12 h-12 bg-transparent border-2 border-gray-600 rounded-full"></div>
                                )}
                            </button>

                            {/* Camera switch button for mobile */}
                            <button
                                onClick={switchCamera}
                                className="flex flex-col items-center cursor-pointer touch-manipulation sm:hidden"
                            >
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors active:bg-white/40">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </div>
                                <span className="text-white text-xs mt-1">ប្តូរ</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Hidden canvas for photo capture */}
                <canvas ref={canvasRef} className="hidden" />
            </div>
        </div>
    );
}

export default CameraCapture;