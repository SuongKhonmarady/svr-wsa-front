import { useState, useEffect } from 'react'

function NewsModal({ isOpen, onClose, news, categories = [], onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category_id: '',
    featured: false,
    image: null,
    published_at: new Date().toISOString().split('T')[0],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)

  // Update form data when news prop changes
  useEffect(() => {
    if (news) {
      const newFormData = {
        title: news.title || '',
        content: news.content || '',
        category_id: news.category_id || '',
        featured: news.featured || false,
        image: null, // Don't pre-fill image for editing
        published_at: news.published_at ? news.published_at.split('T')[0] : new Date().toISOString().split('T')[0],
      }
      setFormData(newFormData)
      // Set existing image preview if editing
      if (news.image) {
        setImagePreview(news.image)
      }
    } else {
      const newFormData = {
        title: '',
        content: '',
        category_id: '',
        featured: false,
        image: null,
        published_at: new Date().toISOString().split('T')[0],
      }
      setFormData(newFormData)
      setImagePreview(null)
    }
    // Clear error and reset image removal state when modal opens/closes or news changes
    setError(null)
    setRemoveImage(false)
  }, [news, isOpen])

  const handleChange = (e) => {
    const { name, value, files, checked, type } = e.target
    if (name === 'image') {
      const file = files[0]
      if (file) {
        handleFileSelect(file)
      } else {
        setImagePreview(news?.image || null)
      }
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleRemoveImage = () => {
    setRemoveImage(true)
    setImagePreview(null)
    setFormData(prev => ({ ...prev, image: null }))
    // Reset the file input
    const fileInput = document.getElementById('image')
    if (fileInput) fileInput.value = ''
  }

  // Handle file selection (both from input and drag & drop)
  const handleFileSelect = (file) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setImageUploading(true)
    setFormData(prev => ({ ...prev, image: file }))
    
    // Create preview URL for the selected image
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target.result)
      setImageUploading(false)
    }
    reader.onerror = () => {
      setError('Failed to read the selected file')
      setImageUploading(false)
    }
    reader.readAsDataURL(file)
    setRemoveImage(false)
    setError(null) // Clear any previous errors
  }

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null) // Clear any previous errors
    
    try {
      // Ensure we have the required values - use original news data as fallback if form state is empty
      const titleValue = formData.title.trim() || (news?.title || '')
      const contentValue = formData.content.trim() || (news?.content || '')
      
      // Validate required fields on frontend first
      if (!titleValue) {
        setError('Title is required')
        setLoading(false)
        return
      }
      if (!contentValue) {
        setError('Content is required')
        setLoading(false)
        return
      }
      
      let dataToSend
      
      // Always use FormData for consistency with backend expectations
      dataToSend = new FormData()
      dataToSend.append('title', titleValue)
      dataToSend.append('content', contentValue)
      dataToSend.append('category_id', formData.category_id || (news?.category_id || ''))
      dataToSend.append('featured', formData.featured ? '1' : '0')
      dataToSend.append('published_at', formData.published_at || (news?.published_at ? news.published_at.split('T')[0] : new Date().toISOString().split('T')[0]))
      
      // For updates with FormData, Laravel needs method spoofing
      if (news) {
        dataToSend.append('_method', 'PUT')
      }
      
      // Handle image upload
      if (formData.image) {
        dataToSend.append('image', formData.image)
      }
      
      // Handle image removal for updates
      if (news && removeImage) {
        dataToSend.append('remove_image', '1')
      }
      
      await onSave(dataToSend, news?.id)
      onClose()
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        category_id: '',
        featured: false,
        image: null,
        published_at: new Date().toISOString().split('T')[0],
      })
      setImagePreview(null)
      setRemoveImage(false)
    } catch (error) {
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
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full z-50">
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

              {/* Category field */}
              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category (optional)</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Featured checkbox */}
              <div>
                <div className="flex items-center">
                  <input
                    id="featured"
                    name="featured"
                    type="checkbox"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm font-medium text-gray-700">
                    Featured Article
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">Featured articles will be highlighted on the homepage</p>
              </div>

              {/* Image field */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                
                {/* Current/Preview Image */}
                {imageUploading && (
                  <div className="mb-3 relative">
                    <div className="w-full h-48 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center">
                      <div className="text-center">
                        <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-sm text-gray-600">Processing image...</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {imagePreview && !removeImage && !imageUploading && (
                  <div className="mb-3 relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                      title="Remove image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* File Input */}
                <div 
                  className="relative"
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleChange}
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    className="hidden"
                  />
                  <label
                    htmlFor="image"
                    className={`w-full flex flex-col items-center justify-center px-6 py-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      dragActive 
                        ? 'border-blue-400 bg-blue-50' 
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    } focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500`}
                  >
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold text-blue-600 hover:text-blue-500">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF, WebP up to 5MB
                        </p>
                      </div>
                    </div>
                  </label>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  {imagePreview && !formData.image ? 'Current image will be kept' : 
                   formData.image ? `Selected: ${formData.image.name}` : 
                   'No image selected'}
                </p>
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
