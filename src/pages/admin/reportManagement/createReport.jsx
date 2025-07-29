import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import apiService from '../../../services/api'

// Pass currentUserId as a prop or get it from your auth context/store
function CreateMonthlyReport() {
  // State variables to hold form data
  const [yearId, setYearId] = useState('');
  const [monthId, setMonthId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('draft');
  const [file, setFile] = useState(null);

  // State to hold data fetched from the API for dropdowns
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);
  
  // State variables for UI feedback
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isFetchingInitialData, setIsFetchingInitialData] = useState(true);

  // State variables for authorization
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState(null);

  /**
   * On component mount, check localStorage for admin credentials.
   */
  useEffect(() => {
    try {
      const token = localStorage.getItem('admin_token');
      const adminUserString = localStorage.getItem('admin_user');

      if (token && adminUserString) {
        const adminUser = JSON.parse(adminUserString);
        setUser({ ...adminUser, token });
        setIsAuthorized(true);
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage:", e);
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  /**
   * After authorization, fetch years and months for the form dropdowns.
   */
  useEffect(() => {
    if (!isAuthorized || !user?.token) {
        setIsFetchingInitialData(false);
        return;
    }

    const fetchInitialData = async () => {
      setIsFetchingInitialData(true);
      setError(null);
      try {
        // Updated API endpoints to use the full URL.
        const [yearsResponse, monthsResponse] = await Promise.all([
          fetch('http://localhost:8000/api/reports/years', { headers: { 'Authorization': `Bearer ${user.token}`, 'Accept': 'application/json' } }),
          fetch('http://localhost:8000/api/reports/months', { headers: { 'Authorization': `Bearer ${user.token}`, 'Accept': 'application/json' } })
        ]);

        if (!yearsResponse.ok) {
          throw new Error(`Failed to fetch years (status: ${yearsResponse.status}). Please check API endpoint and server status.`);
        }
        if (!monthsResponse.ok) {
          throw new Error(`Failed to fetch months (status: ${monthsResponse.status}). Please check API endpoint and server status.`);
        }

        const yearsData = await yearsResponse.json();
        const monthsData = await monthsResponse.json();

        // Assuming API returns an array of objects like [{id: 1, name: '2024'}]
        // Adjust '.data' if your API response structure is different.
        setYears(yearsData.data || yearsData);
        setMonths(monthsData.data || monthsData);

      } catch (err) {
        // Catch network errors and provide a more helpful message.
        if (err instanceof TypeError) { // This often indicates a network error like ERR_CONNECTION_REFUSED
             setError('Network error: Could not connect to the API. Please ensure the backend server is running and accessible.');
        } else {
             setError(`Form load error: ${err.message}`);
        }
      } finally {
        setIsFetchingInitialData(false);
      }
    };

    fetchInitialData();
  }, [isAuthorized, user]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthorized || !user) {
        setError("You are not authorized to create a report.");
        return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append('year_id', yearId);
    formData.append('month_id', monthId);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('status', status);
    formData.append('created_by', user.name);
    if (file) {
      formData.append('file', file);
    }
    
    try {
      // Updated API endpoint to use the full URL.
      const response = await fetch('http://localhost:8000/api/reports/admin/monthly', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${user.token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle validation errors from the server
        if (response.status === 422 && result.errors) {
            const errorMessages = Object.values(result.errors).flat().join(' ');
            throw new Error(errorMessages);
        }
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }
      
      setSuccessMessage(result.message || 'Report created successfully!');
      // Reset form fields
      setYearId('');
      setMonthId('');
      setTitle('');
      setDescription('');
      setStatus('draft');
      setFile(null);
      if(document.getElementById('file-input')) {
        document.getElementById('file-input').value = '';
      }

    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth || (isAuthorized && isFetchingInitialData)) {
    return (
        <div className="w-full max-w-lg p-8 text-center text-gray-600">
            <p>{isCheckingAuth ? 'Checking authorization...' : 'Loading form data...'}</p>
        </div>
    );
  }

  if (!isAuthorized) {
      return (
        <div className="w-full max-w-lg p-8 space-y-4 bg-white rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold text-red-700">Access Denied</h1>
            <p className="text-gray-700">Only administrators are permitted to create monthly reports. Please ensure you are logged in.</p>
        </div>
      );
  }

  return (
    <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center text-gray-800">Create Monthly Report</h1>
      
      {/* Display a general error message at the top of the form if initial data fails to load */}
      {error && !successMessage && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          <span className="font-medium">Error!</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Year Dropdown */}
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
          <select
            id="year"
            value={yearId}
            onChange={(e) => setYearId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
            disabled={isFetchingInitialData || years.length === 0}
          >
            <option value="" disabled>Select a year</option>
            {years.map((y) => (
              <option key={y.id} value={y.id}>{y.name || y.year}</option> // Use y.name or y.year based on your API
            ))}
          </select>
        </div>

        {/* Month Dropdown */}
        <div>
          <label htmlFor="month" className="block text-sm font-medium text-gray-700">Month</label>
          <select
            id="month"
            value={monthId}
            onChange={(e) => setMonthId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
            disabled={isFetchingInitialData || months.length === 0}
          >
            <option value="" disabled>Select a month</option>
            {months.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        {/* Description Textarea */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          ></textarea>
        </div>

        {/* Status Dropdown */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {/* File Input */}
        <div>
          <label htmlFor="file-input" className="block text-sm font-medium text-gray-700">Report File</label>
          <input
            type="file"
            id="file-input"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-md file:border-0
                       file:text-sm file:font-semibold
                       file:bg-indigo-50 file:text-indigo-700
                       hover:file:bg-indigo-100"
            required
          />
           {file && <p className="text-xs text-gray-500 mt-1">Selected: {file.name}</p>}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading || isFetchingInitialData}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Create Report'}
          </button>
        </div>
      </form>
      
      {/* Feedback Messages for submission */}
      {successMessage && (
        <div className="p-4 mt-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
          <span className="font-medium">Success!</span> {successMessage}
        </div>
      )}
    </div>
  );
}

export default CreateMonthlyReport