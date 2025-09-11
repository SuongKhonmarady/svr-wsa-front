import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import apiService from '../services/api'

function GlobalSearch({ onSearchStateChange }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchInputRef = useRef(null)
  const searchContainerRef = useRef(null)
  const debounceTimerRef = useRef(null)
  const navigate = useNavigate()

  // Auto-focus input when search opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isSearchOpen])

  // Notify parent component when search state changes
  useEffect(() => {
    if (onSearchStateChange) {
      onSearchStateChange(isSearchOpen)
    }
  }, [isSearchOpen, onSearchStateChange])

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        if (searchQuery.trim() === '') {
          setIsSearchOpen(false)
          setShowResults(false)
        }
      }
    }

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSearchOpen, searchQuery])

  // Debounced search function
  useEffect(() => {
    if (searchQuery.length >= 2) {
      // Clear previous timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

    } else {
      setSearchResults({})
      setShowResults(false)
    }

    // Cleanup timer
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [searchQuery])


  const handleSearchClick = () => {
    setIsSearchOpen(true)
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search results page or perform full search
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
      setShowResults(false)
    }
  }

  const handleSearchClose = () => {
    setIsSearchOpen(false)
    setShowResults(false)
    setSearchQuery('')
    setSearchResults({})
  }

  const handleSearchBlur = () => {
    // Delay to allow for click events on results
    setTimeout(() => {
      if (searchQuery.trim() === '') {
        setIsSearchOpen(false)
        setShowResults(false)
      }
    }, 200)
  }

  const getResultIcon = (type) => {
    switch (type) {
      case 'news':
        return '📰'
      case 'monthly_report':
        return '📊'
      case 'yearly_report':
        return '📋'
      default:
        return '📄'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('km-KH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }


  return (
    <div ref={searchContainerRef} className="relative flex items-center w-full sm:w-auto">
      {isSearchOpen ? (
        // Search input form
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
            <input
              ref={searchInputRef}
              onChange={handleSearchChange}
              onBlur={handleSearchBlur}
              type="text"
              placeholder="វាយពាក្យដើម្បីស្វែងរក..."
              className="flex-1 px-3 sm:px-4 py-2 focus:outline-none text-gray-700 placeholder-gray-400 text-sm"
            />
            <div className="flex items-center">
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleSearchClose}
                  className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors duration-200 mr-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 m-1 rounded-full transition-colors duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </form>
      ) : (
        // Search button - Responsive for mobile and desktop
        <button
          onClick={handleSearchClick}
          className="flex items-center space-x-2 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-3 sm:px-4 py-2 rounded-lg shadow-sm hover:shadow-md text-sm font-medium w-full sm:min-w-[200px] justify-start"
        >
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-gray-400 truncate">ស្វែងរក...</span>
        </button>
      )}
    </div>
  )
}

export default GlobalSearch
