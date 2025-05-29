import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

interface PredictionData {
  prediction: number;
  feature_importance: Array<{
    feature: string;
    importance: number;
  }>;
}

export async function getGeminiRecommendations(data: PredictionData): Promise<{
  recommendations: string[];
  explanation: string;
}> {
  try {
    // Initialize model with safety settings
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    const prompt = `Given the following software project effort prediction data:
    - Predicted Effort: ${data.prediction.toFixed(2)} person-days
    - Feature Importance:
    ${data.feature_importance
      .map(
        (f) =>
          `  - ${f.feature}: ${f.importance.toFixed(2)} (${
            f.importance >= 0 ? "increases" : "decreases"
          } effort)`
      )
      .join("\n")}

    Please provide:
    1. A list of 3-4 specific, actionable recommendations for managing this project based on the effort prediction and feature importance.
    2. A brief explanation of what the prediction means in practical terms.

    Format the response as JSON with two fields:
    - recommendations: array of strings
    - explanation: string

    Keep the recommendations practical and focused on project management, team size, and timeline considerations.`;

    // Add error handling for the API call
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response
      const parsedResponse = JSON.parse(text);
      
      return {
        recommendations: parsedResponse.recommendations,
        explanation: parsedResponse.explanation,
      };
    } catch (apiError) {
      console.error("API Error details:", {
        error: apiError,
        model: "gemini-pro"
      });
      throw apiError;
    }
  } catch (error) {
    console.error("Error getting Gemini recommendations:", error);
    // Return fallback recommendations
    return {
      recommendations: [
        "Consider breaking the project into smaller phases",
        "Allocate appropriate team size based on the effort estimate",
        "Implement regular progress tracking and milestone reviews",
      ],
      explanation: "The prediction indicates the estimated effort required for your project based on the input parameters. The effort value represents person-days needed to complete the project.",
    };
  }
} 