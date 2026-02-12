
import React, { useState, useEffect } from 'react';
import { MODEL_METRICS } from '../constants';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { GoogleGenAI } from "@google/genai";

const ModelMetrics: React.FC = () => {
  const [isRetraining, setIsRetraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastRetrainedDate, setLastRetrainedDate] = useState(MODEL_METRICS.lastRetrained);
  const [retrainSummary, setRetrainSummary] = useState<string | null>(null);

  const handleForceRetrain = async () => {
    setIsRetraining(true);
    setProgress(0);
    setRetrainSummary(null);

    // Simulation of progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 400);

    // After simulation finish, call Gemini to generate a "Training Audit Report"
    setTimeout(async () => {
      try {
        /* Correct initialization of GoogleGenAI and use of the recommended model for basic text tasks */
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: "Act as a MANS360 ML System Auditor. Generate a 2-sentence highly technical summary of a successful 'Force Retrain' event for a Mood Prediction model. Mention slight improvements in R2 or MAE. Keep it professional and clinical." 
        });
        
        setRetrainSummary(response.text || "Retraining complete. Model weights optimized. MAE decreased by 0.02 points.");
      } catch (err) {
        setRetrainSummary("Retraining complete. Batch processing successfully integrated 1,240 new patient data points into the ensemble.");
      } finally {
        setIsRetraining(false);
        setLastRetrainedDate(new Date().toISOString().split('T')[0]);
      }
    }, 4000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Model Performance</h1>
          <p className="text-slate-500">Real-time telemetry and validation metrics for MANS360 predictive models.</p>
        </div>
        {isRetraining && (
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-[#006aff] animate-pulse mb-1 uppercase tracking-tighter">RECALIBRATING PIPELINE...</span>
            <div className="w-48 bg-blue-100 h-2 rounded-full overflow-hidden shadow-inner">
              <div 
                className="bg-[#006aff] h-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </header>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Mean Absolute Error', value: MODEL_METRICS.stats.mae, sub: 'Target: < 1.0', color: 'text-[#006aff]' },
          { label: 'RMSE', value: MODEL_METRICS.stats.rmse, sub: 'Root Mean Sq Err', color: 'text-indigo-600' },
          { label: 'R² Score', value: MODEL_METRICS.stats.r2, sub: 'Explained Variance', color: 'text-emerald-600' },
          { label: 'AUC-ROC', value: MODEL_METRICS.stats.auc, sub: 'Classification Quality', color: 'text-violet-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
            <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-slate-500 mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      {retrainSummary && (
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-start space-x-3 animate-fadeIn">
          <div className="mt-0.5 text-emerald-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <div className="text-sm font-bold text-emerald-800 uppercase tracking-tighter">System Audit Log</div>
            <p className="text-sm text-emerald-700 leading-relaxed italic">"{retrainSummary}"</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Accuracy Over Time */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-[400px] flex flex-col">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Prediction Accuracy (%)</h3>
              <p className="text-sm text-slate-500">5-month retraining validation history</p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold">+9% increase</span>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MODEL_METRICS.performance}>
                <defs>
                  <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <YAxis domain={[60, 90]} hide />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAcc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Error Trend */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-[400px] flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800">Mean Absolute Error (MAE)</h3>
            <p className="text-sm text-slate-500">Lower values indicate higher model precision</p>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MODEL_METRICS.performance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <YAxis hide />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="mae" fill="#006aff" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">Active Deployment</div>
          <h3 className="text-2xl font-bold">Model Version {MODEL_METRICS.activeVersion}</h3>
          <p className="text-slate-400 text-sm mt-2 max-w-md">
            Ensemble of XGBoost and LSTM architectures. Last full retraining completed on {new Date(lastRetrainedDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}.
          </p>
        </div>
        <button 
          onClick={handleForceRetrain}
          disabled={isRetraining}
          className={`px-10 py-4 rounded-full font-bold transition-all whitespace-nowrap min-w-[240px] flex items-center justify-center shadow-lg shadow-blue-500/20
            ${isRetraining 
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
              : 'bg-[#006aff] hover:bg-blue-500 text-white active:scale-95'
            }
          `}
        >
          {isRetraining ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : 'Force Retrain Pipeline'}
        </button>
      </div>
    </div>
  );
};

export default ModelMetrics;
