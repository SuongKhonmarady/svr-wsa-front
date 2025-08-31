import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', duration = 4000, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);
    const [iconAnimation, setIconAnimation] = useState(false);

    useEffect(() => {
        // Small delay to trigger entrance animation
        const entranceTimer = setTimeout(() => {
            setIsVisible(true);
            // Trigger icon animation after toast appears
            setTimeout(() => setIconAnimation(true), 200);
        }, 100);

        const exitTimer = setTimeout(() => {
            setIsLeaving(true);
            setTimeout(() => {
                onClose();
            }, 300); // Wait for fade out animation
        }, duration);

        return () => {
            clearTimeout(entranceTimer);
            clearTimeout(exitTimer);
        };
    }, [duration, onClose]);

    const getToastStyles = () => {
        switch (type) {
            case 'success':
                return {
                    container: 'bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 shadow-lg',
                    icon: 'text-green-500',
                    text: 'text-green-800',
                    closeButton: 'text-green-400 hover:text-green-600',
                    progressBar: 'bg-green-500'
                };
            case 'error':
                return {
                    container: 'bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 shadow-lg',
                    icon: 'text-red-500',
                    text: 'text-red-800',
                    closeButton: 'text-red-400 hover:text-red-600',
                    progressBar: 'bg-red-500'
                };
            case 'warning':
                return {
                    container: 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-500 shadow-lg',
                    icon: 'text-yellow-500',
                    text: 'text-yellow-800',
                    closeButton: 'text-yellow-400 hover:text-yellow-600',
                    progressBar: 'bg-yellow-500'
                };
            case 'info':
                return {
                    container: 'bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 shadow-lg',
                    icon: 'text-blue-500',
                    text: 'text-blue-800',
                    closeButton: 'text-blue-400 hover:text-blue-600',
                    progressBar: 'bg-blue-500'
                };
            default:
                return {
                    container: 'bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 shadow-lg',
                    icon: 'text-green-500',
                    text: 'text-green-800',
                    closeButton: 'text-green-400 hover:text-green-600',
                    progressBar: 'bg-green-500'
                };
        }
    };

    const getAnimatedIcon = () => {
        const baseClasses = `w-6 h-6 transition-all duration-500 ${styles.icon}`;
        
        switch (type) {
            case 'success':
                return (
                    <div className={`${baseClasses} ${iconAnimation ? 'scale-110' : 'scale-0'}`}>
                        <svg fill="currentColor" viewBox="0 0 20 20" className="animate-pulse">
                            <path 
                                fillRule="evenodd" 
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                                clipRule="evenodd"
                                className={`transition-all duration-700 ${iconAnimation ? 'opacity-100' : 'opacity-0'}`}
                            />
                        </svg>
                    </div>
                );
            case 'error':
                return (
                    <div className={`${baseClasses} ${iconAnimation ? 'scale-110 rotate-0' : 'scale-0 rotate-180'}`}>
                        <svg fill="currentColor" viewBox="0 0 20 20" className="animate-bounce">
                            <path 
                                fillRule="evenodd" 
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                                clipRule="evenodd"
                                className={`transition-all duration-700 ${iconAnimation ? 'opacity-100' : 'opacity-0'}`}
                            />
                        </svg>
                    </div>
                );
            case 'warning':
                return (
                    <div className={`${baseClasses} ${iconAnimation ? 'scale-110' : 'scale-0'}`}>
                        <svg fill="currentColor" viewBox="0 0 20 20" className="animate-ping">
                            <path 
                                fillRule="evenodd" 
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                                clipRule="evenodd"
                                className={`transition-all duration-700 ${iconAnimation ? 'opacity-100' : 'opacity-0'}`}
                            />
                        </svg>
                    </div>
                );
            case 'info':
                return (
                    <div className={`${baseClasses} ${iconAnimation ? 'scale-110' : 'scale-0'}`}>
                        <svg fill="currentColor" viewBox="0 0 20 20" className="animate-pulse">
                            <path 
                                fillRule="evenodd" 
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                                clipRule="evenodd"
                                className={`transition-all duration-700 ${iconAnimation ? 'opacity-100' : 'opacity-0'}`}
                            />
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className={`${baseClasses} ${iconAnimation ? 'scale-110' : 'scale-0'}`}>
                        <svg fill="currentColor" viewBox="0 0 20 20" className="animate-pulse">
                            <path 
                                fillRule="evenodd" 
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                                clipRule="evenodd"
                                className={`transition-all duration-700 ${iconAnimation ? 'opacity-100' : 'opacity-0'}`}
                            />
                        </svg>
                    </div>
                );
        }
    };

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const styles = getToastStyles();

    return (
        <div
            className={`transform transition-all duration-500 ease-out ${
                isVisible && !isLeaving 
                    ? 'translate-x-0 opacity-100 scale-100' 
                    : '-translate-x-full opacity-0 scale-95'
            }`}
        >
            <div className={`max-w-sm w-full rounded-lg overflow-hidden backdrop-blur-sm hover:shadow-xl transition-shadow duration-300 ${styles.container}`}>
                <div className="p-4">
                    <div className="flex items-start space-x-3">
                        {/* Animated Icon */}
                        <div className="flex-shrink-0 flex items-center justify-center">
                            {getAnimatedIcon()}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium leading-5 ${styles.text} transition-all duration-300 ${iconAnimation ? 'opacity-100' : 'opacity-0'}`}>
                                {message}
                            </p>
                        </div>
                        
                        {/* Close Button */}
                        <div className="flex-shrink-0">
                            <button
                                onClick={handleClose}
                                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:scale-110 ${styles.closeButton}`}
                            >
                                <span className="sr-only">Close</span>
                                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Progress Bar */}
                <div className="h-1 bg-gray-200 bg-opacity-50">
                    <div 
                        className={`h-full transition-all duration-300 ease-linear rounded-r-full ${styles.progressBar}`}
                        style={{
                            width: isLeaving ? '0%' : '100%',
                            transition: isLeaving ? 'width 0.3s ease-out' : `width ${duration}ms linear`
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Toast;
