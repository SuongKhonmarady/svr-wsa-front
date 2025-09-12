/**
 * Image compression utility for ID card and document uploads
 * Optimizes images for easy backend handling while maintaining quality
 */

/**
 * Compresses an image file to optimize size and dimensions for backend processing
 * @param {File} file - The original image file
 * @param {Object} options - Compression options
 * @param {number} options.maxWidth - Maximum width in pixels (default: 1200)
 * @param {number} options.maxHeight - Maximum height in pixels (default: 1600) 
 * @param {number} options.quality - JPEG quality 0-1 (default: 0.8)
 * @param {number} options.maxSizeKB - Maximum file size in KB (default: 500)
 * @returns {Promise<File>} - Compressed image file
 */
export const compressImage = async (file, options = {}) => {
    const {
        maxWidth = 1200,
        maxHeight = 1600,
        quality = 0.8,
        maxSizeKB = 500
    } = options;

    return new Promise((resolve, reject) => {
        // Create image element
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        img.onload = () => {
            try {
                // Calculate new dimensions while maintaining aspect ratio
                let { width, height } = calculateOptimalDimensions(
                    img.width, 
                    img.height, 
                    maxWidth, 
                    maxHeight
                );

                // Set canvas dimensions
                canvas.width = width;
                canvas.height = height;

                // Enable image smoothing for better quality
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                // Draw resized image
                ctx.drawImage(img, 0, 0, width, height);

                // Try different quality levels to achieve target file size
                let currentQuality = quality;
                let attempts = 0;
                const maxAttempts = 5;

                const tryCompress = () => {
                    canvas.toBlob((blob) => {
                        if (!blob) {
                            reject(new Error('Failed to compress image'));
                            return;
                        }

                        const sizeKB = blob.size / 1024;
                        
                        // If size is acceptable or we've tried enough times, return the result
                        if (sizeKB <= maxSizeKB || attempts >= maxAttempts) {
                            // Create new File object with compressed data
                            const compressedFile = new File([blob], file.name, {
                                type: blob.type,
                                lastModified: Date.now()
                            });
                            resolve(compressedFile);
                        } else {
                            // Reduce quality and try again
                            currentQuality *= 0.8;
                            attempts++;
                            tryCompress();
                        }
                    }, 'image/jpeg', currentQuality);
                };

                tryCompress();

            } catch (error) {
                reject(new Error(`Image compression failed: ${error.message}`));
            }
        };

        img.onerror = () => {
            reject(new Error('Failed to load image'));
        };

        // Load the image
        img.src = URL.createObjectURL(file);
    });
};

/**
 * Calculate optimal dimensions while maintaining aspect ratio
 * @param {number} originalWidth 
 * @param {number} originalHeight 
 * @param {number} maxWidth 
 * @param {number} maxHeight 
 * @returns {Object} - {width, height}
 */
const calculateOptimalDimensions = (originalWidth, originalHeight, maxWidth, maxHeight) => {
    let width = originalWidth;
    let height = originalHeight;

    // Calculate scaling factor
    const widthRatio = maxWidth / originalWidth;
    const heightRatio = maxHeight / originalHeight;
    const scalingFactor = Math.min(widthRatio, heightRatio, 1); // Don't upscale

    width = Math.round(originalWidth * scalingFactor);
    height = Math.round(originalHeight * scalingFactor);

    return { width, height };
};

/**
 * Specific compression settings for different document types
 */
export const DOCUMENT_COMPRESSION_SETTINGS = {
    id_card: {
        maxWidth: 1000,
        maxHeight: 700,
        quality: 0.85,
        maxSizeKB: 400
    },
    family_book: {
        maxWidth: 1200,
        maxHeight: 1600,
        quality: 0.8,
        maxSizeKB: 500
    }
};

/**
 * Compress image based on document type
 * @param {File} file - Original image file
 * @param {string} documentType - Type of document ('id_card_front', 'id_card_back', 'family_books')
 * @returns {Promise<File>} - Compressed image file
 */
export const compressDocumentImage = async (file, documentType) => {
    let settings;
    
    if (documentType.includes('id_card')) {
        settings = DOCUMENT_COMPRESSION_SETTINGS.id_card;
    } else if (documentType.includes('family')) {
        settings = DOCUMENT_COMPRESSION_SETTINGS.family_book;
    } else {
        // Default settings
        settings = {
            maxWidth: 1200,
            maxHeight: 1600,
            quality: 0.8,
            maxSizeKB: 500
        };
    }

    return await compressImage(file, settings);
};

/**
 * Validate if file is a supported image format
 * @param {File} file 
 * @returns {boolean}
 */
export const isValidImageFile = (file) => {
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    return supportedTypes.includes(file.type);
};

/**
 * Get human readable file size
 * @param {number} bytes 
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};