
import { Prediction, Patient, MoodTrend, RiskLevel } from '../types';
import { PATIENTS } from '../constants';

export const mockApiService = {
  getPrediction: async (patientId: string): Promise<Prediction> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const patient = PATIENTS.find(p => p.id === patientId);
    const riskScore = patient?.riskScore || Math.random() * 100;
    
    let trend: MoodTrend = 'stable';
    if (riskScore > 70) trend = 'declining';
    else if (riskScore < 30) trend = 'improving';

    let level: RiskLevel = 'low';
    if (riskScore >= 85) level = 'critical';
    else if (riskScore >= 70) level = 'high';
    else if (riskScore >= 50) level = 'moderate';

    return {
      userId: patientId,
      predictionDate: new Date().toISOString(),
      predictedMood: 4 + Math.random() * 3,
      currentMood: 5 + Math.random() * 2,
      moodTrend: trend,
      // Fix: Removed 'crisis_risk_score' which is not defined in the Prediction type
      crisisRiskScore: riskScore,
      riskLevel: level,
      confidenceScore: 75 + Math.random() * 20,
      contributingFactors: {
        positive: ['Regular Exercise', 'Social Engagement', 'Therapy Attendance'],
        negative: ['Sleep Deprivation', 'Medication Non-adherence', 'High Stress Markers']
      },
      featureImportance: {
        'Mood Volatility': 0.35,
        'Sleep Quality': 0.25,
        'PHQ-9 Change': 0.20,
        'Medication Adherence': 0.15,
        'Social Interaction': 0.05
      }
    };
  }
};
