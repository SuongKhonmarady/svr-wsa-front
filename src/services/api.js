import config from '../config/api'
import { clearAuth } from '../utils/auth'

// API Service Class
class ApiService {
  constructor() {
    this.baseURL = config.BASE_URL
    this.storageURL = config.STORAGE_URL
    this.timeout = config.TIMEOUT
    this.defaultHeaders = config.DEFAULT_HEADERS
    this.retryConfig = config.RETRY_CONFIG
  }

  // Generic fetch method with error handling
  async fetchWithErrorHandling(url, options = {}) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    // Get auth token for protected routes
    const token = localStorage.getItem('admin_token')
    const headers = {
      ...this.defaultHeaders,
      ...options.headers,
    }

    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        // Try to get error details from response body
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        let errorData = null

        try {
          errorData = await response.json()
          if (errorData.message) {
            errorMessage = errorData.message
          } else if (errorData.errors) {
            // Handle Laravel validation errors
            const validationErrors = Object.values(errorData.errors).flat()
            errorMessage = validationErrors.join(', ')
          }
        } catch (jsonError) {
          // If we can't parse the error response, use the default message
        }

        // Handle authentication errors
        if (response.status === 401) {
          // Token expired or invalid
          clearAuth()
          // Redirect to login if we're not already there
          if (window.location.pathname !== '/admin-login-secret/login') {
            window.location.href = '/admin-login-secret/login'
          }
        } else if (response.status === 403) {
          // Forbidden - insufficient privileges
          clearAuth()
          if (window.location.pathname !== '/admin-login-secret/login') {
            window.location.href = '/admin-login-secret/login'
          }
        }
        
