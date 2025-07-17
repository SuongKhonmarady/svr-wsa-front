import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import NewsTable from './Components/NewsTable'
import NewsModal from './Components/NewsModal'
import apiService from '../../../services/api'

function NewsManagement() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedNews, setSelectedNews] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const result = await apiService.getNews()
      if (result.error) {
        setError(result.error)
      } else {
        setNews(result.data)
      }
    } catch (err) {
      setError('Failed to fetch news')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNews = () => {
    setSelectedNews(null)
    setModalOpen(true)
  }

  const handleEditNews = (newsItem) => {
    setSelectedNews(newsItem)
    setModalOpen(true)
  }

  const handleDeleteNews = async (id) => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      try {
        setError(null)
        const result = await apiService.deleteNews(id)
        if (result.error) {
          setError('Error deleting news: ' + result.error)
        } else {
          setNews(news.filter(item => item.id !== id))
          setSuccess('News deleted successfully!')
          setTimeout(() => setSuccess(null), 3000)
        }
      } catch (err) {
        setError('Failed to delete news')
      }
    }
  }

  const handleSaveNews = async (formData, id) => {
    try {
      setError(null)
      let result
      if (id) {
        // Update existing news
        result = await apiService.updateNews(id, formData)
      } else {
        // Create new news
        result = await apiService.createNews(formData)
      }

      if (result.error) {
        setError('Error saving news: ' + result.error)
        throw new Error(result.error)
      } else {
        // Refresh the news list
        await fetchNews()
        setSuccess(id ? 'News updated successfully!' : 'News created successfully!')
        setTimeout(() => setSuccess(null), 3000)
        setModalOpen(false)
      }
    } catch (err) {
      throw err
    }
  }

  const filteredNews = news.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">News Management</h1>
            <p className="text-gray-600">Manage your news articles and announcements</p>
          </div>
          <button
            onClick={handleCreateNews}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            📰 Create New News
          </button>
        </div>

        {/* Search and filters */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex-1 max-w-md">
                <label htmlFor="search" className="sr-only">Search news</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    id="search"
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search news..."
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={fetchNews}
                  disabled={loading}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                >
                  {loading ? '🔄 Loading...' : '🔄 Refresh'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Success message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* News table */}
        <NewsTable
          news={filteredNews}
          onEdit={handleEditNews}
          onDelete={handleDeleteNews}
          loading={loading}
        />

        {/* News modal */}
        <NewsModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          news={selectedNews}
          onSave={handleSaveNews}
        />
      </div>
    </AdminLayout>
  )
}

export default NewsManagement
