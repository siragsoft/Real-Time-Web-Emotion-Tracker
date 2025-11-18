
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { EmotionData, EmotionType } from '../types';
import { EmotionTypes } from '../types';

interface AnalyticsModalProps {
  emotionHistory: EmotionData[];
  onClose: () => void;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ emotionHistory, onClose }) => {
  const emotionCounts = useMemo(() => {
    const counts: Record<EmotionType, number> = {
      happiness: 0,
      sadness: 0,
      surprise: 0,
      anger: 0,
      neutral: 0,
      none: 0,
    };
    emotionHistory.forEach(e => {
      if (counts[e.emotion] !== undefined) {
        counts[e.emotion]++;
      }
    });
    return EmotionTypes.filter(type => type !== 'none').map(emotion => ({
      name: emotion.charAt(0).toUpperCase() + emotion.slice(1),
      count: counts[emotion],
    }));
  }, [emotionHistory]);
  
  const totalEmotions = emotionHistory.filter(e => e.emotion !== 'none').length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-2xl p-6 md:p-8 max-w-3xl w-full text-white transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Emotion Analytics</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
        </div>

        {totalEmotions > 0 ? (
          <>
            <p className="text-gray-300 mb-6">
              This chart shows the distribution of detected emotions during your session. Total detections: {totalEmotions}.
            </p>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={emotionCounts} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                  <XAxis dataKey="name" stroke="#A0AEC0" />
                  <YAxis stroke="#A0AEC0" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568' }}
                    labelStyle={{ color: '#E2E8F0' }}
                  />
                  <Legend wrapperStyle={{ color: '#E2E8F0' }} />
                  <Bar dataKey="count" fill="#4299E1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-400">No emotion data collected yet.</p>
            <p className="text-gray-500 mt-2">Start tracking to see your emotional analytics.</p>
          </div>
        )}
      </div>
    </div>
  );
};
