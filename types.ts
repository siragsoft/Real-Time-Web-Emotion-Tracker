
export const EmotionTypes = ["happiness", "sadness", "surprise", "anger", "neutral", "none"] as const;
export type EmotionType = (typeof EmotionTypes)[number];

export interface EmotionData {
  emotion: EmotionType;
  confidence: number;
  timestamp: number;
}

export interface HeatmapPoint extends EmotionData {
  x: number;
  y: number;
  id: number;
}

export const emotionColorMapping: Record<EmotionType, string> = {
  happiness: "rgba(250, 204, 21, 0.8)", // yellow-400
  sadness: "rgba(59, 130, 246, 0.8)", // blue-500
  surprise: "rgba(249, 115, 22, 0.8)", // orange-500
  anger: "rgba(239, 68, 68, 0.8)", // red-500
  neutral: "rgba(156, 163, 175, 0.7)", // gray-400
  none: "rgba(0, 0, 0, 0)",
};
