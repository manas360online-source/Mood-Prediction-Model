
import React from 'react';

interface FeatureImportanceProps {
  data: Record<string, number>;
}

export const FeatureImportance: React.FC<FeatureImportanceProps> = ({ data }) => {
  // Fix: Explicitly cast values to number for sorting operation to satisfy TypeScript arithmetic requirements
  const sortedFeatures = Object.entries(data).sort((a, b) => (b[1] as number) - (a[1] as number));

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Predictor Influence (SHAP)</h4>
      <div className="space-y-3">
        {sortedFeatures.map(([feature, importance]) => (
          <div key={feature} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-slate-700">{feature}</span>
              {/* Fix: Explicitly cast importance to number for calculation */}
              <span className="text-slate-500">{((importance as number) * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                // Fix: Explicitly cast importance to number for width percentage calculation
                style={{ width: `${(importance as number) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
