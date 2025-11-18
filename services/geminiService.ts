
import { GoogleGenAI, Type } from "@google/genai";
import type { EmotionType } from '../types';
import { EmotionTypes } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const emotionAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        emotion: {
            type: Type.STRING,
            description: "The dominant emotion detected in the face.",
            enum: [...EmotionTypes],
        },
        confidence: {
            type: Type.NUMBER,
            description: "A confidence score from 0.0 to 1.0 for the detected emotion.",
        },
    },
    required: ["emotion", "confidence"],
};

export const analyzeEmotion = async (base64Image: string): Promise<{ emotion: EmotionType; confidence: number } | null> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    {
                        text: "Analyze the user's facial expression from this image and identify the dominant emotion. If no clear face or emotion is visible, classify as 'none'.",
                    },
                    {
                        inlineData: {
                            mimeType: 'image/jpeg',
                            data: base64Image,
                        },
                    },
                ],
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: emotionAnalysisSchema,
                temperature: 0.2,
            },
        });

        const jsonString = response.text.trim();
        const parsed = JSON.parse(jsonString) as { emotion: EmotionType; confidence: number };

        if (EmotionTypes.includes(parsed.emotion) && typeof parsed.confidence === 'number') {
            return parsed;
        }
        return null;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to analyze emotion via Gemini API.");
    }
};
