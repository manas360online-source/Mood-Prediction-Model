
export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';
export type MoodTrend = 'improving' | 'declining' | 'stable';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  diagnosis: string;
  lastSession: string;
  riskScore: number;
  riskLevel: RiskLevel;
}

export interface MoodEntry {
  date: string;
  actualScore: number | null;
  predictedScore: number | null;
  sleepHours: number;
  sleepQuality: number;
  anxietyLevel: number;
  activityLevel: number;
  medicationTaken: boolean;
}

export interface Assessment {
  date: string;
  phq9: number;
  gad7: number;
}

export interface Prediction {
  userId: string;
  predictionDate: string;
  predictedMood: number;
  currentMood: number;
  moodTrend: MoodTrend;
  crisisRiskScore: number;
  riskLevel: RiskLevel;
  confidenceScore: number;
  contributingFactors: {
    positive: string[];
    negative: string[];
  };
  featureImportance: Record<string, number>;
}

export interface Alert {
  id: string;
  patientId: string;
  patientName: string;
  type: string;
  severity: RiskLevel;
  timestamp: string;
  message: string;
}