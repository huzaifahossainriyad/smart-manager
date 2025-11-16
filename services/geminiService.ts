
import { GoogleGenAI } from "@google/genai";
import { GroundingChunk } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'YOUR_API_KEY_HERE' });

interface GeminiResponse {
    text: string;
    groundingChunks?: GroundingChunk[];
}

export const getQuickAdvice = async (prompt: string): Promise<GeminiResponse> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return { text: response.text };
    } catch (error) {
        console.error("Error getting quick advice:", error);
        return { text: "দুঃখিত, একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।" };
    }
};

export const getMarketAnalysis = async (prompt: string): Promise<GeminiResponse> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];
        
        return { 
            text: response.text,
            groundingChunks: chunks
        };
    } catch (error) {
        console.error("Error getting market analysis:", error);
        return { text: "দুঃখিত, একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।" };
    }
};

export const getDeepAnalysis = async (prompt: string): Promise<GeminiResponse> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 32768 },
            },
        });
        return { text: response.text };
    } catch (error) {
        console.error("Error getting deep analysis:", error);
        return { text: "দুঃখিত, একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।" };
    }
};
