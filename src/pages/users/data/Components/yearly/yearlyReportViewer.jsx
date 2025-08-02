import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import apiService from '../../../../../services/api'

function YearlyReportViewer() {
    const { year, reportId } = useParams()
    const navigate = useNavigate()
    const [report, setReport] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [pdfError, setPdfError] = useState(false)

    const fetchReport = async () => {
        try {
            setLoading(true)
            setError('')
            setPdfError(false)

            const result = await apiService.getYearlyReport(reportId)

            console.log('Report API Response:', result)
            
            if (result.error) {
                setError(result.error)
                return
            }
            
            // Handle different response structures
            let reportData = null
            if (result.data) {
                if (result.data.data) {
                    reportData = result.data.data
                } else {
                    reportData = result.data
                }
            }
            
            if (!reportData) {
                setError('Report not found')
                return
            }
            
            setReport(reportData)
            
        } catch (err) {
            console.error('Error fetching report:', err)
            setError('មិនអាចទាញយកទិន្នន័យរបាយការណ៍បាន។ សូមព្យាយាមម្តងទៀត។')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (reportId) {
            fetchReport()
        }
    }, [reportId])

    const handlePdfError = () => {
        setPdfError(true)
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleDateString('km-KH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const formatFileSize = (bytes) => {
        if (!bytes) return 'N/A'
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }
    
    return(
        <div>
            <h2>Yearly Report Viewer</h2>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {pdfError && <p>Error loading PDF</p>}
            {report && (
                <div>
                    <h3>Report Details</h3>
                    <p><strong>Title:</strong> {report.title}</p>
                    <p><strong>Date:</strong> {formatDate(report.date)}</p>
                    <p><strong>File Size:</strong> {formatFileSize(report.fileSize)}</p>
                    <button onClick={handlePdfError}>View PDF</button>
                </div>
            )}
        </div>
    )
    
}
export default YearlyReportViewer