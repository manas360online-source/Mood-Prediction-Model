
import React from 'react';
import { HashRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PatientDetail from './pages/PatientDetail';
import PatientList from './pages/PatientList';
import ModelMetrics from './pages/ModelMetrics';
import Settings from './pages/Settings';

const Sidebar: React.FC = () => {
  const navItems = [
    { label: 'Overview', path: '/', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { label: 'Patient List', path: '/patients', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { label: 'Model Metrics', path: '/metrics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { label: 'Settings', path: '/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];

  return (
    <aside className="w-64 fixed inset-y-0 left-0 bg-white border-r border-slate-200 p-6 hidden lg:block">
      <div className="flex items-center space-x-3 mb-10">
        <div className="w-10 h-10 bg-[#006aff] rounded-2xl flex items-center justify-center text-white font-black italic shadow-lg shadow-blue-200">M</div>
        <span className="text-xl font-bold tracking-tight text-slate-800">MANS360</span>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
              ${isActive ? 'bg-blue-50 text-[#006aff] shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
            `}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path></svg>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-10 left-6 right-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="flex items-center space-x-3">
          <img src="https://picsum.photos/seed/therapist/40" className="w-8 h-8 rounded-full border border-white shadow-sm" alt="User" />
          <div className="overflow-hidden">
            <div className="text-sm font-bold text-slate-800 truncate">Dr. Aris Thorne</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Senior Therapist</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex bg-[#f0f7ff]">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-6 lg:p-10 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<PatientList />} />
            <Route path="/patient/:id" element={<PatientDetail />} />
            <Route path="/metrics" element={<ModelMetrics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<div className="p-10 text-center text-slate-400 font-bold">404 - Page not found</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
