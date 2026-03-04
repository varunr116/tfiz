import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Message } from "../types.ts";
import { PRODUCTS } from "../constants.ts";

/**
 * Executes a chat interaction with the TFiZ assistant using the text model.
 */
export const geminiChat = async (history: Message[], userInput: string) => {
  // Use process.env.API_KEY directly as per guidelines.
  const apiKey = process.env.API_KEY || '';
  if (!apiKey) return { text: "Disconnected. Check API Key.", suggestedIds: [] };

  try {
    // Create a new instance right before use to ensure the latest API key is used.
    const ai = new GoogleGenAI({ apiKey });
    const catalogSummary = PRODUCTS.map(p => `${p.id}: ${p.name} ($${p.price})`).join(', ');
    
    // Use systemInstruction for defining model behavior.
    const systemInstruction = `You are 'TFiZ', a GenZ lifestyle and fashion assistant. Use catalog: ${catalogSummary}. Respond in JSON with responseText and suggestedProductIds.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({ role: h.role, parts: [{ text: h.content }] })),
        { role: 'user', parts: [{ text: userInput }] }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            responseText: { type: Type.STRING },
            suggestedProductIds: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["responseText", "suggestedProductIds"]
        }
      }
    });

    // Access text as a property, not a method.
    const result = JSON.parse(response.text || '{}');
    return { text: result.responseText, suggestedIds: result.suggestedProductIds };
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return { text: "Error connecting to TFiZ AI.", suggestedIds: [] };
  }
};

/**
 * Connects to a real-time Live Session for AR assistance.
 */
export const connectLiveSession = (callbacks: any) => {
  // Use process.env.API_KEY directly as per guidelines.
  const apiKey = process.env.API_KEY || '';
  if (!apiKey) {
      console.error("No API Key available for Live Session");
      return Promise.reject("No API Key");
  }
  
  // Create a new GoogleGenAI instance right before connecting.
  const ai = new GoogleGenAI({ apiKey });
  
  const switchProductTool = {
    name: 'switchProduct',
    parameters: {
      type: Type.OBJECT,
      description: 'Switch the active item in the AR view.',
      properties: {
        productId: { type: Type.STRING, description: 'ID of the product (e.g., t1, h1, ter1)' },
        color: { type: Type.STRING, description: 'Optional color name' }
      },
      required: ['productId']
    }
  };

  const captureScreenshotTool = {
    name: 'captureScreenshot',
    parameters: {
      type: Type.OBJECT,
      description: 'Capture a screenshot of the current AR look.',
      properties: {},
    }
  };

  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO], // Exactly one modality must be present.
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
      },
      systemInstruction: `You are the TFiZ AR Assistant. 
      You help users experience premium lifestyle products virtually.
      You can see what the user is doing via the camera stream.
      If the user asks to "try this on" or "show me the black one", use the switchProduct tool.
      Provide fashion advice, tell them if the fit looks fire, and encourage them to check out.
      Catalog: ${PRODUCTS.map(p => `${p.id}: ${p.name}`).join(', ')}`,
      tools: [{ functionDeclarations: [switchProductTool, captureScreenshotTool] }],
    },
  });
};