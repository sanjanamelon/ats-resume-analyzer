import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import api from '../config/api';

const HRDashboard = () => {
  const [files, setFiles] = useState([]);
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResults, setAnalysisResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);

  const onDrop = (acceptedFiles) => {
    // Validate file types
    const validFiles = acceptedFiles.filter(file => 
      file.type === 'application/pdf' || 
      file.type === 'application/msword' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    
    setFiles(prev => [...prev, ...validFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: true
  });

  const handleSingleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (file.type === 'application/pdf' ||
          file.type === 'application/msword' ||
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFiles(prev => [...prev, file]);
      } else {
        setError('Invalid file format. Please upload PDF or DOCX files only.');
      }
    }
  };

  const handleJobDescriptionChange = (e) => {
    setJobDescription(e.target.value);
  };

  const handleAnalysis = async () => {
    if (!files.length) {
      setError('Please upload at least one resume');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please provide a job description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append('resumes', file);
      });
      formData.append('job_description', jobDescription);

      const response = await api.post('hr/analyze/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setAnalysisResults(response.data.results);
      setShowResults(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFiles([]);
    setJobDescription('');
    setAnalysisResults([]);
    setShowResults(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Resume Upload</h2>
        <div className="space-y-4">
          <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-all duration-300">
            <input {...getInputProps()} />
            <div className={`space-y-2 ${isDragActive ? 'border-blue-500 bg-blue-50' : ''}`}>
              <div className="text-gray-600">
                {isDragActive ? (
                  <p className="text-blue-600">Drop the files here...</p>
                ) : (
                  <>
                    <p>Drag and drop multiple resumes here, or click to select files</p>
                    <p className="text-sm text-gray-500">Supported formats: PDF, DOCX</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or upload individual resume:
            </label>
            <input
              type="file"
              onChange={handleSingleFileUpload}
              accept=".pdf,.doc,.docx"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <h3 className="text-sm font-medium text-gray-700">Selected Files:</h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      onClick={() => {
                        setFiles(prev => prev.filter((_, i) => i !== index));
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Job Description</h2>
        <div className="space-y-4">
          <textarea
            value={jobDescription}
            onChange={handleJobDescriptionChange}
            placeholder="Enter or paste job description here..."
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-4"
      >
        <button
          onClick={handleAnalysis}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze Resumes'}
        </button>
        <button
          onClick={handleClear}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Clear
        </button>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      {showResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Top 10 Candidates</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md">
                Sort by ATS Score
              </button>
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md">
                Sort by Skill Match
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {analysisResults.slice(0, 10).map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 p-4 rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">Candidate {index + 1}</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">ATS Score:</span>
                        <span className="font-medium">{result.ats_score}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Keyword Match:</span>
                        <span className="font-medium">{result.keyword_match}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Skill Match:</span>
                        <span className="font-medium">{result.skill_match}%</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Resume Suggestions:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {result.suggestions.map((suggestion, i) => (
                          <li key={i}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="w-32 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: `${result.ats_score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HRDashboard;
