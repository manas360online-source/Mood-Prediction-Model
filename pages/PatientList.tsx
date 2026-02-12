
import React, { useState } from 'react';
import { PATIENTS } from '../constants';
import { RiskBadge } from '../components/RiskBadge';
import { Link } from 'react-router-dom';
import { Patient, RiskLevel } from '../types';

const PatientList: React.FC = () => {
  // Local state for patients to allow adding new ones during the session
  const [patients, setPatients] = useState<Patient[]>(PATIENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'moderate' | 'low'>('all');
  
  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: 'Female',
    diagnosis: ''
  });

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || p.riskLevel === filter;
    return matchesSearch && matchesFilter;
  });

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.name || !newPatient.diagnosis || !newPatient.age) return;

    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      const addedPatient: Patient = {
        id: (patients.length + 1).toString(),
        name: newPatient.name,
        age: parseInt(newPatient.age),
        gender: newPatient.gender,
        diagnosis: newPatient.diagnosis,
        lastSession: new Date().toISOString().split('T')[0],
        riskScore: Math.floor(Math.random() * 40), // Default new patients to lower risk
        riskLevel: 'low'
      };

      setPatients([addedPatient, ...patients]);
      setIsSaving(false);
      setIsAddModalOpen(false);
      setNewPatient({ name: '', age: '', gender: 'Female', diagnosis: '' });
    }, 800);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Patient Directory</h1>
          <p className="text-slate-500">Comprehensive list of all assigned patients and their current risk profiles.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-2.5 bg-[#006aff] text-white rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center active:scale-95"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Add New Patient
          </button>
        </div>
      </header>

      {/* Add Patient Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-fadeIn border border-blue-50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Register New Patient</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <form onSubmit={handleAddPatient} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-3 bg-[#f3faff] border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#006aff] transition-all"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Age</label>
                  <input 
                    required
                    type="number" 
                    placeholder="25"
                    className="w-full px-4 py-3 bg-[#f3faff] border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#006aff] transition-all"
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({...newPatient, age: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Gender</label>
                  <select 
                    className="w-full px-4 py-3 bg-[#f3faff] border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#006aff] transition-all appearance-none"
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({...newPatient, gender: e.target.value})}
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Primary Diagnosis</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Generalized Anxiety Disorder"
                  className="w-full px-4 py-3 bg-[#f3faff] border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#006aff] transition-all"
                  value={newPatient.diagnosis}
                  onChange={(e) => setNewPatient({...newPatient, diagnosis: e.target.value})}
                />
              </div>

              <div className="pt-4">
                <button 
                  disabled={isSaving}
                  type="submit"
                  className="w-full py-4 bg-[#006aff] text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center justify-center disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Creating Profile...
                    </>
                  ) : 'Register Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <input 
              type="text" 
              placeholder="Search by name or diagnosis..." 
              className="w-full pl-10 pr-4 py-3 bg-[#f3faff] border-none rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006aff] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="w-5 h-5 absolute left-3 top-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {(['all', 'critical', 'high', 'moderate', 'low'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap
                  ${filter === f ? 'bg-slate-900 text-white' : 'bg-blue-50 text-[#006aff] hover:bg-blue-100'}
                `}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-50">
              <tr>
                <th className="px-4 py-4">Patient Name</th>
                <th className="px-4 py-4">Diagnosis</th>
                <th className="px-4 py-4">Age / Gender</th>
                <th className="px-4 py-4">Risk Score</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Last Session</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPatients.map(patient => (
                <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#006aff] font-bold text-sm">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-bold text-slate-800">{patient.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">{patient.diagnosis}</td>
                  <td className="px-4 py-4 text-sm text-slate-500">{patient.age}y / {patient.gender[0]}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${patient.riskScore > 70 ? 'bg-red-500' : patient.riskScore > 40 ? 'bg-orange-400' : 'bg-green-500'}`}
                          style={{ width: `${patient.riskScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{patient.riskScore}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <RiskBadge level={patient.riskLevel} />
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {new Date(patient.lastSession).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link 
                      to={`/patient/${patient.id}`}
                      className="inline-flex items-center justify-center w-8 h-8 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-[#006aff] hover:border-blue-200 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPatients.length === 0 && (
            <div className="py-20 text-center space-y-2">
              <div className="text-slate-300">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <p className="text-slate-400 font-medium italic">No patients found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* Add missing default export for PatientList component */
export default PatientList;
