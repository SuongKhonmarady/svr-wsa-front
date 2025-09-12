import React, { useState, useRef, useEffect } from 'react';
import { compressDocumentImage } from '../../../../../utils/imageCompression';

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

    // Initialize camera when component opens
    useEffect(() => {
        if (isOpen) {
            initializeCamera();
        } else {
            cleanup();
        }

        return cleanup;
    }, [isOpen, facingMode]);

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
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
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
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraReady(false);
    };

    const switchCamera = () => {
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    };

    const capturePhoto = async () => {
        if (!videoRef.current || !canvasRef.current || isCapturing) return;

        try {
            setIsCapturing(true);

            const video = videoRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw the current frame to canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert canvas to blob
            const blob = await new Promise(resolve => {
                canvas.toBlob(resolve, 'image/jpeg', 0.95);
            });

            // Create a File object from the blob
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileName = `${documentType}_${timestamp}.jpg`;
            const capturedFile = new File([blob], fileName, { 
                type: 'image/jpeg',
                lastModified: Date.now()
            });

            // Compress the captured image
            const compressedFile = await compressDocumentImage(capturedFile, documentType);

            // Call the onCapture callback with the compressed file
            onCapture(compressedFile);
            onClose();

        } catch (error) {
            console.error('Photo capture failed:', error);
            setError('មានបញ្ហាក្នុងការថតរូប។ សូមព្យាយាមម្តងទៀត');
        } finally {
            setIsCapturing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
            <div className="relative w-full h-full max-w-lg mx-auto">
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-4">
                    <div className="flex items-center justify-between text-white">
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <h3 className="text-lg font-semibold text-center flex-1">{title}</h3>
                        {/* Camera switch button (only show on mobile) */}
                        <button
                            onClick={switchCamera}
                            className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors md:hidden"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Camera view */}
                <div className="relative w-full h-full flex items-center justify-center">
                    {error ? (
                        <div className="text-center p-6 text-white">
                            <div className="mb-4">
                                <svg className="w-16 h-16 mx-auto text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 15.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <p className="text-lg mb-4">{error}</p>
                            <button
                                onClick={onClose}
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
                            />
                            
                            {/* ID Card Frame Overlay */}
                            {isCameraReady && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative">
                                        {/* Card frame */}
                                        <div className="w-80 h-48 border-4 border-yellow-400 rounded-lg relative">
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
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                        <div className="flex items-center justify-center space-x-8">
                            {/* File upload alternative */}
                            <label className="flex flex-col items-center cursor-pointer">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
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
                                            onClose();
                                        }
                                    }}
                                    className="sr-only"
                                />
                            </label>

                            {/* Capture button */}
                            <button
                                onClick={capturePhoto}
                                disabled={isCapturing}
                                className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isCapturing ? (
                                    <div className="w-6 h-6 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <div className="w-12 h-12 bg-transparent border-2 border-gray-600 rounded-full"></div>
                                )}
                            </button>

                            {/* Flash/Settings placeholder */}
                            <div className="w-12 h-12 flex items-center justify-center">
                                {/* You can add flash toggle or other settings here */}
                            </div>
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