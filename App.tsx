
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ConsentModal } from './components/ConsentModal';
import { ControlsUI } from './components/ControlsUI';
import { HeatmapOverlay } from './components/HeatmapOverlay';
import { SimulatedWebpage } from './components/SimulatedWebpage';
import { AnalyticsModal } from './components/AnalyticsModal';
import { RestoreSessionModal } from './components/RestoreSessionModal';
import { analyzeEmotion } from './services/geminiService';
import type { EmotionData, HeatmapPoint, EmotionType } from './types';

const App: React.FC = () => {
  const [hasConsented, setHasConsented] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [heatmapIntensity, setHeatmapIntensity] = useState(0.7);
  const [heatmapPoints, setHeatmapPoints] = useState<HeatmapPoint[]>([]);
  const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([]);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionData | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);
  const [savedSession, setSavedSession] = useState<{ emotionHistory: EmotionData[], heatmapPoints: HeatmapPoint[] } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const trackingIntervalRef = useRef<number | null>(null);

  // Load session from localStorage on initial load
  useEffect(() => {
    const savedHistoryRaw = localStorage.getItem('emotionTrackerSession_emotionHistory');
    const savedPointsRaw = localStorage.getItem('emotionTrackerSession_heatmapPoints');

    if (savedHistoryRaw && savedPointsRaw) {
      try {
        const savedHistory = JSON.parse(savedHistoryRaw);
        const savedPoints = JSON.parse(savedPointsRaw);
        if (Array.isArray(savedHistory) && savedHistory.length > 0) {
          setSavedSession({ emotionHistory: savedHistory, heatmapPoints: savedPoints });
          setShowRestorePrompt(true);
        }
      } catch (e) {
        console.error("Failed to parse saved session", e);
        // Clear corrupted data
        localStorage.removeItem('emotionTrackerSession_emotionHistory');
        localStorage.removeItem('emotionTrackerSession_heatmapPoints');
      }
    }
  }, []);

  // Save session to localStorage when user navigates away
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (emotionHistory.length > 0) {
        localStorage.setItem('emotionTrackerSession_emotionHistory', JSON.stringify(emotionHistory));
        localStorage.setItem('emotionTrackerSession_heatmapPoints', JSON.stringify(heatmapPoints));
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [emotionHistory, heatmapPoints]);


  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setError("Could not access webcam. Please check permissions and try again.");
      setIsTracking(false);
    }
  }, []);

  const stopWebcam = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);
  
  const captureAndAnalyze = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || videoRef.current.readyState < 2) {
        return;
    }
    
    setIsLoading(true);
    setError(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    
    if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64Image = canvas.toDataURL('image/jpeg', 0.7).split(',')[1];
        
        try {
            const result = await analyzeEmotion(base64Image);
            if (result && result.emotion !== 'none') {
                const newEmotionData: EmotionData = {
                    ...result,
                    timestamp: Date.now(),
                };
                const newHeatmapPoint: HeatmapPoint = {
                    ...newEmotionData,
                    ...mousePosition,
                    id: Date.now(),
                };
                setCurrentEmotion(newEmotionData);
                setEmotionHistory(prev => [...prev, newEmotionData]);
                setHeatmapPoints(prev => [...prev, newHeatmapPoint]);
            } else if (result) {
                // Set emotion to none/neutral but don't add to history/heatmap
                 setCurrentEmotion({ ...result, timestamp: Date.now() });
            }
        } catch (apiError) {
            console.error("Gemini API error:", apiError);
            setError("Failed to analyze emotion. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    } else {
        setIsLoading(false);
    }
  }, [mousePosition]);

  useEffect(() => {
    if (isTracking) {
        startWebcam();
        trackingIntervalRef.current = window.setInterval(captureAndAnalyze, 3000);
    } else {
        stopWebcam();
        if (trackingIntervalRef.current) {
            clearInterval(trackingIntervalRef.current);
            trackingIntervalRef.current = null;
        }
        setIsLoading(false);
        setCurrentEmotion(null);
    }

    return () => {
        if (trackingIntervalRef.current) {
            clearInterval(trackingIntervalRef.current);
        }
        stopWebcam();
    };
  }, [isTracking, startWebcam, stopWebcam, captureAndAnalyze]);

  const handleConsent = () => {
    setHasConsented(true);
  };
  
  const handleRemovePoint = (id: number) => {
    setHeatmapPoints(prev => prev.filter(p => p.id !== id));
  }

  const clearSavedSession = () => {
    localStorage.removeItem('emotionTrackerSession_emotionHistory');
    localStorage.removeItem('emotionTrackerSession_heatmapPoints');
    setShowRestorePrompt(false);
    setSavedSession(null);
  };

  const handleRestoreSession = () => {
    if (savedSession) {
      setEmotionHistory(savedSession.emotionHistory);
      setHeatmapPoints(savedSession.heatmapPoints);
    }
    clearSavedSession();
  };

  const handleStartNewSession = () => {
    clearSavedSession();
  };


  if (!hasConsented) {
    return <ConsentModal onConsent={handleConsent} />;
  }

  if (showRestorePrompt) {
    return <RestoreSessionModal onRestore={handleRestoreSession} onStartNew={handleStartNewSession} />;
  }

  return (
    <div className="relative min-h-screen w-full font-sans">
      <SimulatedWebpage />
      <HeatmapOverlay points={heatmapPoints} intensity={heatmapIntensity} onPointFade={handleRemovePoint} />
      
      {/* Hidden video and canvas elements for processing */}
      <video ref={videoRef} autoPlay playsInline className="absolute opacity-0 pointer-events-none w-px h-px" />
      <canvas ref={canvasRef} className="absolute opacity-0 pointer-events-none w-px h-px" />

      <ControlsUI
        isTracking={isTracking}
        onToggleTracking={() => setIsTracking(prev => !prev)}
        heatmapIntensity={heatmapIntensity}
        onIntensityChange={setHeatmapIntensity}
        onShowAnalytics={() => setShowAnalytics(true)}
        isLoading={isLoading}
        currentEmotion={currentEmotion}
      />
      
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white p-3 rounded-lg shadow-lg z-50">
          <p>{error}</p>
          <button onClick={() => setError(null)} className="absolute top-1 right-2 text-lg">&times;</button>
        </div>
      )}

      {showAnalytics && (
        <AnalyticsModal
          emotionHistory={emotionHistory}
          onClose={() => setShowAnalytics(false)}
        />
      )}
    </div>
  );
};

export default App;
