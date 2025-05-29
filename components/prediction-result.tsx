import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  Users,
  Clock,
  Target,
  AlertTriangle,
  DollarSign,
  Milestone,
  ShieldAlert,
  FileText,
} from "lucide-react";
import { getGeminiRecommendationsApi } from "@/lib/geminiApi";
import { FeatureImportance } from "@/types/prediction";

interface PredictionResultProps {
  result: {
    explanation: {
      prediction: number;
      feature_importance: FeatureImportance[];
    };
    success: boolean;
  } | null;
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
  summary: string;
}

export function PredictionResult({ result }: PredictionResultProps) {
  const [geminiResponse, setGeminiResponse] = useState<GeminiResponse | null>(
    null
  );
  const [isLoadingGemini, setIsLoadingGemini] = useState(false);

  useEffect(() => {
    async function fetchGeminiRecommendations() {
      if (!result?.explanation) return;

      setIsLoadingGemini(true);
      try {
        const response = await getGeminiRecommendationsApi({
          prediction: result.explanation.prediction,
          feature_importance: result.explanation.feature_importance,
        });
        setGeminiResponse(response);
      } catch (error) {
        console.error("Error fetching Gemini recommendations:", error);
      } finally {
        setIsLoadingGemini(false);
      }
    }

    fetchGeminiRecommendations();
  }, [result]);

  if (!result || !result.explanation) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-slate-50 pb-2">
          <CardTitle className="text-xl">Project Analysis</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-slate-500">
            No prediction results available
          </div>
        </CardContent>
      </Card>
    );
  }

  const getEffortCategory = (value: number) => {
    if (value < 100)
      return { name: "Low", color: "bg-green-100 text-green-800" };
    if (value < 300)
      return { name: "Medium", color: "bg-yellow-100 text-yellow-800" };
    if (value < 600)
      return { name: "High", color: "bg-orange-100 text-orange-800" };
    return { name: "Very High", color: "bg-red-100 text-red-800" };
  };

  const category = getEffortCategory(result.explanation.prediction);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-slate-50 pb-2">
        <CardTitle className="text-xl">Project Analysis</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Prediction Result Display */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Target className="w-5 h-5" />
                Effort Estimation
              </h3>
              <p className="text-sm text-slate-600">
                Predicted effort in person-days
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {result.explanation.prediction.toFixed(1)}
              </div>
              <span
                className={`text-sm px-2 py-1 rounded-full ${category.color}`}>
                {category.name} Effort
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Feature Importance</h4>
            <div className="space-y-2">
              {result.explanation.feature_importance.map((feature, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{feature.feature}</span>
                    <span className="font-medium">
                      {(feature.importance * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={feature.importance * 100} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {isLoadingGemini ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
          </div>
        ) : geminiResponse ? (
          <div className="space-y-8">
            {/* Executive Summary */}
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Executive Summary
              </h3>
              <p className="text-sm text-slate-600">{geminiResponse.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Team Recommendations */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Team Structure
                </h3>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Team Size</h4>
                    <p className="text-sm text-slate-600">
                      {geminiResponse.team_recommendations.team_size}
                    </p>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Required Roles</h4>
                    <ul className="space-y-1">
                      {geminiResponse.team_recommendations.roles_needed.map(
                        (role, index) => (
                          <li
                            key={index}
                            className="text-sm text-slate-600 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            {role}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Organization</h4>
                    <p className="text-sm text-slate-600">
                      {geminiResponse.team_recommendations.team_structure}
                    </p>
                  </div>
                </div>
              </div>

              {/* Resource Planning */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Resource Planning
                </h3>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Budget Estimate</h4>
                    <p className="text-sm text-slate-600">
                      {geminiResponse.resource_planning.budget_estimate}
                    </p>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Key Resources</h4>
                    <ul className="space-y-1">
                      {geminiResponse.resource_planning.key_resources.map(
                        (resource, index) => (
                          <li
                            key={index}
                            className="text-sm text-slate-600 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            {resource}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Allocation Strategy</h4>
                    <p className="text-sm text-slate-600">
                      {geminiResponse.resource_planning.allocation_strategy}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline Planning */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Milestone className="w-5 h-5" />
                  Project Timeline
                </h3>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Estimated Duration</h4>
                    <p className="text-sm text-slate-600">
                      {geminiResponse.timeline_planning.estimated_duration}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Major Milestones</h4>
                    <div className="space-y-4">
                      {geminiResponse.timeline_planning.major_milestones.map(
                        (milestone, index) => (
                          <div
                            key={index}
                            className="border-l-2 border-blue-500 pl-4">
                            <h5 className="font-medium text-sm">
                              {milestone.phase}
                            </h5>
                            <p className="text-xs text-slate-500 mb-2">
                              {milestone.duration}
                            </p>
                            <ul className="space-y-1">
                              {milestone.deliverables.map(
                                (deliverable, dIndex) => (
                                  <li
                                    key={dIndex}
                                    className="text-sm text-slate-600 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    {deliverable}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Management */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5" />
                  Risk Management
                </h3>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">High Priority Risks</h4>
                    <div className="space-y-4">
                      {geminiResponse.risk_management.high_priority_risks.map(
                        (risk, index) => (
                          <div
                            key={index}
                            className="border-l-2 border-red-500 pl-4">
                            <h5 className="font-medium text-sm text-red-600">
                              {risk.risk}
                            </h5>
                            <p className="text-xs text-slate-500 mb-1">
                              Impact: {risk.impact}
                            </p>
                            <p className="text-sm text-slate-600">
                              Mitigation: {risk.mitigation}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Contingency Plans</h4>
                    <ul className="space-y-1">
                      {geminiResponse.risk_management.contingency_plans.map(
                        (plan, index) => (
                          <li
                            key={index}
                            className="text-sm text-slate-600 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                            {plan}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-500">
            Failed to load project analysis
          </div>
        )}
      </CardContent>
    </Card>
  );
}