        // Return error with both message and data for validation errors
        return { data: errorData, error: errorMessage }
      }

      const data = await response.json()

      // Log the response for debugging
      console.log(`API Response for ${url}:`, data)

      return { data, error: null }
    } catch (error) {
      clearTimeout(timeoutId)

      let errorMessage = 'An unknown error occurred'

      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. Please check your connection.'
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to server. Please check if the API is running.'
      } else if (error.message.includes('HTTP 404')) {
        errorMessage = 'API endpoint not found. Please check the server configuration.'
      } else if (error.message.includes('HTTP 500')) {
        errorMessage = 'Server error. Please try again later.'
      } else if (error.message.includes('HTTP 401')) {
        errorMessage = 'Unauthorized access. Please check your credentials.'
      } else if (error.message.includes('HTTP 403')) {
        errorMessage = 'Access forbidden. You don\'t have permission to access this resource.'
      } else {
        errorMessage = error.message
      }

      console.error(`API Error for ${url}:`, error)
      return { data: null, error: errorMessage }
    }
  }

  // Generic GET request
  async get(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    return this.fetchWithErrorHandling(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      ...options,
    })
  }

  // Generic POST request
  async post(endpoint, data = {}, options = {}) {
    const url = `${this.baseURL}${endpoint}`

    let body
    let headers = { ...this.defaultHeaders }

    // Handle file uploads with FormData
    if (data instanceof FormData) {
      body = data
      // Remove content-type header to let browser set it with boundary
      delete headers['Content-Type']
    } else {
      body = JSON.stringify(data)
    }

    return this.fetchWithErrorHandling(url, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers,
      body,
      ...options,
    })
  }

  // Generic PUT request
  async put(endpoint, data = {}, options = {}) {
    const url = `${this.baseURL}${endpoint}`

    let body
    let headers = { ...this.defaultHeaders }

    // Handle file uploads with FormData
    if (data instanceof FormData) {
      body = data
      // Remove content-type header to let browser set it with boundary
      delete headers['Content-Type']
    } else {
      body = JSON.stringify(data)
    }

    return this.fetchWithErrorHandling(url, {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      headers,
      body,
      ...options,
    })
  }

  // Generic DELETE request
  async delete(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    return this.fetchWithErrorHandling(url, {
      method: 'DELETE',
      mode: 'cors',
      credentials: 'include',
      ...options,
    })
  }

  // Generic PATCH request
  async patch(endpoint, data = {}, options = {}) {
    const url = `${this.baseURL}${endpoint}`

    let body
    let headers = { ...this.defaultHeaders }

    // Handle file uploads with FormData
    if (data instanceof FormData) {
      body = data
      // Remove content-type header to let browser set it with boundary
      delete headers['Content-Type']
    } else {
      body = JSON.stringify(data)
    }

    return this.fetchWithErrorHandling(url, {
      method: 'PATCH',
      mode: 'cors',
      credentials: 'include',
      headers,
      body,
      ...options,
    })
  }

  // News API Methods
  async getNews() {
    const result = await this.get('/news')

    if (result.error) {
      return result
    }

    // Validate data structure
    if (!Array.isArray(result.data)) {
      return { data: null, error: 'Invalid data format received from server' }
    }

    return result
  }

  async getNewsById(id) {
    return this.get(`/news/${id}`)
  }

  async createNews(newsData) {
    return this.post('/news', newsData)
  }

  async updateNews(id, newsData) {
    return this.put(`/news/${id}`, newsData)
  }

  async deleteNews(id) {
    return this.delete(`/news/${id}`)
  }

  // Service Request API Methods
  async getServiceRequests() {
    return this.get('/service-requests')
  }

  async submitServiceRequest(requestData) {
    return this.post('/service-requests', requestData)
  }

  async updateServiceRequestStatus(id, statusData) {
    return this.patch(`/service-requests/${id}/status`, statusData)
  }

  // Authentication methods
  async logout() {
    return this.post('/logout', {})
  }

  // Monthly Reports API Methods
  async getMonthlyReports() {
    const result = await this.get('/reports/monthly')

    if (result.error) {
      return result
    }

    return result
  }

  async getMonthlyReportsByYear(year) {
    const result = await this.get(`/reports/monthly/year/${year}`)

    if (result.error) {
      return result
    }

    return result
  }

  async getMonthlyReportById(id) {
    return this.get(`/reports/monthly/${id}`)
  }

  async getReportMonths() {
    const result = await this.get('/reports/months')

    if (result.error) {
      return result
    }

    // Validate data structure - handle both array and object with data property
    if (result.data) {
      if (Array.isArray(result.data)) {
        return result
      } else if (result.data.data && Array.isArray(result.data.data)) {
        return result
      } else {
        return { data: null, error: 'Invalid months data format received from server' }
      }
    }

    return { data: null, error: 'No months data received from server' }
  }

  async getReportYears() {
    const result = await this.get('/reports/years')

    if (result.error) {
      return result
    }

    // Validate data structure - handle both array and object with data property
    if (result.data) {
      if (Array.isArray(result.data)) {
        return result
      } else if (result.data.data && Array.isArray(result.data.data)) {
        return result
      } else {
        return { data: null, error: 'Invalid years data format received from server' }
      }
    }

    return { data: null, error: 'No years data received from server' }
  }

  // Admin Monthly Reports API Methods
  async createMonthlyReport(reportData) {
    return this.post('/reports/admin/monthly', reportData)
  }

  async updateMonthlyReport(id, reportData) {
    return this.put(`/reports/admin/monthly/${id}`, reportData)
  }

  async deleteMonthlyReport(id) {
    return this.delete(`/reports/admin/monthly/${id}`)
  }

  // Get single monthly report
  async getMonthlyReport(id) {
    return this.get(`/reports/monthly/${id}`)
  }

  // Publish/Unpublish monthly report
  async publishMonthlyReport(id) {
    return this.post(`/reports/staff/monthly/${id}/publish`)
  }

  async unpublishMonthlyReport(id) {
    return this.post(`/reports/staff/monthly/${id}/unpublish`)
  }

  // Admin get methods for management
  async getAdminMonthlyReports() {
    const result = await this.get('/reports/admin/monthly')

    if (result.error) {
      return result
    }

    return result
  }

  async getAdminMonthlyReportById(id) {
    return this.get(`/reports/admin/monthly/${id}`)
  }

  // Admin Yearly Reports API Methods
  async createYearlyReport(reportData) {
    return this.post('/reports/admin/yearly', reportData)
  }

  async updateYearlyReport(id, reportData) {
    return this.put(`/reports/admin/yearly/${id}`, reportData)
  }

  // Get single yearly report
  async getYearlyReport(id) {
    return this.get(`/reports/yearly/${id}`)
  }

  async deleteYearlyReport(id) {
    return this.delete(`/reports/admin/yearly/${id}`)
  }

  async getAdminYearlyReports() {
    const result = await this.get('/reports/admin/yearly')

    if (result.error) {
      return result
    }

    return result
  }

  async getAdminYearlyReportById(id) {
    return this.get(`/reports/admin/yearly/${id}`)
  }

  // Public yearly reports method
  async getYearlyReports() {
    const result = await this.get('/reports/yearly')

    if (result.error) {
      return result
    }

    return result
  }

  async getAllReports() {
    const [monthly, yearly] = await Promise.all([
      this.get('/reports/monthly'),
      this.get('/reports/yearly')
    ]);

    if (monthly.error || yearly.error) {
      return { data: null, error: 'Failed to fetch all reports' };
    }

    const allReports = [
      ...(monthly.data.data || []).map(r => ({ ...r, type: 'monthly' })),
      ...(yearly.data.data || []).map(r => ({ ...r, type: 'yearly' }))
    ];

    return { data: allReports, error: null };
  }

  // Admin Yearly Reports API Methods (placeholder for future implementation)
  async createYearlyReport(reportData) {
    return this.post('/reports/admin/yearly', reportData)
  }

  async updateYearlyReport(id, reportData) {
    return this.put(`/reports/admin/yearly/${id}`, reportData)
  }

  async deleteYearlyReport(id) {
    return this.delete(`/reports/admin/yearly/${id}`)
  }

  async getAdminYearlyReports() {
    const result = await this.get('/reports/admin/yearly')

    if (result.error) {
      return result
    }

    return result
  }

  async getAdminYearlyReportById(id) {
    return this.get(`/reports/admin/yearly/${id}`)
  }

  async getYearlyReports() {
    const result = await this.get('/reports/yearly')

    if (result.error) {
      return result
    }

    return result
  }

  // Other API Methods (extend as needed)
  async getServices() {
    return this.get('/services')
  }

  async getContact() {
    return this.get('/contact')
  }

  async getLaws() {
    return this.get('/laws')
  }

  async getData() {
    return this.get('/data')
  }

  // Utility method to get image URL
  getImageUrl(imagePath) {
    if (!imagePath) return '/image/svrwsa_logo_high_quality.png'
    return `${this.storageURL}/${imagePath}`
  }
}

// Create and export a singleton instance
const apiService = new ApiService()
export default apiService

// Export individual methods for convenience
export const {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  getServiceRequests,
  submitServiceRequest,
  updateServiceRequestStatus,
  logout,
  getMonthlyReports,
  getMonthlyReportsByYear,
  getMonthlyReportById,
  getReportMonths,
  getReportYears,
  createMonthlyReport,
  updateMonthlyReport,
  deleteMonthlyReport,
  getMonthlyReport,
  publishMonthlyReport,
  unpublishMonthlyReport,
  getAdminMonthlyReports,
  getAdminMonthlyReportById,
  createYearlyReport,
  updateYearlyReport,
  getYearlyReport,
  deleteYearlyReport,
  getAdminYearlyReports,
  getAdminYearlyReportById,
  getYearlyReports,
  getServices,
  getContact,
  getLaws,
  getData,
  getImageUrl
} = apiService
