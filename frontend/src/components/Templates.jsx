import { useState } from 'react';
import { motion } from 'framer-motion';

const Templates = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const templates = [
    {
      id: 1,
      name: "Modern Professional",
      description: "Clean and modern design with professional layout",
      tags: ["professional", "modern", "clean"],
      file: "/templates/modern-professional.docx",
      preview: "/templates/modern-professional-preview.png"
    },
    {
      id: 2,
      name: "Technical Engineering",
      description: "Technical resume template with emphasis on projects and skills",
      tags: ["technical", "engineering", "projects"],
      file: "/templates/technical-engineering.docx",
      preview: "/templates/technical-engineering-preview.png"
    },
    {
      id: 3,
      name: "Creative Design",
      description: "Visually appealing template for creative professionals",
      tags: ["creative", "design", "portfolio"],
      file: "/templates/creative-design.docx",
      preview: "/templates/creative-design-preview.png"
    }
  ];

  const handleDownload = async (fileUrl) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error('Failed to download template');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileUrl.split('/').pop();
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message || 'Failed to download template');
      console.error('Download error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-4">Resume Templates</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <motion.div 
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-lg shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
              <button 
                onClick={() => handleDownload(template.preview)}
                className="text-blue-600 hover:text-blue-800"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Preview'}
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">{template.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {template.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <button 
              onClick={() => handleDownload(template.file)}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Downloading...' : 'Download Template'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Templates;
