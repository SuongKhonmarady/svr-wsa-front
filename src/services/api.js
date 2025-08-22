import config from '../config/api'
import { clearAuth } from '../utils/auth'
import newsService from './newsService'

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
    
    // Carefully handle headers - don't override FormData headers
    let headers = {}
    
    // Only add default headers if not FormData
    if (!(options.body instanceof FormData)) {
      headers = { ...this.defaultHeaders }
    }
    
    // Add any custom headers from options
    headers = { ...headers, ...options.headers }

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
          if (window.location.pathname !== '/svrwu-admin-login/login') {
            window.location.href = '/svrwu-admin-login/login'
          }
        } else if (response.status === 403) {
          // Forbidden - insufficient privileges
          clearAuth()
          if (window.location.pathname !== '/svrwu-admin-login/login') {
            window.location.href = '/svrwu-admin-login/login'
          }
        }
        
        // Return error with both message and data for validation errors
        return { data: errorData, error: errorMessage }
      }

      const data = await response.json()



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

  // News API Methods - Delegated to newsService
  async getNews() {
    return newsService.getNews()
  }

  async getNewsBySlug(slug) {
    return newsService.getNewsBySlug(slug)
  }

  async getNewsById(id) {
    return newsService.getNewsById(id)
  }

  async getNewsByCategory(categorySlug) {
    return newsService.getNewsByCategory(categorySlug)
  }

  async createNews(newsData) {
    return newsService.createNews(newsData)
  }

  async updateNews(slug, newsData) {
    return newsService.updateNews(slug, newsData)
  }

  async deleteNews(slug) {
    return newsService.deleteNews(slug)
  }

  // Categories API Methods - Delegated to newsService
  async getCategories() {
    return newsService.getCategories()
  }

  async getCategoryById(id) {
    return newsService.getCategoryById(id)
  }

  async createCategory(categoryData) {
    return newsService.createCategory(categoryData)
  }

  async updateCategory(id, categoryData) {
    return newsService.updateCategory(id, categoryData)
  }

  async deleteCategory(id) {
    return newsService.deleteCategory(id)
  }

  // Service Request API Methods
  async getServiceRequests() {
    const result = await this.get('/service-requests')
    
    if (result.error) {
      return result
    }

    // Handle different response structures for service requests
    let requestsData = null
    
    if (result.data) {
      if (Array.isArray(result.data)) {
        // Direct array response
        requestsData = result.data
      } else if (result.data.data && Array.isArray(result.data.data)) {
        // Nested data structure: { data: { data: [...] } }
        requestsData = result.data.data
      } else if (result.data.service_requests && Array.isArray(result.data.service_requests)) {
        // Structure with service_requests property: { data: { service_requests: [...] } }
        requestsData = result.data.service_requests
      } else if (result.data.success && result.data.data && Array.isArray(result.data.data)) {
        // Success wrapper structure: { data: { success: true, data: [...] } }
        requestsData = result.data.data
      }
    }

    if (!requestsData) {
      return { data: null, error: 'Invalid data format received from server' }
    }

    return { data: requestsData, error: null }
  }

  // Admin Service Request Methods
  async getAdminServiceRequests(queryParams = '') {
    const url = queryParams ? `/admin/service-requests?${queryParams}` : '/admin/service-requests';
    const result = await this.get(url)
    
    if (result.error) {
      return result
    }

    // Handle different response structures for admin service requests

    // Handle different response structures for admin service requests
    let requestsData = null
    let totalCount = 0
    
    if (result.data) {
      if (Array.isArray(result.data)) {
        // Direct array response
        requestsData = result.data
        totalCount = result.data.length
      } else if (result.data.data && Array.isArray(result.data.data)) {
        // Nested data structure: { data: { data: [...] } }
        requestsData = result.data.data
        totalCount = result.data.total || result.data.data.length
      } else if (result.data.service_requests && Array.isArray(result.data.service_requests)) {
        // Structure with service_requests property: { data: { service_requests: [...] } }
        requestsData = result.data.service_requests
        totalCount = result.data.total || result.data.service_requests.length
      } else if (result.data.success && result.data.data && Array.isArray(result.data.data)) {
        // Success wrapper structure: { data: { success: true, data: [...] } }
        requestsData = result.data.data
        totalCount = result.data.total || result.data.data.length
      } else if (result.data.success && result.data.data && !Array.isArray(result.data.data)) {
        // Single item response: { success: true, data: { id: ... } }
        requestsData = [result.data.data]
        totalCount = 1
      }
    }

    if (!requestsData) {
      return { data: null, error: 'Invalid data format received from server' }
    }

    // Return the structure expected by the parent component
    return { 
      data: {
        success: true,
        data: requestsData,
        total: totalCount
      }, 
      error: null 
    }
  }

  async getAdminServiceRequestById(id) {
    const result = await this.get(`/admin/service-requests/${id}`)
    
    if (result.error) {
      return result
    }

    // Handle different response structures for single admin service request item
    let requestData = null
    
    if (result.data) {
      if (result.data.id) {
        // Direct object response
        requestData = result.data
      } else if (result.data.data && result.data.data.id) {
        // Nested data structure: { data: { data: { id: ... } } }
        requestData = result.data.data
      } else if (result.data.service_request && result.data.service_request.id) {
        // Structure with service_request property: { data: { service_request: { id: ... } } }
        requestData = result.data.service_request
      } else if (result.data.success && result.data.data && result.data.data.id) {
        // Success wrapper structure: { data: { success: true, data: { id: ... } } }
        requestData = result.data.data
      }
    }

    if (!requestData) {
      return { data: null, error: 'Invalid data format received from server' }
    }

    return { data: requestData, error: null }
  }

  async serveDocument(id, type, filename) {

    
    let routeType, actualFilename;
    
    if (filename.includes('/')) {
      // Path like "private/id_docs/5/front.jpg"
      const pathParts = filename.split('/');
      if (pathParts.length >= 3) {
        routeType = pathParts[1]; // "id_docs" or "family_books"
        actualFilename = pathParts[pathParts.length - 1]; // "front.jpg"
      } else {
        actualFilename = pathParts[pathParts.length - 1];
        routeType = type === 'id_card' ? 'id_docs' : 'family_books';
      }
    } else {
      actualFilename = filename;
      routeType = type === 'id_card' ? 'id_docs' : 'family_books';
    }
    
    const url = `${this.baseURL}/admin/service-requests/${id}/documents/${routeType}/${actualFilename}`;
    return url;
  }

  async getProtectedDocument(id, type, filename) {
    let routeType, actualFilename;
    
    if (filename.includes('/')) {
      // Path like "private/id_docs/5/front.jpg"
      const pathParts = filename.split('/');
      if (pathParts.length >= 3) {
        routeType = pathParts[1]; // "id_docs" or "family_books"
        actualFilename = pathParts[pathParts.length - 1]; // "front.jpg"
      } else {
        actualFilename = pathParts[pathParts.length - 1];
        routeType = type === 'id_card' ? 'id_docs' : 'family_books';
      }
    } else {
      actualFilename = filename;
      routeType = type === 'id_card' ? 'id_docs' : 'family_books';
    }
    
    const url = `${this.baseURL}/admin/service-requests/${id}/documents/${routeType}/${actualFilename}`;
    
    // Get auth token
    const token = localStorage.getItem('admin_token');
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'image/*'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      throw error;
    }
  }

  async submitServiceRequest(requestData) {
    const result = await this.post('/service-requests', requestData)
    
    if (result.error) {
      return result
    }

    // The submit service request API returns a complex structure with multiple data types
    // We don't need to validate the data format here since it's a complex object
    return result
  }

  async getServiceRequestCategories() {
    const result = await this.get('/service-categories')
    
    if (result.error) {
      return result
    }

    // Handle different response structures for service request categories
    let categoriesData = null
    
    if (result.data) {
      if (Array.isArray(result.data)) {
        // Direct array response
        categoriesData = result.data
      } else if (result.data.data && Array.isArray(result.data.data)) {
        // Nested data structure: { data: { data: [...] } }
        categoriesData = result.data.data
      } else if (result.data.categories && Array.isArray(result.data.categories)) {
        // Structure with categories property: { data: { categories: [...] } }
        categoriesData = result.data.categories
      } else if (result.data.service_categories && Array.isArray(result.data.service_categories)) {
        // Structure with service_categories property: { data: { service_categories: [...] } }
        categoriesData = result.data.service_categories
      } else if (result.data.success && result.data.data && Array.isArray(result.data.data)) {
        // Success wrapper structure: { data: { success: true, data: [...] } }
        categoriesData = result.data.data
      } else if (result.data.success && result.data.data && !Array.isArray(result.data.data)) {
        // Success wrapper with object data: { data: { success: true, data: {...} } }
        // This is the correct case for the current API response
        categoriesData = result.data.data
      }
    }

    if (!categoriesData) {
      return { data: null, error: 'Invalid data format received from server' }
    }

    return { data: categoriesData, error: null }
  }

  async updateServiceRequestStatus(id, statusData) {
    const result = await this.patch(`/service-requests/${id}/status`, statusData)
    
    if (result.error) {
      return result
    }

    // The update service request status API returns a complex structure with multiple data types
    // We don't need to validate the data format here since it's a complex object
    return result
  }

  // Authentication methods
  async logout() {
    const result = await this.post('/logout', {})
    
    if (result.error) {
      return result
    }

    // The logout API returns a simple response
    return result
  }

  // Monthly Reports API Methods
  async getMonthlyReports() {
    const result = await this.get('/reports/monthly')

    if (result.error) {
      return result
    }

    // The monthly reports API returns a complex structure with multiple data types
    // We don't need to validate the data format here since it's a complex object
    return result
  }

  async getMonthlyReportsByYear(year) {
    const result = await this.get(`/reports/monthly/year/${year}`)

    if (result.error) {
      return result
    }

    // The monthly reports by year API returns a complex structure with multiple data types
    // We don't need to validate the data format here since it's a complex object
    return result
  }

  async getMonthlyReportById(id) {
    const result = await this.get(`/reports/monthly/${id}`)
    
    if (result.error) {
      return result
    }

    // The monthly report by ID API returns a complex structure with multiple data types
    // We don't need to validate the data format here since it's a complex object
    return result
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
    const result = await this.get(`/reports/monthly/${id}`)
    
    if (result.error) {
      return result
    }

    // The monthly report by ID API returns a complex structure with multiple data types
    // We don't need to validate the data format here since it's a complex object
    return result
  }

  // Publish/Unpublish monthly report
  async publishMonthlyReport(id) {
    const result = await this.post(`/reports/staff/monthly/${id}/publish`)
    
    if (result.error) {
      return result
    }

    // The publish monthly report API returns a simple response
    return result
  }

  async unpublishMonthlyReport(id) {
    const result = await this.post(`/reports/staff/monthly/${id}/unpublish`)
    
    if (result.error) {
      return result
    }

    // The unpublish monthly report API returns a simple response
    return result
  }

  // Publish/Unpublish yearly report
  async publishYearlyReport(id) {
    const result = await this.post(`/reports/staff/yearly/${id}/publish`)
    
    if (result.error) {
      return result
    }

    // The publish yearly report API returns a simple response
    return result
  }

  async unpublishYearlyReport(id) {
    const result = await this.post(`/reports/staff/yearly/${id}/unpublish`)
    
    if (result.error) {
      return result
    }

    // The unpublish yearly report API returns a simple response
    return result
  }

  // Admin get methods for management
  async getAdminMonthlyReports() {
    const result = await this.get('/reports/staff/monthly/all')

    if (result.error) {
      return result
    }

    return result
  }

  async getAdminMonthlyReportById(id) {
    const result = await this.get(`/reports/staff/monthly/${id}`)
    
    if (result.error) {
      return result
    }

    // The admin monthly report by ID API returns a complex structure with multiple data types
    // We don't need to validate the data format here since it's a complex object
    return result
  }

  // Admin get methods for yearly reports
  async getAdminYearlyReports() {
    const result = await this.get('/reports/staff/yearly/all')

    if (result.error) {
      return result
    }

    return result
  }

  async getAdminYearlyReportById(id) {
    const result = await this.get(`/reports/staff/yearly/${id}`)
    
    if (result.error) {
      return result
    }

    // The admin yearly report by ID API returns a complex structure with multiple data types
    // We don't need to validate the data format here since it's a complex object
    return result
  }

  // Admin Yearly Reports API Methods
  async createYearlyReport(reportData) {
    const result = await this.post('/reports/admin/yearly', reportData)
    
    if (result.error) {
      return result
    }

    // The create yearly report API returns a complex structure with multiple data types
    // We don't need to validate the data format here since it's a complex object
    return result
  }

  async updateYearlyReport(id, reportData) {
    const result = await this.put(`/reports/admin/yearly/${id}`, reportData)
    
    if (result.error) {
      return result
    }

    // The update yearly report API returns a complex structure with multiple data types
    // We don't need to validate the data format here since it's a complex object
    return result
  }

  // Get single yearly report
  async getYearlyReport(id) {
    const result = await this.get(`/reports/yearly/${id}`)
    
    if (result.error) {
      return result
    }

    // The yearly report by ID API returns a complex structure with multiple data types
    // We don't need to validate the data format here since it's a complex object
    return result
  }

  async deleteYearlyReport(id) {
    const result = await this.delete(`/reports/admin/yearly/${id}`)
    
    if (result.error) {
      return result
    }

    // The delete yearly report API returns a simple response
    return result
  }

  // async getAdminYearlyReports() {
  //   const result = await this.get('/reports/admin/yearly')

  //   if (result.error) {
  //     return result
  //   }

  //   return result
  // }

  async getAdminYearlyReportById(id) {
    return this.get(`/reports/admin/yearly/${id}`)
  }

  // Public yearly reports method
  async getYearlyReports() {
    const result = await this.get('/reports/yearly')

    if (result.error) {
      return result
    }

    // The yearly reports API returns a complex structure with multiple data types
    // We don't need to validate the data format here since it's a complex object
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

    // Handle different response structures for reports
    let monthlyReports = []
    let yearlyReports = []
    
    if (monthly.data) {
      if (Array.isArray(monthly.data)) {
        monthlyReports = monthly.data
      } else if (monthly.data.data && Array.isArray(monthly.data.data)) {
        monthlyReports = monthly.data.data
      } else if (monthly.data.monthly_reports && Array.isArray(monthly.data.monthly_reports)) {
        monthlyReports = monthly.data.monthly_reports
      }
    }
    
    if (yearly.data) {
      if (Array.isArray(yearly.data)) {
        yearlyReports = yearly.data
      } else if (yearly.data.data && Array.isArray(yearly.data.data)) {
        yearlyReports = yearly.data.data
      } else if (yearly.data.yearly_reports && Array.isArray(yearly.data.yearly_reports)) {
        yearlyReports = yearly.data.yearly_reports
      }
    }

    const allReports = [
      ...monthlyReports.map(r => ({ ...r, type: 'monthly' })),
      ...yearlyReports.map(r => ({ ...r, type: 'yearly' }))
    ];

    return { data: allReports, error: null };
  }

  // Other API Methods (extend as needed)
  async getServices() {
    const result = await this.get('/services')
    
    if (result.error) {
      return result
    }

    // Handle different response structures for services
    let servicesData = null
    
    if (result.data) {
      if (Array.isArray(result.data)) {
        // Direct array response
        servicesData = result.data
      } else if (result.data.data && Array.isArray(result.data.data)) {
        // Nested data structure: { data: { data: [...] } }
        servicesData = result.data.data
      } else if (result.data.services && Array.isArray(result.data.services)) {
        // Structure with services property: { data: { services: [...] } }
        servicesData = result.data.services
      } else if (result.data.success && result.data.data && Array.isArray(result.data.data)) {
        // Success wrapper structure: { data: { success: true, data: [...] } }
        servicesData = result.data.data
      }
    }

    if (!servicesData) {
      return { data: null, error: 'Invalid data format received from server' }
    }

    return { data: servicesData, error: null }
  }

  async getContact() {
    const result = await this.get('/contact')
    
    if (result.error) {
      return result
    }

    // The contact API returns a complex structure with multiple data types
    // We don't need to validate the data format here since it's a complex object
    return result
  }

  async getLaws() {
    const result = await this.get('/laws')
    
    if (result.error) {
      return result
    }

    // Handle different response structures for laws
    let lawsData = null
    
    if (result.data) {
      if (Array.isArray(result.data)) {
        // Direct array response
        lawsData = result.data
      } else if (result.data.data && Array.isArray(result.data.data)) {
        // Nested data structure: { data: { data: [...] } }
        lawsData = result.data.data
      } else if (result.data.laws && Array.isArray(result.data.laws)) {
        // Structure with laws property: { data: { laws: [...] } }
        lawsData = result.data.laws
      } else if (result.data.success && result.data.data && Array.isArray(result.data.data)) {
        // Success wrapper structure: { data: { success: true, data: [...] } }
        lawsData = result.data.data
      }
    }

    if (!lawsData) {
      return { data: null, error: 'Invalid data format received from server' }
    }

    return { data: lawsData, error: null }
  }

  async getData() {
    const result = await this.get('/data')
    
    if (result.error) {
      return result
    }

    // The data API returns a complex structure with multiple data types
    // We don't need to validate the data format here since it's a complex object
    return result
  }

  // Dashboard API Methods
  async getDashboardStats() {
    const result = await this.get('/admin/dashboard/stats')
    
    if (result.error) {
      return result
    }

    // The dashboard stats API returns a complex structure with multiple data types
    // We don't need to validate the data format here since it's a complex object
    return result
  }

  async getCustomerGrowthData(year = new Date().getFullYear()) {
    const result = await this.get(`/admin/dashboard/customer-growth/${year}`)
    
    if (result.error) {
      return result
    }

    // The customer growth API returns a complex structure with multiple data types
    // We don't need to validate the data format here since it's a complex object
    return result
  }

  async getRecentNews() {
    return newsService.getRecentNews()
  }

  async getRecentReports() {
    const result = await this.get(`/admin/dashboard/recent-reports`)
    
    if (result.error) {
      return result
    }

    // Handle different response structures for recent reports
    let reportsData = null
    
    if (result.data) {
      if (Array.isArray(result.data)) {
        // Direct array response
        reportsData = result.data
      } else if (result.data.data && Array.isArray(result.data.data)) {
        // Nested data structure: { data: { data: [...] } }
        reportsData = result.data.data
      } else if (result.data.reports && Array.isArray(result.data.reports)) {
        // Structure with reports property: { data: { reports: [...] } }
        reportsData = result.data.reports
      } else if (result.data.recent_reports && Array.isArray(result.data.recent_reports)) {
        // Structure with recent_reports property: { data: { recent_reports: [...] } }
        reportsData = result.data.recent_reports
      } else if (result.data.success && result.data.data && Array.isArray(result.data.data)) {
        // Success wrapper structure: { data: { success: true, data: [...] } }
        reportsData = result.data.data
      }
    }

    if (!reportsData) {
      return { data: null, error: 'Invalid data format received from server' }
    }

    return { data: reportsData, error: null }
  }

  async getSystemStatus() {
    const result = await this.get('/admin/dashboard/system-status')
    
    if (result.error) {
      return result
    }

    // The system status API returns a complex structure with multiple data types
    // We don't need to validate the data format here since it's a complex object
    return result
  }

  // Utility method to get image URL - Delegated to newsService
  getImageUrl(imagePath) {
    return newsService.getImageUrl(imagePath)
  }

  // Search API Methods - Delegated to newsService
  async globalSearch(query, limit = 10) {
    return newsService.globalSearch(query, limit)
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
  getAdminServiceRequests,
  getAdminServiceRequestById,
  serveDocument,
  getProtectedDocument,
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
  publishYearlyReport,
  unpublishYearlyReport,
  getAdminMonthlyReports,
  getAdminMonthlyReportById,
  getAdminYearlyReports,
  getAdminYearlyReportById,
  createYearlyReport,
  updateYearlyReport,
  getYearlyReport,
  deleteYearlyReport,
  getYearlyReports,
  getServices,
  getContact,
  getLaws,
  getData,
  getDashboardStats,
  getCustomerGrowthData,
  getRecentNews,
  getRecentReports,
  getSystemStatus,
  getImageUrl,
  globalSearch
} = apiService
