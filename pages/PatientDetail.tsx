
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PATIENTS, MOCK_MOOD_HISTORY, MOCK_ASSESSMENTS } from '../constants';
import { RiskBadge } from '../components/RiskBadge';
import { MoodChart } from '../components/MoodChart';
import { FeatureImportance } from '../components/FeatureImportance';
import { mockApiService } from '../services/mockApiService';
import { Prediction } from '../types';
import { GoogleGenAI } from "@google/genai";

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartMode, setChartMode] = useState<'mood' | 'sleep' | 'activity'>('mood');
  
  // Interactive States
  const [isInterventionScheduled, setIsInterventionScheduled] = useState(false);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isTipSending, setIsTipSending] = useState(false);
  const [lastSentTip, setLastSentTip] = useState<string | null>(null);

  const patient = PATIENTS.find(p => p.id === id);

  useEffect(() => {
    if (id) {
      mockApiService.getPrediction(id).then(res => {
        setPrediction(res);
        setLoading(false);
      });
    }
  }, [id]);

  const handleScheduleIntervention = () => {
    setIsInterventionScheduled(true);
    setTimeout(() => setIsInterventionScheduled(false), 3000);
  };

  const handleSaveNote = () => {
    setIsSavingNote(true);
    setTimeout(() => {
      setIsSavingNote(false);
      setShowNoteEditor(false);
      setNoteText('');
      // In a real app, we'd persist this to a list of notes
    }, 1000);
  };

  const handleSendTip = async () => {
    if (!patient || !prediction) return;
    setIsTipSending(true);
    try {
      /* Initialize GoogleGenAI with exactly the required parameters and simplify text generation prompt */
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a supportive therapist. Generate a personalized, actionable mental health tip for ${patient.name} who has ${patient.diagnosis}. Their current mood trend is ${prediction.moodTrend} and their crisis risk score is ${prediction.riskScore}%. Keep it under 25 words and very encouraging.`
      });
      const tip = response.text || "Try a 5-minute grounding exercise: name 5 things you see and 4 things you can touch.";
      setLastSentTip(tip);
      setTimeout(() => setLastSentTip(null), 5000);
    } catch (err) {
      console.error(err);
      setLastSentTip("Tip sent: Remember to take deep breaths throughout your day.");
      setTimeout(() => setLastSentTip(null), 5000);
    } finally {
      setIsTipSending(false);
    }
  };

  if (!patient) return <div className="p-10 text-center text-slate-500 font-bold">Patient not found</div>;

  return (
    <div className="space-y-8 animate-fadeIn pb-12 relative">
      {/* Toast Notifications */}
      {isInterventionScheduled && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl animate-bounce flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          <span className="font-bold">Intervention scheduled for tomorrow 9:00 AM</span>
        </div>
      )}

      {lastSentTip && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#006aff] text-white p-6 rounded-3xl shadow-2xl animate-slideUp max-w-sm border border-blue-400">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-black uppercase tracking-widest text-blue-200">Tip Sent to {patient.name}</span>
            <button onClick={() => setLastSentTip(null)} className="text-blue-200 hover:text-white">&times;</button>
          </div>
          <p className="text-sm font-medium italic">"{lastSentTip}"</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/patients" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{patient.name}</h1>
            <p className="text-slate-500">{patient.gender}, {patient.age}y • {patient.diagnosis}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleScheduleIntervention}
            className="px-6 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            Schedule Intervention
          </button>
          <button 
            onClick={() => setShowNoteEditor(true)}
            className="px-6 py-2.5 bg-[#006aff] text-white rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            Add Session Note
          </button>
        </div>
      </div>

      {showNoteEditor && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 animate-fadeIn">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Add Clinical Note</h3>
            <textarea 
              autoFocus
              className="w-full h-40 p-4 bg-[#f3faff] rounded-2xl border-none focus:ring-2 focus:ring-[#006aff] text-slate-700 text-sm mb-6"
              placeholder="Start typing session notes here..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowNoteEditor(false)}
                className="px-6 py-2 text-slate-500 font-bold hover:text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveNote}
                disabled={!noteText.trim() || isSavingNote}
                className="px-8 py-2 bg-[#006aff] text-white rounded-full font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center"
              >
                {isSavingNote ? (
                  <svg className="animate-spin h-4 w-4 mr-2 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : 'Save Note'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="text-center">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Crisis Risk Score</div>
              <div className={`text-6xl font-black ${patient.riskScore > 70 ? 'text-red-600' : 'text-[#006aff]'}`}>
                {patient.riskScore}%
              </div>
              <div className="mt-4">
                <RiskBadge level={patient.riskLevel} />
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800">Forecast Summary (7-14 Days)</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Trend</span>
                <span className={`text-sm font-bold flex items-center ${prediction?.moodTrend === 'declining' ? 'text-red-600' : 'text-green-600'}`}>
                  {prediction?.moodTrend.toUpperCase()}
                  {prediction?.moodTrend === 'declining' ? (
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
                  ) : (
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">ML Confidence</span>
                <span className="text-sm font-bold text-slate-700">{prediction?.confidenceScore.toFixed(0)}%</span>
              </div>
            </div>

            <hr className="border-slate-100" />

            {prediction && <FeatureImportance data={prediction.featureImportance} />}
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg space-y-4">
            <h3 className="font-bold">Therapeutic Advice</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Based on the detected trend, patient shows increased evening anxiety markers. Recommend cognitive reframing exercises specifically for evening routine.
            </p>
            <button 
              onClick={handleSendTip}
              disabled={isTipSending}
              className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all flex items-center justify-center"
            >
              {isTipSending ? (
                <svg className="animate-spin h-3 w-3 mr-2 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : 'Send Patient Tip'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Tracking History</h2>
                <p className="text-sm text-slate-500">Last 30 days data insights</p>
              </div>
              <div className="flex bg-[#f3faff] p-1 rounded-xl">
                {[
                  { id: 'mood', label: 'Mood' },
                  { id: 'sleep', label: 'Sleep' },
                  { id: 'activity', label: 'Activity' }
                ].map((m) => (
                  <button 
                    key={m.id}
                    onClick={() => setChartMode(m.id as any)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${chartMode === m.id ? 'bg-white shadow-sm text-[#006aff]' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            {prediction && <MoodChart history={MOCK_MOOD_HISTORY} forecastMood={prediction.predictedMood} mode={chartMode} />}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Contributing Factors</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-green-600 uppercase">Protective Factors</span>
                  <div className="flex flex-wrap gap-2">
                    {prediction?.contributingFactors.positive.map(f => (
                      <span key={f} className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium border border-green-100">{f}</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-red-600 uppercase">Risk Factors</span>
                  <div className="flex flex-wrap gap-2">
                    {prediction?.contributingFactors.negative.map(f => (
                      <span key={f} className="px-3 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-medium border border-red-100">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Clinical Assessments</h3>
              <div className="space-y-4">
                {MOCK_ASSESSMENTS.map((a, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <div>
                      <div className="text-sm font-bold text-slate-700">{new Date(a.date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</div>
                      <div className="text-[10px] text-slate-400 font-medium">Standard Assessment</div>
                    </div>
                    <div className="flex space-x-3">
                      <div className="text-center">
                        <div className="text-[10px] uppercase font-bold text-slate-400">PHQ-9</div>
                        <div className={`text-sm font-black ${a.phq9 > 15 ? 'text-red-500' : 'text-slate-700'}`}>{a.phq9}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] uppercase font-bold text-slate-400">GAD-7</div>
                        <div className={`text-sm font-black ${a.gad7 > 15 ? 'text-red-500' : 'text-slate-700'}`}>{a.gad7}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
