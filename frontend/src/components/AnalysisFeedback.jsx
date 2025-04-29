import { Tab } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../config/api';

const AnalysisFeedback = ({ analysisId }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalysis = async (analysisId) => {
    if (!analysisId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`resumes/${analysisId}/analysis/`);
      setAnalysis(response.data);
    } catch (error) {
      console.error('Error fetching analysis:', error);
      setError(error.message || 'Failed to fetch analysis results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis(analysisId);
  }, [analysisId]);

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Analysis Error</h2>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Please try uploading your resume again or contact support if the issue persists.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold mb-4">Loading Analysis...</h2>
        <div className="animate-pulse space-y-6">
          <div className="bg-gray-200 rounded-lg h-64"></div>
          <div className="bg-gray-200 rounded-lg h-64"></div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">No Analysis Available</h2>
        <div className="text-gray-500">
          Please upload a resume to get started with the analysis.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analysis Feedback</h2>
          <p className="mt-1 text-sm text-gray-500">
            Get detailed insights about your resume's ATS compatibility
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ATS Score */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="card"
            >
              <h3 className="text-lg font-semibold mb-4">Overall ATS Score</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-full">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${analysis.analysis.ats_score.score}%` }}
                      />
                    </div>
                  </div>
                  <span className="ml-2 text-sm font-semibold text-gray-700">
                    {analysis.analysis.ats_score.score}%
                  </span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-600">Rating:</h4>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      analysis.analysis.ats_score.rating === 'Good' ? 'bg-green-500' :
                      analysis.analysis.ats_score.rating === 'Fair' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}>
                    </div>
                    <span className="text-sm text-gray-700">
                      {analysis.analysis.ats_score.rating}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Missing Keywords */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="card"
            >
              <h3 className="text-lg font-semibold mb-4">Missing Keywords</h3>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Add these keywords to improve your ATS score:
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysis.analysis.missing_keywords.map((keyword, index) => (
                    <span 
                      key={index}
                      className="tag tag-secondary"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Suggestions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="card col-span-2"
            >
              <h3 className="text-lg font-semibold mb-4">Suggestions for Improvement</h3>
              <ul className="space-y-2">
                {analysis.analysis.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-700">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Keyword Match Analysis */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="card"
            >
              <h3 className="text-lg font-semibold mb-4">Keyword Match Analysis</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-full">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${analysis.analysis.keyword_match.score}%` }}
                      />
                    </div>
                  </div>
                  <span className="ml-2 text-sm font-semibold text-gray-700">
                    {analysis.analysis.keyword_match.score}%
                  </span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-600">Matched Keywords:</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.analysis.keyword_match.matched_keywords.map((keyword, index) => (
                      <span 
                        key={index}
                        className="tag tag-primary"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Semantic Similarity */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="card"
            >
              <h3 className="text-lg font-semibold mb-4">Semantic Similarity</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-full">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${analysis.analysis.semantic_similarity.score}%` }}
                      />
                    </div>
                  </div>
                  <span className="ml-2 text-sm font-semibold text-gray-700">
                    {analysis.analysis.semantic_similarity.score}%
                  </span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-600">Similarity Score:</h4>
                  <p className="text-gray-600">
                    Your resume has a semantic similarity score of {analysis.analysis.semantic_similarity.score}%
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalysisFeedback;
