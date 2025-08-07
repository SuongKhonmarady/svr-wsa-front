// API Configuration
const API_CONFIG = {
  // Base API URL
  BASE_URL: 'http://localhost:8000/api',
  
  // Storage URL for images
  STORAGE_URL: 'http://localhost:8000/storage',
  
  // Request timeout in milliseconds
  TIMEOUT: 30000, // Increased to 30 seconds
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  
  // Retry configuration
  RETRY_CONFIG: {
    maxRetries: 3,
    retryDelay: 2000, // Base delay in milliseconds
    exponentialBackoff: true,
  },
  
  // Auto-refresh configuration
  AUTO_REFRESH: {
    enabled: true,
    interval: 300000, // 5 minutes in milliseconds
  },
  
  // Endpoints
  ENDPOINTS: {
    NEWS: '/news',
    CATEGORIES: '/categories',
    SERVICES: '/services',
    CONTACT: '/contact',
    LAWS: '/laws',
    DATA: '/data',
    ABOUT: '/about',
  },
}

// Export the configuration
export default API_CONFIG
