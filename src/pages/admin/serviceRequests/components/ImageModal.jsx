import React, { useState, useEffect } from 'react';

const ImageModal = ({ isOpen, onClose, document: documentProp, title }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        if (isOpen && documentProp?.url) {
            setImageLoaded(false);
            setImageError(false);
            setImageUrl('');
            
            const token = localStorage.getItem('admin_token');
            if (token) {
                fetch(documentProp.url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'image/*'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        return response.blob();
                    } else {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                })
                .then(blob => {
                    const blobUrl = URL.createObjectURL(blob);
                    setImageUrl(blobUrl);
                    setImageLoaded(true);
                })
                .catch(error => {
                    console.error('Failed to load modal image:', error);
                    setImageError(true);
                });
            } else {
                setImageError(true);
            }
        }
        
        // Cleanup function to revoke blob URL when component unmounts or URL changes
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [isOpen, documentProp?.url]);

    // Handle ESC key to close modal
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscKey);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="relative max-w-6xl max-h-[90vh] w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-white rounded-lg">
                    {/* Modal Header */}
                    <div className="flex justify-between items-center p-4 border-b">
                        <h4 className="text-lg font-semibold text-gray-900">
                            {title} - {documentProp?.filename || 'Document'}
                        </h4>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    {/* Modal Content */}
                    <div className="p-4 flex justify-center">
                        {imageError && (
                            <div className="w-full h-64 flex items-center justify-center text-gray-500">
                                <div className="text-center">
                                    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    <p className="text-lg font-medium">Failed to load image</p>
                                    <p className="text-sm text-gray-400 mt-1">Please check your connection and try again</p>
                                </div>
                            </div>
                        )}

                        {!imageLoaded && !imageError && (
                            <div className="w-full h-64 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-gray-600">Loading image...</p>
                                </div>
                            </div>
                        )}

                        {imageLoaded && imageUrl && (
                            <img
                                src={imageUrl}
                                alt={title}
                                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                                onError={() => setImageError(true)}
                            />
                        )}
                    </div>
                    
                    {/* Modal Footer */}
                    <div className="flex justify-between items-center p-4 border-t bg-gray-50 rounded-b-lg">
                        <div className="text-sm text-gray-600">
                            <span className="font-medium">Type:</span> {documentProp?.type?.replace('_', ' ').toUpperCase() || 'Document'}
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageModal;
