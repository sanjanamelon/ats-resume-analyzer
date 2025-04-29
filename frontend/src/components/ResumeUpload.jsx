import { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Tab } from '@headlessui/react'
import api, { checkBackendStatus, getBackendStatusMessage } from '../config/api'

const ResumeUpload = ({ onAnalysisComplete }) => {
  const [jobDescription, setJobDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [backendStatus, setBackendStatus] = useState(null)
  const [backendMessage, setBackendMessage] = useState('')
  const [analysisId, setAnalysisId] = useState(null)

  // Check backend status on mount and periodically
  useEffect(() => {
    const checkStatus = async () => {
      const status = await checkBackendStatus();
      const message = await getBackendStatusMessage();
      setBackendStatus(status);
      setBackendMessage(message.message);
      if (!status) {
        setError(message.message);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      if (file.size > 5000000) {
        setError('File size should be less than 5MB')
        return
      }
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        setError('Please upload a PDF file')
        return
      }
      setSelectedFile(file)
      setError('')
      setSuccess('')
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!backendStatus) {
      setError('Backend server is not running. Please start the Django development server with:\n\npython manage.py runserver 8000\n\nMake sure you are in the backend directory when running this command.')
      return
    }

    if (!selectedFile || !jobDescription.trim()) {
      setError('Please select a resume file and enter a job description')
      return
    }

    setUploading(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('job_description', jobDescription)

      const response = await api.post('/api/resumes/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      const data = response.data
      onAnalysisComplete(data.id)
      setAnalysisId(data.id)
      setSelectedFile(null)
      setJobDescription('')
      setSuccess('Resume uploaded successfully!')
    } catch (err) {
      setError(err.message || 'An error occurred while uploading the resume')
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Upload Your Resume</h2>
            <p className="mt-1 text-sm text-gray-500">
              Upload your resume and enter a job description to analyze your ATS compatibility
            </p>
          </div>

          <div className="mb-4">
            <div className={`px-4 py-3 rounded-md ${
              backendStatus ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className={`h-5 w-5 ${
                    backendStatus ? 'text-green-400' : 'text-red-400'
                  }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {backendStatus ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    )}
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">{backendMessage}</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">
                Job Description
              </label>
              <div className="mt-1">
                <textarea
                  id="jobDescription"
                  name="jobDescription"
                  rows={4}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Enter job description here..."
                  disabled={!backendStatus}
                />
              </div>
            </div>

            <div {...getRootProps()} className="mt-4">
              <input {...getInputProps()} disabled={!backendStatus} />
              <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
              }`}>
                <div className="space-y-2">
                  <p className={`text-gray-600 ${isDragActive ? 'text-indigo-600' : ''}`}>
                    {isDragActive ? 'Drop the file here...' : 'Drag and drop a PDF file here, or click to select'}
                  </p>
                  {selectedFile && (
                    <p className="text-sm text-gray-500 mt-2">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="submit"
                disabled={uploading || !selectedFile || !jobDescription.trim() || !backendStatus}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload & Analyze'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg">
              {success}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default ResumeUpload
