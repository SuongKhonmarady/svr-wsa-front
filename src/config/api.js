// API Configuration
const API_CONFIG = {
  // Base API URL
  BASE_URL: 'https://api-scholar.site/api',
  
  // Storage URL for images
  STORAGE_URL: 'https://api-scholar.site/storage',

  // Request timeout in milliseconds
  TIMEOUT: 300000, // Increased to 5 minutes for large file uploads
  
  // File upload configuration
  FILE_UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB maximum file size
    TIMEOUT: 300000, // 5 minutes for file uploads
    CHUNK_SIZE: 1024 * 1024, // 1MB chunks for large files
  },
  
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
