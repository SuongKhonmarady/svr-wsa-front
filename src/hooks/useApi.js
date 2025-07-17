import { useState, useEffect, useCallback } from 'react'
import apiService from '../services/api'

// Custom hook for API fetching with advanced features
export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = useCallback(async (isRetry = false) => {
    try {
      if (!isRetry) {
        setLoading(true)
      } else {
        setRefreshing(true)
      }
      
      setError(null)

      const result = await apiFunction()
      
      if (result.error) {
        throw new Error(result.error)
      }

      setData(result.data)
      setRetryCount(0)
      
    } catch (err) {
      console.error('API Error:', err)
      setError(err.message)
      
      // Only auto-retry on initial load, not on manual retries or persistent errors
      if (retryCount < 2 && !isRetry) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1)
          fetchData(true)
        }, 2000 * (retryCount + 1)) // Exponential backoff
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [apiFunction, retryCount, ...dependencies])

  // Initial fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Manual retry function
  const retry = useCallback(() => {
    setRetryCount(0)
    fetchData(true)
  }, [fetchData])

  // Refresh function
  const refresh = useCallback(() => {
    fetchData(true)
  }, [fetchData])

  return {
    data,
    loading,
    error,
    retry,
    refresh,
    refreshing,
    retryCount
  }
}

// Custom hook specifically for news
export const useNews = (autoRefresh = false, refreshInterval = 300000) => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  const fetchNews = useCallback(async (isRetry = false) => {
    try {
      if (!isRetry) {
        setLoading(true)
      } else {
        setRefreshing(true)
      }
      
      setError(null)

      const result = await apiService.getNews()
      
      if (result.error) {
        throw new Error(result.error)
      }

      setNews(result.data)
      setRetryCount(0)
      
    } catch (err) {
      console.error('News fetch error:', err)
      setError(err.message)
      
      // Only auto-retry on initial load or manual refresh, not on persistent errors
      if (retryCount < 3 && !isRetry) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1)
          fetchNews(true)
        }, 2000 * (retryCount + 1)) // Exponential backoff
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [retryCount])

  // Initial fetch
  useEffect(() => {
    fetchNews()
  }, [fetchNews])

  // Auto-refresh setup - only if there's no error
  useEffect(() => {
    if (!autoRefresh || error) return

    const interval = setInterval(() => {
      fetchNews(true)
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [fetchNews, autoRefresh, refreshInterval, error])

  // Manual retry function
  const retry = useCallback(() => {
    setRetryCount(0)
    fetchNews(true)
  }, [fetchNews])

  // Refresh function
  const refresh = useCallback(() => {
    fetchNews(true)
  }, [fetchNews])

  return {
    news,
    loading,
    error,
    retry,
    refresh,
    refreshing,
    retryCount
  }
}

// Custom hook for pagination
export const usePagination = (initialPage = 1, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [totalItems, setTotalItems] = useState(0)

  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const paginateData = (data) => {
    setTotalItems(data.length)
    return data.slice(startIndex, endIndex)
  }

  return {
    currentPage,
    totalPages,
    totalItems,
    goToPage,
    nextPage,
    prevPage,
    paginateData,
    startIndex,
    endIndex
  }
}
