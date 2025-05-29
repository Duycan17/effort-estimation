"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, Target, AlertCircle } from "lucide-react"
import type { Project } from "@/lib/types"

export function Analytics() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching projects:", error)
    } else {
      setProjects(data || [])
    }
    setLoading(false)
  }

  const getAccuracyAnalysis = () => {
    const projectsWithFeedback = projects.filter((p) => p.feedback_rating && p.actual_effort)

    return projectsWithFeedback.map((project) => {
      const accuracy = project.actual_effort
        ? (Math.abs(project.predicted_effort - project.actual_effort) / project.actual_effort) * 100
        : 0

      return {
        name: project.name,
        predicted: project.predicted_effort,
        actual: project.actual_effort || 0,
        accuracy: 100 - Math.min(accuracy, 100),
        rating: project.feedback_rating,
      }
    })
  }

  const getEffortTrends = () => {
    const monthlyData: { [key: string]: { total: number; count: number; avg: number } } = {}

    projects.forEach((project) => {
      const month = new Date(project.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      })

      if (!monthlyData[month]) {
        monthlyData[month] = { total: 0, count: 0, avg: 0 }
      }

      monthlyData[month].total += project.predicted_effort
      monthlyData[month].count += 1
      monthlyData[month].avg = monthlyData[month].total / monthlyData[month].count
    })

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        avgEffort: data.avg,
        projectCount: data.count,
      }))
      .slice(-6) // Last 6 months
  }

  const getParameterCorrelation = () => {
    return projects.map((project) => ({
      afp: project.afp,
      effort: project.predicted_effort,
      duration: project.duration,
      resources: project.resource,
    }))
  }

  const accuracyData = getAccuracyAnalysis()
  const effortTrends = getEffortTrends()
  const parameterData = getParameterCorrelation()

  const avgAccuracy =
    accuracyData.length > 0 ? accuracyData.reduce((sum, item) => sum + item.accuracy, 0) / accuracyData.length : 0

  const avgRating =
    projects.filter((p) => p.feedback_rating).length > 0
      ? projects.filter((p) => p.feedback_rating).reduce((sum, p) => sum + (p.feedback_rating || 0), 0) /
        projects.filter((p) => p.feedback_rating).length
      : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Insights into your prediction accuracy and trends</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prediction Accuracy</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgAccuracy > 0 ? `${avgAccuracy.toFixed(1)}%` : "N/A"}</div>
            <Progress value={avgAccuracy} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Based on {accuracyData.length} projects with actual data
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Satisfaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating > 0 ? `${avgRating.toFixed(1)}/5` : "N/A"}</div>
            <div className="flex items-center mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={star}
                  className={`w-3 h-3 rounded-full mr-1 ${star <= avgRating ? "bg-yellow-400" : "bg-gray-200"}`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Average user rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects Analyzed</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">
              {projects.filter((p) => p.feedback_rating).length} with feedback
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Effort Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Effort Trends Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={effortTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="avgEffort" stroke="#6366f1" strokeWidth={2} name="Avg Effort" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Accuracy Scatter */}
        <Card>
          <CardHeader>
            <CardTitle>Predicted vs Actual Effort</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={accuracyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="predicted" name="Predicted" />
                  <YAxis dataKey="actual" name="Actual" />
                  <Tooltip formatter={(value, name) => [value, name === "predicted" ? "Predicted" : "Actual"]} />
                  <Scatter dataKey="actual" fill="#6366f1" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Project Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {accuracyData.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No projects with actual effort data available for analysis.</p>
              <p className="text-sm text-gray-400 mt-2">
                Add actual effort values to your projects to see detailed analytics.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {accuracyData.map((project, index) => {
                const variance = Math.abs(project.predicted - project.actual)
                const variancePercent = (variance / project.actual) * 100

                return (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{project.name}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>Predicted: {project.predicted.toFixed(1)}</span>
                        <span>Actual: {project.actual.toFixed(1)}</span>
                        <span>
                          Variance: {variance.toFixed(1)} ({variancePercent.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        className={
                          variancePercent < 10
                            ? "bg-green-100 text-green-800"
                            : variancePercent < 25
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }
                      >
                        {variancePercent < 10 ? "Excellent" : variancePercent < 25 ? "Good" : "Needs Improvement"}
                      </Badge>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div
                            key={star}
                            className={`w-3 h-3 rounded-full mr-1 ${
                              star <= (project.rating || 0) ? "bg-yellow-400" : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
