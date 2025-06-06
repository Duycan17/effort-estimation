import { FeatureImportance } from "@/types/prediction";

interface GeminiRequest {
  prediction: number;
  feature_importance: FeatureImportance[];
  personMonths: boolean;
}

interface GeminiResponse {
  team_recommendations: {
    team_size: string;
    roles_needed: string[];
    team_structure: string;
  };
  resource_planning: {
    budget_estimate: string;
    key_resources: string[];
    allocation_strategy: string;
  };
  timeline_planning: {
    estimated_duration: string;
    major_milestones: {
      phase: string;
      duration: string;
      deliverables: string[];
    }[];
  };
  risk_management: {
    high_priority_risks: {
      risk: string;
      impact: string;
      mitigation: string;
    }[];
    contingency_plans: string[];
  };
  feature_explanations: {
    feature: string;
    importance: number;
    explanation: string;
  }[];
  summary: string;
}

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function getGeminiRecommendationsApi(
  data: GeminiRequest
): Promise<GeminiResponse> {
  try {
    const prompt = `
      As a senior project management consultant, analyze this project's effort prediction and provide detailed, actionable recommendations.
      
      Project Metrics:
      - Person ${data.personMonths ? "months" : "hours"}: ${Math.abs(data.prediction)}
      - Feature Importance Breakdown:
      ${data.feature_importance
        .map((f) => `  * ${f.feature}: ${f.importance}`)
        .join("\n")}

      Please provide a comprehensive project management plan and feature analysis stricly in the following JSON format:
      {
        "team_recommendations": {
        "team_size": "Specific number of team members needed",
          "roles_needed": [
            "List of specific roles required (e.g., 'Senior Backend Developer', 'UI/UX Designer')"
          ],
          "team_structure": "Recommended team organization and reporting structure"
        },
        "resource_planning": {
          "budget_estimate": "Brief cost range based on effort",
          "key_resources": [
            "List of critical resources needed"
          ],
          "allocation_strategy": "Strategy for allocating resources across project phases"
        },
        "timeline_planning": {
          "estimated_duration": "Total project duration estimate",
          "major_milestones": [
            {
              "phase": "Phase name",
              "duration": "Expected duration",
              "deliverables": [
                "Key deliverables"
              ]
            }
          ]
        },
        "risk_management": {
          "high_priority_risks": [
            {
              "risk": "Brief risk description",
              "impact": "Impact level",
              "mitigation": "Key mitigation action"
            }
          ],
          "contingency_plans": [
            "Main backup plan"
          ]
        },
        "feature_explanations": [
          {
            "feature": "Name of the feature",
            "importance": "Numerical importance score",
            "explanation": "Detailed explanation of why this feature is important and how it impacts the effort estimation, including specific recommendations for handling this aspect of the project"
          }
        ],
        "summary": "Brief executive summary"
      }

      Important guidelines:
      1. Keep all responses concise and focused
      2. Limit risk items to top 2-3 critical risks
      3. Provide brief, actionable recommendations
      4. Focus on essential information only
      5. Feature explanations should be detailed and actionable, explaining why each feature matters
      Make all recommendations specific and actionable.
    `;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    const result = await response.json();

    try {
      const text = result.candidates[0].content.parts[0].text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);

      return {
        team_recommendations: {
          team_size:
            parsedResponse.team_recommendations?.team_size ||
            "Team size not specified",
          roles_needed: parsedResponse.team_recommendations?.roles_needed || [],
          team_structure:
            parsedResponse.team_recommendations?.team_structure ||
            "Team structure not specified",
        },
        resource_planning: {
          budget_estimate:
            parsedResponse.resource_planning?.budget_estimate ||
            "Budget not estimated",
          key_resources: parsedResponse.resource_planning?.key_resources || [],
          allocation_strategy:
            parsedResponse.resource_planning?.allocation_strategy ||
            "Resource allocation not specified",
        },
        timeline_planning: {
          estimated_duration:
            parsedResponse.timeline_planning?.estimated_duration ||
            "Duration not specified",
          major_milestones:
            parsedResponse.timeline_planning?.major_milestones || [],
        },
        risk_management: {
          high_priority_risks:
            parsedResponse.risk_management?.high_priority_risks || [],
          contingency_plans:
            parsedResponse.risk_management?.contingency_plans || [],
        },
        feature_explanations: parsedResponse.feature_explanations || [],
        summary: parsedResponse.summary || "Summary not available",
      };
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      return getDefaultResponse();
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return getDefaultResponse();
  }
}

function getDefaultResponse(): GeminiResponse {
  return {
    team_recommendations: {
      team_size: "Unable to determine team size",
      roles_needed: [],
      team_structure: "Team structure not available",
    },
    resource_planning: {
      budget_estimate: "Budget estimation failed",
      key_resources: [],
      allocation_strategy: "Resource allocation not available",
    },
    timeline_planning: {
      estimated_duration: "Timeline estimation failed",
      major_milestones: [],
    },
    risk_management: {
      high_priority_risks: [],
      contingency_plans: [],
    },
    feature_explanations: [],
    summary: "Failed to generate project analysis",
  };
}
