import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getGeminiRecommendations } from "@/lib/gemini"
import { Loader2 } from "lucide-react"

interface FeatureImportance {
  feature: string;
  importance: number;
}

interface PredictionResultProps {
  result: {
    explanation: {
      prediction: number;
      feature_importance: FeatureImportance[];
    };
    success: boolean;
  } | null
}

interface GeminiResponse {
  recommendations: string[];
  explanation: string;
}

export function PredictionResult({ result }: PredictionResultProps) {
  const [geminiResponse, setGeminiResponse] = useState<GeminiResponse | null>(null)
  const [isLoadingGemini, setIsLoadingGemini] = useState(false)

  useEffect(() => {
    async function fetchGeminiRecommendations() {
      if (!result?.explanation) return

      setIsLoadingGemini(true)
      try {
        const response = await getGeminiRecommendations({
          prediction: result.explanation.prediction,
          feature_importance: result.explanation.feature_importance,
        })
        setGeminiResponse(response)
      } catch (error) {
        console.error("Error fetching Gemini recommendations:", error)
      } finally {
        setIsLoadingGemini(false)
      }
    }

    fetchGeminiRecommendations()
  }, [result])

  if (!result || !result.explanation) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-slate-50 pb-2">
          <CardTitle className="text-xl">Prediction Results</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-slate-500">
            No prediction results available
          </div>
        </CardContent>
      </Card>
    )
  }

  // Determine effort category based on the result
  const getEffortCategory = (value: number) => {
    if (value < 100) return { name: "Low", color: "bg-green-100 text-green-800" }
    if (value < 300) return { name: "Medium", color: "bg-yellow-100 text-yellow-800" }
    if (value < 600) return { name: "High", color: "bg-orange-100 text-orange-800" }
    return { name: "Very High", color: "bg-red-100 text-red-800" }
  }

  // Calculate progress percentage (capped at 100)
  const progressPercentage = Math.min(100, (result.explanation.prediction / 1000) * 100)

  // Get effort category
  const category = getEffortCategory(result.explanation.prediction)

  // Sort feature importance by absolute value
  const sortedFeatures = [...result.explanation.feature_importance].sort((a, b) => 
    Math.abs(b.importance) - Math.abs(a.importance)
  )

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-slate-50 pb-2">
        <CardTitle className="text-xl">Prediction Results</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="text-center p-6 bg-slate-50 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Predicted Effort</h3>
              <p className="text-5xl font-bold">{result.explanation.prediction.toFixed(1)}</p>
              <div
                className={`mt-3 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${category.color}`}
              >
                {category.name} Effort
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
                <span>Very High</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            <div>
              <h4 className="font-medium mb-2">Feature Importance</h4>
              <div className="space-y-2">
                {sortedFeatures.map((feature) => (
                  <div key={feature.feature} className="flex items-center gap-2">
                    <div className="w-32 text-sm">{feature.feature}</div>
                    <div className="flex-1">
                      <Progress 
                        value={Math.abs(feature.importance) * 4} 
                        className={`h-2 ${feature.importance >= 0 ? 'bg-blue-500' : 'bg-red-500'}`}
                      />
                    </div>
                    <div className="w-16 text-sm text-right">
                      {feature.importance.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">AI-Powered Recommendations</h4>
              {isLoadingGemini ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
                </div>
              ) : geminiResponse ? (
                <ul className="space-y-2">
                  {geminiResponse.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className={`${category.color} p-1 rounded-full mt-0.5`}>✓</span>
                      <span>{recommendation}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500">Failed to load recommendations</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-4">Effort Comparison</h4>
              <div className="h-64 flex items-center justify-center">
                <div className="w-full">
                  <div className="flex items-end h-48 gap-4 mb-2">
                    <div className="flex-1 flex flex-col items-center">
                      <div className="text-xs text-slate-500 mb-1">Your Project</div>
                      <div
                        className="w-full bg-indigo-500 rounded-t-sm"
                        style={{ height: `${Math.min(100, (result.explanation.prediction / 600) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div className="text-xs text-slate-500 mb-1">Low Avg</div>
                      <div className="w-full bg-green-400 rounded-t-sm" style={{ height: "8%" }}></div>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div className="text-xs text-slate-500 mb-1">Medium Avg</div>
                      <div className="w-full bg-yellow-400 rounded-t-sm" style={{ height: "33%" }}></div>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div className="text-xs text-slate-500 mb-1">High Avg</div>
                      <div className="w-full bg-orange-400 rounded-t-sm" style={{ height: "75%" }}></div>
                    </div>
                  </div>
                  <div className="h-px bg-slate-200 w-full"></div>
                </div>
              </div>
            </div>

            <hr className="my-4" />

            <div>
              <h4 className="font-medium mb-2">AI Interpretation</h4>
              {isLoadingGemini ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
                </div>
              ) : geminiResponse ? (
                <p className="text-sm text-slate-600">
                  {geminiResponse.explanation}
                </p>
              ) : (
                <p className="text-sm text-slate-500">Failed to load interpretation</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
