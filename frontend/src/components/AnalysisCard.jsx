import { useState, useEffect } from 'react';

export default function AnalysisCard({ title, metrics, className = '' }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`analysis-card ${className}`}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-3">
        {metrics.map((metric, index) => (
          <div key={index} className="analysis-metric">
            <div className="flex-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</span>
              <p className="text-lg font-medium">{metric.value}</p>
            </div>
            {metric.progress && (
              <div className="w-full">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${metric.progress}%` }}></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
