
import React, { useState } from 'react';
import { PATIENTS, ALERTS } from '../constants';
import { RiskBadge } from '../components/RiskBadge';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = PATIENTS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => b.riskScore - a.riskScore);

  const stats = [
    { label: 'Critical Risk', value: PATIENTS.filter(p => p.riskLevel === 'critical').length, color: 'text-red-600' },
    { label: 'High Risk', value: PATIENTS.filter(p => p.riskLevel === 'high').length, color: 'text-orange-600' },
    { label: 'Total Patients', value: PATIENTS.length, color: 'text-[#006aff]' },
    { label: 'Alerts (24h)', value: ALERTS.length, color: 'text-slate-600' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Therapist Dashboard</h1>
        <p className="text-slate-500">Predictive crisis detection & mood pattern analysis</p>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <span className="text-sm font-medium text-slate-500 mb-1">{stat.label}</span>
            <span className={`text-4xl font-bold ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Patient Risk List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">Patient Risk Rankings</h2>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search patients..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006aff] transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4 text-center">Risk Score</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Session</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPatients.map(patient => (
                  <tr key={patient.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#006aff] font-bold mr-3 text-xs">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{patient.name}</div>
                          <div className="text-xs text-slate-500">{patient.diagnosis}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-full max-w-[60px] bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${patient.riskScore > 70 ? 'bg-red-500' : patient.riskScore > 40 ? 'bg-orange-400' : 'bg-green-500'}`}
                            style={{ width: `${patient.riskScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-slate-700">{patient.riskScore}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <RiskBadge level={patient.riskLevel} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(patient.lastSession).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        to={`/patient/${patient.id}`}
                        className="text-[#006aff] hover:text-blue-800 font-bold text-sm"
                      >
                        View Analysis →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Alerts Panel */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">Critical Alerts</h2>
          <div className="space-y-3">
            {ALERTS.map(alert => (
              <div key={alert.id} className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-red-500 flex flex-col space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-red-600 uppercase tracking-tighter">{alert.type}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{alert.timestamp}</span>
                </div>
                <div className="font-bold text-slate-900">{alert.patientName}</div>
                <p className="text-sm text-slate-600 leading-snug">{alert.message}</p>
                <Link to={`/patient/${alert.patientId}`} className="text-xs text-[#006aff] hover:underline font-bold mt-1">Investigate Pattern</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
