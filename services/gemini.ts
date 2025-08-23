import { GoogleGenAI, Chat } from "@google/genai";

// The API key is securely managed as an environment variable.
const apiKey = process.env.API_KEY;

if (!apiKey) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

export const createChatSession = (systemInstruction: string): Chat => {
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
        },
    });
    return chat;
};