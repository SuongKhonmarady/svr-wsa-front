import config from '../config/api'

// News Service Class
class NewsService {
  constructor() {
    this.baseURL = config.BASE_URL
    this.storageURL = config.STORAGE_URL
    this.timeout = config.TIMEOUT
    this.defaultHeaders = config.DEFAULT_HEADERS
  }

  // Generic fetch method with error handling
  async fetchWithErrorHandling(url, options = {}) {
    const controller = new AbortController()
    
    // Use longer timeout for file uploads
    const timeout = options.body instanceof FormData ? 300000 : this.timeout // 5 minutes for file uploads
    const timeoutId = setTimeout(() => controller.abort(), timeout)

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
          if (window.location.pathname !== '/admin-login-secret/login') {
            window.location.href = '/admin-login-secret/login'
          }
        } else if (response.status === 403) {
          // Forbidden - insufficient privileges
          if (window.location.pathname !== '/admin-login-secret/login') {
            window.location.href = '/admin-login-secret/login'
          }
        }
        
        // Return error with both message and data for validation errors
        return { data: errorData, error: errorMessage }
      }

      const data = await response.json()

      // Log the response for debugging
      // console.log(`News API Response for ${url}:`, data)

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

      console.error(`News API Error for ${url}:`, error)
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

  // News API Methods
  async getNews(params = {}) {
    // Support pagination and optional category/featured filter while keeping backward compatibility
    const { page = 1, category, featured } = params || {}
    
    // Use dedicated featured endpoint when fetching featured news
    if (featured === true || featured === 'true' || featured === 1 || featured === '1') {
      const search = new URLSearchParams()
      if (page) search.set('page', String(page))
      const endpoint = search.toString() ? `/news/featured?${search.toString()}` : '/news/featured'
      const result = await this.get(endpoint)
      
      if (result.error) {
        return result
      }

      // Handle the featured news response structure
      let newsData = null
      let pagination = null
      
      if (result.data && result.data.success && Array.isArray(result.data.data)) {
        newsData = result.data.data
        const p = result.data.pagination || {}
        pagination = {
          page: p.current_page ?? page,
          perPage: p.per_page ?? 10,
          total: p.total ?? newsData.length,
          lastPage: p.last_page ?? 1,
          hasMore: p.has_more_pages ?? false
        }
      }

      if (!newsData) {
        console.warn('Unexpected featured news API response structure:', result.data)
        return { data: null, error: 'Invalid data format received from server' }
      }

      return { data: newsData, pagination, error: null }
    }
    
    // Regular news endpoint for non-featured or mixed content
    const search = new URLSearchParams()
    if (page) search.set('page', String(page))
    if (category) search.set('category', category)

    const endpoint = search.toString() ? `/news?${search.toString()}` : '/news'
    const result = await this.get(endpoint)

    if (result.error) {
      return result
    }

    // Handle different response structures
  let newsData = null
  let pagination = null
    
    if (result.data) {
      if (Array.isArray(result.data)) {
        // Direct array response
        newsData = result.data
        pagination = {
          page: page,
          perPage: result.data.length,
          total: result.data.length,
          lastPage: 1,
          hasMore: false,
        }
      } else if (result.data.data && Array.isArray(result.data.data)) {
        // Nested data structure: { data: { data: [...] } }
        newsData = result.data.data
        // Try to extract pagination info (supports both meta and pagination keys)
        const meta = result.data.meta || {}
        const p = result.data.pagination || {}
        const current = p.current_page ?? meta.current_page ?? result.data.current_page ?? page ?? 1
        const perPage = p.per_page ?? meta.per_page ?? result.data.per_page ?? 10
        const total = p.total ?? meta.total ?? result.data.total ?? newsData.length
        const lastPage = p.last_page ?? meta.last_page ?? result.data.last_page ?? Math.ceil(total / perPage)
        const nextUrl = p.next_page_url ?? meta.next_page_url ?? result.data.next_page_url
        const hasMore = (typeof p.has_more_pages !== 'undefined' ? !!p.has_more_pages : undefined)
          ?? (nextUrl ? true : false)
          ?? (current < lastPage)
        pagination = { page: current, perPage, total, lastPage, hasMore }
      } else if (result.data.news && Array.isArray(result.data.news)) {
        // Structure with news property: { data: { news: [...] } }
        newsData = result.data.news
        pagination = {
          page: page,
          perPage: result.data.news.length,
          total: result.data.total ?? result.data.news.length,
          lastPage: result.data.last_page ?? 1,
          hasMore: (result.data.next_page_url ? true : false) || ((result.data.current_page ?? page) < (result.data.last_page ?? 1))
        }
      } else if (result.data.success && result.data.data && Array.isArray(result.data.data)) {
        // Success wrapper structure: { data: { success: true, data: [...] } }
        newsData = result.data.data
        // Look for pagination under "pagination" or "meta"
        const meta = result.data.meta || {}
        const p = result.data.pagination || {}
        const current = p.current_page ?? meta.current_page ?? result.data.current_page ?? page ?? 1
        const perPage = p.per_page ?? meta.per_page ?? result.data.per_page ?? 10
        const total = p.total ?? meta.total ?? result.data.total ?? newsData.length
        const lastPage = p.last_page ?? meta.last_page ?? result.data.last_page ?? Math.ceil(total / perPage)
        const nextUrl = p.next_page_url ?? meta.next_page_url ?? result.data.next_page_url
        const hasMore = (typeof p.has_more_pages !== 'undefined' ? !!p.has_more_pages : undefined)
          ?? (nextUrl ? true : false)
          ?? (current < lastPage)
        pagination = { page: current, perPage, total, lastPage, hasMore }
      }
    }

    if (!newsData) {
      console.warn('Unexpected news API response structure:', result.data)
      return { data: null, error: 'Invalid data format received from server' }
    }

    return { data: newsData, pagination, error: null }
  }

  async getNewsBySlug(slug) {
    const result = await this.get(`/news/${slug}`)
    
    if (result.error) {
      return result
    }

    // Handle different response structures for single news item
    let newsData = null
    
    if (result.data) {
      if (result.data.id) {
        // Direct object response
        newsData = result.data
      } else if (result.data.data && result.data.data.id) {
        // Nested data structure: { data: { data: { id: ... } } }
        newsData = result.data.data
      } else if (result.data.news && result.data.news.id) {
        // Structure with news property: { data: { news: { id: ... } } }
        newsData = result.data.news
      } else if (result.data.success && result.data.data && result.data.data.id) {
        // Success wrapper structure: { data: { success: true, data: { id: ... } } }
        newsData = result.data.data
      }
    }

    if (!newsData) {
      console.warn('Unexpected news detail API response structure:', result.data)
      return { data: null, error: 'Invalid data format received from server' }
    }

    return { data: newsData, error: null }
  }

  async getNewsById(id) {
    const result = await this.get(`/news/${id}`)
    
    if (result.error) {
      return result
    }

    // Handle different response structures for single news item
    let newsData = null
    
    if (result.data) {
      if (result.data.id) {
        // Direct object response
        newsData = result.data
      } else if (result.data.data && result.data.data.id) {
        // Nested data structure: { data: { data: { id: ... } } }
        newsData = result.data.data
      } else if (result.data.news && result.data.news.id) {
        // Structure with news property: { data: { news: { id: ... } } }
        newsData = result.data.news
      } else if (result.data.success && result.data.data && result.data.data.id) {
        // Success wrapper structure: { data: { success: true, data: { id: ... } } }
        newsData = result.data.data
      }
    }

    if (!newsData) {
      console.warn('Unexpected news detail API response structure:', result.data)
      return { data: null, error: 'Invalid data format received from server' }
    }

    return { data: newsData, error: null }
  }

  async getNewsByCategory(categorySlug, page = 1) {
    const search = new URLSearchParams()
    if (categorySlug) search.set('category', categorySlug)
    if (page) search.set('page', String(page))
    const endpoint = `/news?${search.toString()}`
    const result = await this.get(endpoint)

    if (result.error) {
      return result
    }

    // The new API response structure includes success, data, filters, and category_info
    // We don't need to validate the data format here since it's a complex object, not just an array
    return result
  }

  async createNews(newsData) {
    const result = await this.post('/news', newsData)
    
    if (result.error) {
      return result
    }

    // The create news API returns a complex structure with multiple data types
    // We don't need to validate the data format here since it's a complex object
    return result
  }

  async updateNews(slug, newsData) {
    let result
    // If FormData contains _method=PUT, use POST for Laravel method spoofing
    if (newsData instanceof FormData && newsData.has('_method')) {
      result = await this.post(`/news/${slug}`, newsData)
    } else {
      result = await this.put(`/news/${slug}`, newsData)
    }
    
    if (result.error) {
      return result
    }

    // The update news API returns a complex structure with multiple data types
    // We don't need to validate the data format here since it's a complex object
    return result
  }

  async deleteNews(slug) {
    const result = await this.delete(`/news/${slug}`)
    
    if (result.error) {
      return result
    }

    // The delete news API returns a simple response
    return result
  }

  // Categories API Methods
  async getCategories() {
    const result = await this.get('/categories')

    if (result.error) {
      return result
    }

    // Handle different response structures
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
      } else if (result.data.success && result.data.data && Array.isArray(result.data.data)) {
        // Success wrapper structure: { data: { success: true, data: [...] } }
        categoriesData = result.data.data
      }
    }

    if (!categoriesData) {
      console.warn('Unexpected categories API response structure:', result.data)
      return { data: null, error: 'Invalid data format received from server' }
    }

    return { data: categoriesData, error: null }
  }

  async getCategoryById(id) {
    const result = await this.get(`/categories/${id}`)
    
    if (result.error) {
      return result
    }

    // Handle different response structures for single category item
    let categoryData = null
    
    if (result.data) {
      if (result.data.id) {
        // Direct object response
        categoryData = result.data
      } else if (result.data.data && result.data.data.id) {
        // Nested data structure: { data: { data: { id: ... } } }
        categoryData = result.data.data
      } else if (result.data.category && result.data.category.id) {
        // Structure with category property: { data: { category: { id: ... } } }
        categoryData = result.data.category
      } else if (result.data.success && result.data.data && result.data.data.id) {
        // Success wrapper structure: { data: { success: true, data: { id: ... } } }
        categoryData = result.data.data
      }
    }

    if (!categoryData) {
      console.warn('Unexpected category detail API response structure:', result.data)
      return { data: null, error: 'Invalid data format received from server' }
    }

    return { data: categoryData, error: null }
  }

  async createCategory(categoryData) {
    const result = await this.post('/categories', categoryData)
    
    if (result.error) {
      return result
    }

    // The create category API returns a complex structure with multiple data types
    // We don't need to validate the data format here since it's a complex object
    return result
  }

  async updateCategory(id, categoryData) {
    const result = await this.put(`/categories/${id}`, categoryData)
    
    if (result.error) {
      return result
    }

    // The update category API returns a complex structure with multiple data types
    // We don't need to validate the data format here since it's a complex object
    return result
  }

  async deleteCategory(id) {
    const result = await this.delete(`/categories/${id}`)
    
    if (result.error) {
      return result
    }

    // The delete category API returns a simple response
    return result
  }

  // Dashboard News Methods
  async getRecentNews() {
    const result = await this.get(`/admin/dashboard/recent-news`)
    
    if (result.error) {
      return result
    }

    // Handle different response structures for recent news
    let newsData = null
    
    if (result.data) {
      if (Array.isArray(result.data)) {
        // Direct array response
        newsData = result.data
      } else if (result.data.data && Array.isArray(result.data.data)) {
        // Nested data structure: { data: { data: [...] } }
        newsData = result.data.data
      } else if (result.data.news && Array.isArray(result.data.news)) {
        // Structure with news property: { data: { news: [...] } }
        newsData = result.data.news
      } else if (result.data.recent_news && Array.isArray(result.data.recent_news)) {
        // Structure with recent_news property: { data: { recent_news: [...] } }
        newsData = result.data.recent_news
      } else if (result.data.success && result.data.data && Array.isArray(result.data.data)) {
        // Success wrapper structure: { data: { success: true, data: [...] } }
        newsData = result.data.data
      }
    }

    if (!newsData) {
      console.warn('Unexpected recent news API response structure:', result.data)
      return { data: null, error: 'Invalid data format received from server' }
    }

    return { data: newsData, error: null }
  }

  // Search API Methods
  async globalSearch(query, limit = 10) {
    const result = await this.get(`/search?q=${encodeURIComponent(query)}&limit=${limit}`)
    
    if (result.error) {
      return result
    }

    // The search API returns a complex structure with multiple data types
    // We don't need to validate the data format here since it's a complex object
    return result
  }

  // Utility method to get image URL
  getImageUrl(imagePath) {
    if (!imagePath) return '/image/svrwsa_logo_high_quality.png'
    return `${this.storageURL}/${imagePath}`
  }
}

// Create and export a singleton instance
const newsService = new NewsService()
export default newsService

// Export individual methods for convenience
export const {
  getNews,
  getNewsById,
  getNewsBySlug,
  getNewsByCategory,
  createNews,
  updateNews,
  deleteNews,
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getRecentNews,
  globalSearch,
  getImageUrl
} = newsService
