
import { Patient, MoodEntry, Assessment, Alert } from './types';

export const PATIENTS: Patient[] = [
  { id: '1', name: 'Sarah Jenkins', age: 28, gender: 'Female', diagnosis: 'Major Depressive Disorder', lastSession: '2024-05-15', riskScore: 82, riskLevel: 'high' },
  { id: '2', name: 'Michael Chen', age: 34, gender: 'Male', diagnosis: 'Generalized Anxiety Disorder', lastSession: '2024-05-18', riskScore: 35, riskLevel: 'low' },
  { id: '3', name: 'Emma Wilson', age: 22, gender: 'Female', diagnosis: 'Bipolar II Disorder', lastSession: '2024-05-10', riskScore: 92, riskLevel: 'critical' },
  { id: '4', name: 'David Rodriguez', age: 45, gender: 'Male', diagnosis: 'PTSD', lastSession: '2024-05-12', riskScore: 58, riskLevel: 'moderate' },
  { id: '5', name: 'Linda Thompson', age: 51, gender: 'Female', diagnosis: 'Persistent Depressive Disorder', lastSession: '2024-05-19', riskScore: 22, riskLevel: 'low' },
  { id: '6', name: 'James Miller', age: 29, gender: 'Male', diagnosis: 'Social Anxiety Disorder', lastSession: '2024-05-14', riskScore: 41, riskLevel: 'moderate' },
  { id: '7', name: 'Sophia Garcia', age: 31, gender: 'Female', diagnosis: 'Borderline Personality Disorder', lastSession: '2024-05-20', riskScore: 76, riskLevel: 'high' },
  { id: '8', name: 'Robert Taylor', age: 40, gender: 'Male', diagnosis: 'Adjustment Disorder', lastSession: '2024-05-11', riskScore: 15, riskLevel: 'low' },
];

export const MOCK_MOOD_HISTORY: MoodEntry[] = Array.from({ length: 30 }).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toISOString().split('T')[0],
    actualScore: 4 + Math.random() * 4,
    predictedScore: null,
    sleepHours: 6 + Math.random() * 3,
    sleepQuality: 2 + Math.floor(Math.random() * 4),
    anxietyLevel: 1 + Math.floor(Math.random() * 5),
    activityLevel: 2000 + Math.floor(Math.random() * 8000),
    medicationTaken: Math.random() > 0.1,
  };
});

export const MOCK_ASSESSMENTS: Assessment[] = [
  { date: '2024-02-15', phq9: 18, gad7: 15 },
  { date: '2024-03-20', phq9: 14, gad7: 12 },
  { date: '2024-04-22', phq9: 12, gad7: 9 },
  { date: '2024-05-15', phq9: 15, gad7: 11 },
];

export const ALERTS: Alert[] = [
  { id: 'a1', patientId: '3', patientName: 'Emma Wilson', type: 'High Risk', severity: 'critical', timestamp: '2h ago', message: 'Crisis risk probability exceeded 90% threshold.' },
  { id: 'a2', patientId: '1', patientName: 'Sarah Jenkins', type: 'Trend Declining', severity: 'high', timestamp: '5h ago', message: '7-day predicted mood shows sharp decline (-2.4 points).' },
  { id: 'a3', patientId: '4', patientName: 'David Rodriguez', type: 'Missed Medication', severity: 'moderate', timestamp: '1d ago', message: 'Patient hasn\'t logged medication for 3 consecutive days.' },
];

export const MODEL_METRICS = {
  activeVersion: 'v2.4.0',
  lastRetrained: '2024-05-01',
  performance: [
    { date: 'Jan', mae: 1.2, accuracy: 72 },
    { date: 'Feb', mae: 1.1, accuracy: 74 },
    { date: 'Mar', mae: 0.95, accuracy: 77 },
    { date: 'Apr', mae: 0.88, accuracy: 79 },
    { date: 'May', mae: 0.82, accuracy: 81 },
  ],
  stats: {
    mae: 0.82,
    rmse: 1.15,
    r2: 0.78,
    auc: 0.86
  }
};