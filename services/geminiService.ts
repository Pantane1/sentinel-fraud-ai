
import { GoogleGenAI, Type } from "@google/genai";
import { ModelMetrics, ModelConfig, FeedbackData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async analyzeDataSchema(sampleData: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following CSV sample and provide a summary of the features, identifying potential target variables for fraud detection (usually 'Class', 'Target', or similar): \n\n ${sampleData}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            features: { type: Type.ARRAY, items: { type: Type.STRING } },
            targetVariable: { type: Type.STRING },
            dataIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING }
          },
          required: ["features", "targetVariable", "dataIssues", "summary"]
        }
      }
    });
    return JSON.parse(response.text);
  },

  async simulateTraining(config: ModelConfig, dataStats: any): Promise<ModelMetrics> {
    const prompt = `Simulate training results for a credit card fraud detection model. 
    Algorithm: ${config.algorithm}
    Parameters: ${JSON.stringify(config)}
    Data Context: Highly imbalanced credit card transaction dataset.
    Generate realistic metrics showing high performance but acknowledging the difficulty of fraud detection (Precision-Recall trade-off).`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            accuracy: { type: Type.NUMBER },
            precision: { type: Type.NUMBER },
            recall: { type: Type.NUMBER },
            f1Score: { type: Type.NUMBER },
            auc: { type: Type.NUMBER },
            confusionMatrix: {
              type: Type.OBJECT,
              properties: {
                tp: { type: Type.NUMBER },
                fp: { type: Type.NUMBER },
                tn: { type: Type.NUMBER },
                fn: { type: Type.NUMBER }
              },
              required: ["tp", "fp", "tn", "fn"]
            }
          },
          required: ["accuracy", "precision", "recall", "f1Score", "auc", "confusionMatrix"]
        }
      }
    });
    return JSON.parse(response.text);
  },

  async predictFraud(transaction: any, metrics: ModelMetrics) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `As a fraud detection model with ${metrics.auc} AUC, classify this transaction as 'Fraud' or 'Legitimate'. Provide a probability score and reasoning based on the feature values.
      Transaction: ${JSON.stringify(transaction)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prediction: { type: Type.STRING, enum: ["Fraud", "Legitimate"] },
            probability: { type: Type.NUMBER },
            reasoning: { type: Type.STRING }
          },
          required: ["prediction", "probability", "reasoning"]
        }
      }
    });
    return JSON.parse(response.text);
  },

  async processFeedback(feedback: FeedbackData) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `The user submitted the following ${feedback.category} feedback: "${feedback.message}". 
      Respond as the Sentinel AI Support Assistant. Acknowledge the feedback professionally and mention how it helps improve our fraud detection systems. Keep it under 2 sentences.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            acknowledgment: { type: Type.STRING }
          },
          required: ["acknowledgment"]
        }
      }
    });
    return JSON.parse(response.text);
  },

  async chatWithPantane(userMessage: string, history: { role: string; text: string }[]) {
    const contents = history.map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    }));
    
    contents.push({ role: 'user', parts: [{ text: userMessage }] });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: `You are Pantane, a highly communicative and helpful onboarding assistant for Sentinel Fraud AI.
        
        STRICT FORMATTING RULES:
        1. DO NOT USE ANY ASTERISKS (*) IN YOUR OUTPUT.
        2. DO NOT USE MARKDOWN FORA BOLD OR ITALIC TEXT.
        3. For emphasis, use ALL CAPS words.
        4. For lists, use simple numbers (1., 2., 3.) or dashes (-).
        5. Use clear, separate lines for different thoughts to maintain clarity.
        6. Keep your tone extremely friendly and professional.
        
        YOUR MISSION:
        Guide new users through the application stages: Data Ingestion, Preprocessing, Model Training, Evaluation, and Deployment. 
        Explain that we use SMOTE and XGBoost for handling imbalanced data. 
        If they ask how to use the app, explain the sidebar steps sequentially.
        Your creator is Sentinel AI Labs.`
      }
    });
    return response.text;
  }
};
