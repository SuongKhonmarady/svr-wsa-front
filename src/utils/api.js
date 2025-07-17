// API Utilities
import config from '../config/api'

// Format API error messages
export const formatApiError = (error) => {
  if (typeof error === 'string') {
    return error
  }
  
  if (error.message) {
    return error.message
  }
  
  return 'An unknown error occurred'
}

// Check if API is available
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${config.BASE_URL}/health`, {
      method: 'GET',
      headers: config.DEFAULT_HEADERS,
    })
    
    return response.ok
  } catch (error) {
    return false
  }
}

// Format date for API requests
export const formatDateForApi = (date) => {
  if (!date) return null
  
  if (typeof date === 'string') {
    return date
  }
  
  if (date instanceof Date) {
    return date.toISOString().split('T')[0]
  }
  
  return null
}

// Parse API date response
export const parseApiDate = (dateString) => {
  if (!dateString) return null
  
  try {
    return new Date(dateString)
  } catch (error) {
    console.error('Error parsing date:', error)
    return null
  }
}

// Build query string from object
export const buildQueryString = (params) => {
  if (!params || typeof params !== 'object') {
    return ''
  }
  
  const queryString = Object.entries(params)
    .filter(([key, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
  
  return queryString ? `?${queryString}` : ''
}

// Validate required fields
export const validateRequiredFields = (data, requiredFields) => {
  const errors = []
  
  requiredFields.forEach(field => {
    if (!data[field] || data[field] === '') {
      errors.push(`${field} is required`)
    }
  })
  
  return errors
}

// Sanitize input data
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return input
  }
  
  // Remove HTML tags and potentially dangerous characters
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .trim()
}

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Check if file is image
export const isImageFile = (file) => {
  if (!file || !file.type) return false
  
  return file.type.startsWith('image/')
}

// Create form data for file upload
export const createFormData = (data) => {
  const formData = new FormData()
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (value instanceof File) {
        formData.append(key, value)
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, item)
        })
      } else {
        formData.append(key, value.toString())
      }
    }
  })
  
  return formData
}

// Debounce function for API calls
export const debounce = (func, delay) => {
  let timeoutId
  
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}

// Throttle function for API calls
export const throttle = (func, limit) => {
  let inThrottle
  
  return (...args) => {
    if (!inThrottle) {
      func.apply(null, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Local storage helpers
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Error getting from localStorage:', error)
      return null
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('Error setting to localStorage:', error)
      return false
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Error removing from localStorage:', error)
      return false
    }
  },
  
  clear: () => {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }
}

// API cache helpers
export const cache = {
  get: (key) => {
    return storage.get(`api_cache_${key}`)
  },
  
  set: (key, data, ttl = 300000) => { // Default 5 minutes TTL
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl
    }
    return storage.set(`api_cache_${key}`, cacheData)
  },
  
  isValid: (key) => {
    const cached = cache.get(key)
    if (!cached) return false
    
    const now = Date.now()
    return (now - cached.timestamp) < cached.ttl
  },
  
  remove: (key) => {
    return storage.remove(`api_cache_${key}`)
  },
  
  clear: () => {
    // Clear all cache entries
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('api_cache_')) {
        storage.remove(key.replace('api_cache_', ''))
      }
    })
  }
}
