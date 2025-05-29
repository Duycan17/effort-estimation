"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Target, Clock, Star, Plus, Activity } from "lucide-react"
import type { Project } from "@/lib/types"

interface DashboardOverviewProps {
  onViewChange: (view: string) => void
}

export function DashboardOverview({ onViewChange }: DashboardOverviewProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProjects: 0,
    avgEffort: 0,
    completedProjects: 0,
    avgAccuracy: 0,
  })

  const supabase = createClient()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    const { data: user } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("projects").select("*").eq("user_id", user.user?.id).order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching projects:", error)
    } else {
      setProjects(data || [])
      calculateStats(data || [])
    }
    setLoading(false)
  }

  const calculateStats = (projectData: Project[]) => {
    const totalProjects = projectData.length
    const avgEffort =
      totalProjects > 0 ? projectData.reduce((sum, p) => sum + p.predicted_effort, 0) / totalProjects : 0
    const completedProjects = projectData.filter((p) => p.feedback_rating).length
    const avgAccuracy =
      completedProjects > 0
        ? projectData.filter((p) => p.feedback_rating).reduce((sum, p) => sum + (p.feedback_rating || 0), 0) /
          completedProjects
        : 0

    setStats({
      totalProjects,
      avgEffort,
      completedProjects,
      avgAccuracy,
    })
  }

  const getEffortDistribution = () => {
    const distribution = { Low: 0, Medium: 0, High: 0, "Very High": 0 }
    projects.forEach((project) => {
      const effort = project.predicted_effort
      if (effort < 100) distribution.Low++
      else if (effort < 300) distribution.Medium++
      else if (effort < 600) distribution.High++
      else distribution["Very High"]++
    })

    return Object.entries(distribution).map(([name, value]) => ({ name, value }))
  }

  const getRecentActivity = () => {
    return projects.slice(0, 6).map((project) => ({
      date: new Date(project.created_at).toLocaleDateString(),
      effort: project.predicted_effort,
    }))
  }

  const recentProjects = projects.slice(0, 5)
  const effortDistribution = getEffortDistribution()
  const recentActivity = getRecentActivity()

  const COLORS = ["#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your project predictions</p>
        </div>
        <Button onClick={() => onViewChange("prediction")} className="gap-2">
          <Plus className="h-4 w-4" />
          New Prediction
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">{stats.completedProjects} with feedback</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Effort</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgEffort.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">person-days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Accuracy</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgAccuracy > 0 ? stats.avgAccuracy.toFixed(1) : "N/A"}</div>
            <p className="text-xs text-muted-foreground">
              {stats.avgAccuracy > 0 ? "out of 5 stars" : "No feedback yet"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalProjects > 0 ? Math.round((stats.completedProjects / stats.totalProjects) * 100) : 0}%
            </div>
            <Progress
              value={stats.totalProjects > 0 ? (stats.completedProjects / stats.totalProjects) * 100 : 0}
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Effort Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Effort Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={effortDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {effortDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={recentActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="effort" stroke="#6366f1" strokeWidth={2} dot={{ fill: "#6366f1" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Projects</CardTitle>
            <Button variant="outline" size="sm" onClick={() => onViewChange("history")}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentProjects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No projects yet. Create your first prediction!</p>
              <Button className="mt-4" onClick={() => onViewChange("prediction")}>
                Create Prediction
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentProjects.map((project) => {
                const getEffortCategory = (effort: number) => {
                  if (effort < 100) return { name: "Low", color: "bg-green-100 text-green-800" }
                  if (effort < 300) return { name: "Medium", color: "bg-yellow-100 text-yellow-800" }
                  if (effort < 600) return { name: "High", color: "bg-orange-100 text-orange-800" }
                  return { name: "Very High", color: "bg-red-100 text-red-800" }
                }

                const category = getEffortCategory(project.predicted_effort)

                return (
                  <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{project.name}</h3>
                      <p className="text-sm text-gray-500">
                        Created {new Date(project.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">{project.predicted_effort.toFixed(1)}</p>
                        <p className="text-xs text-gray-500">person-days</p>
                      </div>
                      <Badge className={category.color}>{category.name}</Badge>
                      {project.feedback_rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{project.feedback_rating}</span>
                        </div>
                      )}
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
