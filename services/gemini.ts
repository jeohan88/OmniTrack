
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function summarizeIssue(title: string, description: string) {
  try {
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
