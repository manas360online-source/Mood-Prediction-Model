
import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [thresholds, setThresholds] = useState({
    email: 70,
    sms: 85,
    inApp: 50
  });

  const [notifications, setNotifications] = useState({
    dailyDigest: true,
    weeklyReport: true,
    crisisAlerts: true
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">Configure alert thresholds, communication channels, and account details.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Thresholds Section */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <svg className="w-5 h-5 mr-2 text-[#006aff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              Predictive Alert Thresholds
            </h3>
            <p className="text-sm text-slate-500">Set the risk percentage that triggers automatic therapist notifications.</p>
            
            <div className="space-y-8">
              {[
                { key: 'inApp', label: 'In-App Notification', color: 'bg-yellow-500', desc: 'Alerts shown within the dashboard portal.' },
                { key: 'email', label: 'Email Alert', color: 'bg-orange-500', desc: 'Standard proactive check-in notification.' },
                { key: 'sms', label: 'SMS / Urgent Alert', color: 'bg-red-500', desc: 'Immediate mobile alert for critical risk levels.' },
              ].map((item) => (
                <div key={item.key} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="font-bold text-slate-700">{item.label}</div>
                      <div className="text-xs text-slate-400">{item.desc}</div>
                    </div>
                    <span className="text-xl font-black text-slate-900">{(thresholds as any)[item.key]}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    value={(thresholds as any)[item.key]} 
                    onChange={(e) => setThresholds({...thresholds, [item.key]: parseInt(e.target.value)})}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#006aff]"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Preferences Section */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <svg className="w-5 h-5 mr-2 text-[#006aff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              Report Preferences
            </h3>
            <div className="divide-y divide-slate-50">
              {[
                { key: 'dailyDigest', label: 'Daily Risk Digest', desc: 'Consolidated email of all at-risk patients every morning at 8:00 AM.' },
                { key: 'weeklyReport', label: 'Weekly Trend Report', desc: 'Aggregate analysis of patient population improvement/decline trends.' },
                { key: 'crisisAlerts', label: 'Real-time Crisis Alerts', desc: 'Immediate notification if any patient reaches a critical risk score.' },
              ].map((item) => (
                <div key={item.key} className="py-4 flex items-center justify-between">
                  <div className="max-w-md">
                    <div className="font-bold text-slate-700">{item.label}</div>
                    <div className="text-sm text-slate-500">{item.desc}</div>
                  </div>
                  <button 
                    onClick={() => setNotifications({...notifications, [item.key]: !(notifications as any)[item.key]})}
                    className={`w-12 h-6 rounded-full transition-all relative ${ (notifications as any)[item.key] ? 'bg-[#006aff]' : 'bg-slate-200' }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${ (notifications as any)[item.key] ? 'left-7' : 'left-1' }`} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-8">
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6 text-center">
            <div className="w-24 h-24 bg-blue-50 rounded-full mx-auto flex items-center justify-center border-4 border-white shadow-md">
              <span className="text-3xl font-black text-[#006aff]">AT</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Dr. Aris Thorne</h3>
              <p className="text-sm text-slate-500 font-medium italic">Clinical Psychologist</p>
            </div>
            <button className="w-full py-3.5 bg-[#006aff] text-white rounded-full font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95">
              Update Profile
            </button>
          </section>

          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="font-bold text-slate-800">Privacy & Ethics</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your model operates on anonymized patient UUIDs. No Personal Identifiable Information (PII) is stored in training artifacts or model weights. All predictions are logged for clinical audit.
            </p>
            <div className="flex items-center text-[#006aff] font-bold text-xs space-x-1 cursor-pointer hover:underline">
              <span>View Data Ethics Policy</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default Settings;
