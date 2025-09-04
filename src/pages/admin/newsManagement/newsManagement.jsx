import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import NewsTable from './Components/NewsTable'
import NewsModal from './Components/NewsModal'
import newsService from '../../../services/newsService'
import { useToast } from '../../../components/ToastContainer'

function NewsManagement() {
  const { showSuccess, showError } = useToast()
  const [news, setNews] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedNews, setSelectedNews] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchNews()
    fetchCategories()
  }, [])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const result = await newsService.getNews()
      if (result.error) {
        showError('Failed to fetch news: ' + result.error)
      } else {
        setNews(result.data)
      }
    } catch (err) {
      showError('Failed to fetch news')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const result = await newsService.getCategories()
      if (result.error) {
        // Failed to fetch categories
      } else {
        setCategories(result.data)
      }
    } catch (err) {
      // Failed to fetch categories
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

  const handleDeleteNews = async (newsItem) => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      try {
        const result = await newsService.deleteNews(newsItem.slug)
        if (result.error) {
          showError('Error deleting news: ' + result.error)
        } else {
          setNews(news.filter(item => item.id !== newsItem.id))
          showSuccess('News deleted successfully!')
        }
      } catch (err) {
        showError('Failed to delete news')
      }
    }
  }

  const handleSaveNews = async (formData, newsId) => {
    try {

      let result
      if (newsId) {
        // Update existing news - use selectedNews.slug instead of newsId
        result = await newsService.updateNews(selectedNews.slug, formData)
      } else {
        // Create new news
        result = await newsService.createNews(formData)
      }

      if (result.error) {
        showError('Error saving news: ' + result.error)
        throw new Error(result.error)
      } else {
        // Refresh the news list
        await fetchNews()
        showSuccess(newsId ? 'News updated successfully!' : 'News created successfully!')
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
      <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">News Management</h1>
            <p className="text-gray-600 text-sm sm:text-base mt-1">Manage your news articles and announcements</p>
          </div>
          <button
            onClick={handleCreateNews}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            📰 Create New News
          </button>
        </div>

        {/* Search and filters */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex flex-col space-y-4">
              <div className="flex-1">
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
              <div className="flex justify-center sm:justify-end">
                <button
                  onClick={fetchNews}
                  disabled={loading}
                  className={`w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>



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
          categories={categories}
          onSave={handleSaveNews}
        />
      </div>
    </AdminLayout>
  )
}

export default NewsManagement
