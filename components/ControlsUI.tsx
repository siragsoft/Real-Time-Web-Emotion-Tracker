
import React from 'react';
import { PlayIcon, PauseIcon, ChartBarIcon, LoadingIcon } from './icons/Icons';
import { EmotionIcon } from './icons/EmotionIcons';
import type { EmotionData } from '../types';

interface ControlsUIProps {
  isTracking: boolean;
  onToggleTracking: () => void;
  heatmapIntensity: number;
  onIntensityChange: (value: number) => void;
  onShowAnalytics: () => void;
  isLoading: boolean;
  currentEmotion: EmotionData | null;
}

export const ControlsUI: React.FC<ControlsUIProps> = ({
  isTracking,
  onToggleTracking,
  heatmapIntensity,
  onIntensityChange,
  onShowAnalytics,
  isLoading,
  currentEmotion,
}) => {
  return (
    <div className="fixed bottom-5 right-5 bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-lg shadow-2xl p-4 flex flex-col gap-4 w-64 z-40 border border-gray-700">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Controls</h3>
        <div className={`w-4 h-4 rounded-full ${isTracking ? 'bg-green-500' : 'bg-red-500'} transition-colors duration-300`}></div>
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleTracking}
          disabled={isLoading}
          className={`p-3 rounded-full transition-colors duration-300 ${
            isTracking ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
          } disabled:bg-gray-500 disabled:cursor-not-allowed`}
        >
          {isLoading ? <LoadingIcon /> : (isTracking ? <PauseIcon /> : <PlayIcon />)}
        </button>
        <div className="flex-1 text-center">
            {isLoading ? 'Analyzing...' : (isTracking ? 'Tracking Active' : 'Tracking Paused')}
        </div>
      </div>

      <div className="border-t border-gray-700 pt-4 mt-0">
        <label className="block text-sm font-medium text-gray-300 mb-2">
            Live Emotion
        </label>
        <div className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-lg h-[68px]">
            <div className="w-8 h-8 flex items-center justify-center">
                <EmotionIcon emotion={currentEmotion?.emotion ?? null} />
            </div>
            <div className="flex-1">
                <div className="font-bold text-white capitalize">
                    {currentEmotion ? currentEmotion.emotion : 'N/A'}
                </div>
                <div className="text-sm text-gray-400">
                    Confidence: {currentEmotion ? `${(currentEmotion.confidence * 100).toFixed(0)}%` : '--%'}
                </div>
            </div>
        </div>
      </div>

      <div>
        <label htmlFor="intensity" className="block text-sm font-medium text-gray-300 mb-2">
          Heatmap Intensity
        </label>
        <input
          id="intensity"
          type="range"
          min="0.1"
          max="1"
          step="0.05"
          value={heatmapIntensity}
          onChange={(e) => onIntensityChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <button
        onClick={onShowAnalytics}
        className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
      >
        <ChartBarIcon />
        View Analytics
      </button>
    </div>
  );
};
