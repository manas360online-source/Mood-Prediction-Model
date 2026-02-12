
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, AreaChart, Area
} from 'recharts';
import { MoodEntry } from '../types';

interface MoodChartProps {
  history: MoodEntry[];
  forecastMood: number;
  mode: 'mood' | 'sleep' | 'activity';
}

export const MoodChart: React.FC<MoodChartProps> = ({ history, forecastMood, mode }) => {
  // Combine history with a mocked forecast point
  const lastDate = new Date(history[history.length - 1].date);
  
  const getVal = (h: MoodEntry) => {
    switch (mode) {
      case 'mood': return h.actualScore;
      case 'sleep': return h.sleepHours;
      case 'activity': return h.activityLevel;
      default: return h.actualScore;
    }
  };

  const getLabel = () => {
    switch (mode) {
      case 'mood': return 'Mood Score';
      case 'sleep': return 'Hours Slept';
      case 'activity': return 'Step Count';
      default: return 'Value';
    }
  };

  const getColor = () => {
    switch (mode) {
      case 'mood': return '#3b82f6';
      case 'sleep': return '#818cf8';
      case 'activity': return '#10b981';
      default: return '#3b82f6';
    }
  };

  const getDomain = (): [number, number] => {
    switch (mode) {
      case 'mood': return [0, 10];
      case 'sleep': return [0, 15];
      case 'activity': return [0, 12000];
      default: return [0, 10];
    }
  };

  const lastValue = getVal(history[history.length - 1]);

  const forecastData = Array.from({ length: 8 }).map((_, i) => {
    const d = new Date(lastDate);
    d.setDate(d.getDate() + i);
    
    let forecastVal = null;
    if (mode === 'mood') {
      forecastVal = i === 0 ? lastValue : (lastValue! + ((forecastMood - lastValue!) * (i / 7)));
    }

    return {
      date: d.toISOString().split('T')[0],
      value: i === 0 ? lastValue : null,
      forecast: forecastVal
    };
  });

  const chartData = [
    ...history.map(h => ({ date: h.date, value: getVal(h), forecast: null })),
    ...forecastData.slice(1)
  ];

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#94a3b8' }} 
            tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            domain={getDomain()} 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#94a3b8' }} 
          />
          <Tooltip 
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: '600', paddingTop: '20px' }} />
          <Line 
            name={getLabel()} 
            type="monotone" 
            dataKey="value" 
            stroke={getColor()} 
            strokeWidth={3} 
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
          {mode === 'mood' && (
            <Line 
              name="Mood Forecast" 
              type="monotone" 
              dataKey="forecast" 
              stroke={getColor()} 
              strokeWidth={3} 
              strokeDasharray="6 6"
              dot={false}
            />
          )}
          {mode === 'mood' && <ReferenceLine y={3} label={{ value: 'Critical', fill: '#ef4444', fontSize: 10, position: 'insideBottomRight' }} stroke="#ef4444" strokeDasharray="3 3" />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};