
import React, { useEffect, useState } from 'react';
import type { HeatmapPoint } from '../types';
import { emotionColorMapping } from '../types';

interface HeatmapOverlayProps {
  points: HeatmapPoint[];
  intensity: number;
  onPointFade: (id: number) => void;
}

const HeatmapPointComponent: React.FC<{ point: HeatmapPoint; intensity: number; onFade: (id: number) => void }> = ({ point, intensity, onFade }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const fadeTimer = setTimeout(() => {
            setIsVisible(false);
        }, 4000); // Start fading out after 4 seconds

        const removeTimer = setTimeout(() => {
            onFade(point.id);
        }, 5000); // Remove from DOM after 5 seconds

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
        };
    }, [point.id, onFade]);

    const color = emotionColorMapping[point.emotion] || 'rgba(255, 255, 255, 0.5)';
    const size = 40 + (point.confidence * 40); // Size based on confidence

    return (
        <div
            className={`absolute rounded-full transition-all duration-1000 ease-out pointer-events-none ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-125'}`}
            style={{
                left: point.x,
                top: point.y,
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: color.replace('0.8', intensity.toString()).replace('0.7', (intensity * 0.8).toString()),
                transform: 'translate(-50%, -50%)',
                filter: `blur(${10 - (point.confidence * 8)}px)`,
            }}
        />
    );
};


export const HeatmapOverlay: React.FC<HeatmapOverlayProps> = ({ points, intensity, onPointFade }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {points.map(point => (
        <HeatmapPointComponent key={point.id} point={point} intensity={intensity} onFade={onPointFade} />
      ))}
    </div>
  );
};
