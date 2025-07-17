import { useState, useEffect } from 'react'

function NewsModal({ isOpen, onClose, news, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
    published_at: new Date().toISOString().split('T')[0],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Update form data when news prop changes
  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title || '',
        content: news.content || '',
        image: null, // Don't pre-fill image for editing
        published_at: news.published_at ? news.published_at.split('T')[0] : new Date().toISOString().split('T')[0],
      })
    } else {
      setFormData({
        title: '',
        content: '',
        image: null,
        published_at: new Date().toISOString().split('T')[0],
      })
    }
    // Clear error when modal opens/closes or news changes
    setError(null)
  }, [news, isOpen])

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'image') {
      setFormData(prev => ({ ...prev, [name]: files[0] }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null) // Clear any previous errors
    
    try {
      let dataToSend
      
      // If there's an image file, use FormData
      if (formData.image) {
        dataToSend = new FormData()
        dataToSend.append('title', formData.title)
        dataToSend.append('content', formData.content)
        dataToSend.append('published_at', formData.published_at)
        dataToSend.append('image', formData.image)
      } else {
        // If no image, send as JSON
        dataToSend = {
          title: formData.title,
          content: formData.content,
          published_at: formData.published_at
        }
      }
      
      await onSave(dataToSend, news?.id)
      onClose()
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        image: null,
        published_at: new Date().toISOString().split('T')[0],
      })
    } catch (error) {
      console.error('Error saving news:', error)
      // Set error message for display
      setError(error.message || 'Failed to save news. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          onClick={onClose}
        ></div>

        {/* Center the modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        {/* Modal panel */}
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-50">
          {/* Modal header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {news ? 'Edit News' : 'Create New News'}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
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

            {/* Modal form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title field */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter news title"
                />
              </div>

              {/* Content field */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter news content"
                />
              </div>

              {/* Image field */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Optional: Upload an image for the news article</p>
              </div>

              {/* Published date field */}
              <div>
                <label htmlFor="published_at" className="block text-sm font-medium text-gray-700 mb-1">
                  Publish Date
                </label>
                <input
                  type="date"
                  id="published_at"
                  name="published_at"
                  value={formData.published_at}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Modal footer */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (news ? 'Update News' : 'Create News')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsModal
