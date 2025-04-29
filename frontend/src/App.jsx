import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, UNSAFE_DataRouterContext } from 'react-router-dom';
import { Tab } from '@headlessui/react';
import { motion } from 'framer-motion';

// Components
import ResumeUpload from './components/ResumeUpload';
import AnalysisFeedback from './components/AnalysisFeedback';
import Templates from './components/Templates';
import HRDashboard from './components/HRDashboard';
import DarkModeToggle from './components/DarkModeToggle';
import AnalysisCard from './components/AnalysisCard';

function App() {
  const [analysisId, setAnalysisId] = useState(null);
  const [isDark, setIsDark] = useState(false);

  const sampleMetrics = [
    { label: 'Overall Score', value: '85/100', progress: 85 },
    { label: 'Formatting', value: '90/100', progress: 90 },
    { label: 'Keywords', value: '80/100', progress: 80 }
  ];

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className={`min-h-screen ${isDark ? 'dark' : ''} bg-background`}>
        <nav className="bg-surface shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-primary">ATS Resume Analyzer</h1>
              </div>
              <div className="flex justify-between items-center">
                <DarkModeToggle onToggle={setIsDark} />
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-surface rounded-2xl shadow-lg p-8">
            <Tab.Group>
              <Tab.List className="flex space-x-1 rounded-xl bg-gray-50 p-1">
                <Tab className="w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2">
                  Resume Upload
                </Tab>
                <Tab className="w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2">
                  Analysis Feedback
                </Tab>
                <Tab className="w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2">
                  Templates
                </Tab>
                <Tab className="w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2">
                  HR Dashboard
                </Tab>
              </Tab.List>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                <Tab.Panels>
                  <Tab.Panel>
                    <ResumeUpload onAnalysisComplete={(id) => setAnalysisId(id)} />
                  </Tab.Panel>
                  <Tab.Panel>
                    <AnalysisFeedback analysisId={analysisId} />
                  </Tab.Panel>
                  <Tab.Panel>
                    <Templates />
                  </Tab.Panel>
                  <Tab.Panel>
                    <HRDashboard />
                  </Tab.Panel>
                </Tab.Panels>
              </motion.div>
            </Tab.Group>
          </div>

          <div className="max-w-4xl mx-auto mt-8">
            <AnalysisCard
              title="Analysis Results"
              metrics={sampleMetrics}
              className="animate-glass-fade"
            />
            
            <AnalysisCard
              title="Skills Analysis"
              metrics={[
                { label: 'Technical Skills', value: '15/20', progress: 75 },
                { label: 'Soft Skills', value: '12/15', progress: 80 },
                { label: 'Tools & Technologies', value: '10/12', progress: 83 }
              ]}
              className="animate-glass-fade"
            />
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
