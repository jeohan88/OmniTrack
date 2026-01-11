
import { GoogleGenAI } from "@google/genai";

// We use a lazy initialization pattern to ensure the GoogleGenAI instance 
// is only created when first needed. This prevents the application from 
// crashing during the initial script evaluation if process.env is handled 
// differently by the hosting platform's runtime.
let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    // Note: The API key is assumed to be provided via process.env.API_KEY
    // by the execution environment as per project requirements.
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
    aiInstance = new GoogleGenAI({ apiKey: apiKey || '' });
  }
  return aiInstance;
}

export async function summarizeIssue(title: string, description: string) {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize the following technical issue into a single concise sentence for a manager's quick review. 
      Title: ${title}
      Description: ${description}`,
    });
    return response.text || "No summary available.";
  } catch (error) {
    console.error("Gemini summarize error:", error);
    return "Error generating summary.";
  }
}

export async function suggestPriority(description: string) {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on the following bug/issue description, suggest an appropriate Priority level (Critical, High, Medium, Low). 
      Only return the priority level word.
      Description: ${description}`,
    });
    return response.text?.trim() || "Medium";
  } catch (error) {
    console.error("Gemini priority suggestion error:", error);
    return "Medium";
  }
}
