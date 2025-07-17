import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function UserLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock authentication
      if (formData.email && formData.password) {
        const userData = {
          id: 'user123',
          email: formData.email,
          name: 'John Doe',
          customerNumber: 'WSA001234',
          loginTime: new Date().toISOString()
        }
        
        localStorage.setItem('userAuth', JSON.stringify(userData))
        navigate('/users/dashboard')
      } else {
        setError('សូមបញ្ចូលអ៊ីម៉ែល និងពាក្យសម្ងាត់')
      }
    } catch (err) {
      setError('មានបញ្ហាក្នុងការចូលគណនី សូមព្យាយាមម្តងទៀត')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('image/water.png')"
      }}>
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="image/svrwsa_logo_high_quality.png" 
            alt="SVRWSA Logo" 
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ចូលគណនីអតិថិជន
          </h1>
          <p className="text-gray-600">
            ចូលប្រើប្រាស់សេវាកម្មអនឡាញ
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              អ៊ីម៉ែល
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              ពាក្យសម្ងាត់
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                ចងចាំខ្ញុំ
              </label>
            </div>
            <Link to="/users/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
              ភ្លេចពាក្យសម្ងាត់?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            {isLoading ? 'កំពុងចូល...' : 'ចូលគណនី'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            មិនមានគណនីនៅឡើយទេ?{' '}
            <Link to="/users/register" className="text-blue-600 hover:text-blue-500 font-medium">
              ចុះឈ្មោះ
            </Link>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            សូមទាក់ទងការិយាល័យ ប្រសិនបើអ្នកជួបបញ្ហា
          </p>
          <p className="text-center text-sm text-blue-600 mt-1">
            023 991 234
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserLogin
