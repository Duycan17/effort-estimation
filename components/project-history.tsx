"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Star } from "lucide-react"
import type { Project } from "@/lib/types"
import { FeedbackDialog } from "./feedback-dialog"

interface ProjectHistoryProps {
  onBack: () => void
}

export function ProjectHistory({ onBack }: ProjectHistoryProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

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

  const getEffortCategory = (effort: number) => {
    if (effort < 100) return { name: "Low", color: "bg-green-100 text-green-800" }
    if (effort < 300) return { name: "Medium", color: "bg-yellow-100 text-yellow-800" }
    if (effort < 600) return { name: "High", color: "bg-orange-100 text-orange-800" }
    return { name: "Very High", color: "bg-red-100 text-red-800" }
  }

  const handleFeedbackSubmit = async (rating: number, comment: string, actualEffort?: number) => {
    if (!selectedProject) return

    const { error } = await supabase
      .from("projects")
      .update({
        feedback_rating: rating,
        feedback_comment: comment,
        actual_effort: actualEffort,
        updated_at: new Date().toISOString(),
      })
      .eq("id", selectedProject.id)

    if (!error) {
      fetchProjects()
      setShowFeedback(false)
      setSelectedProject(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Prediction
        </Button>
        <h1 className="text-2xl font-bold">Project History</h1>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No projects found. Create your first prediction!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => {
            const category = getEffortCategory(project.predicted_effort)
            return (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      {project.description && <p className="text-sm text-gray-600 mt-1">{project.description}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={category.color}>{category.name}</Badge>
                      {project.feedback_rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{project.feedback_rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Predicted Effort</p>
                      <p className="font-semibold">{project.predicted_effort.toFixed(1)}</p>
                    </div>
                    {project.actual_effort && (
                      <div>
                        <p className="text-sm text-gray-500">Actual Effort</p>
                        <p className="font-semibold">{project.actual_effort.toFixed(1)}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">AFP</p>
                      <p className="font-semibold">{project.afp}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-semibold">{project.duration} months</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {new Date(project.created_at).toLocaleDateString()}
                    </div>
                    {!project.feedback_rating && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedProject(project)
                          setShowFeedback(true)
                        }}
                      >
                        Add Feedback
                      </Button>
                    )}
                  </div>

                  {project.feedback_comment && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{project.feedback_comment}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {showFeedback && selectedProject && (
        <FeedbackDialog
          project={selectedProject}
          onSubmit={handleFeedbackSubmit}
          onClose={() => {
            setShowFeedback(false)
            setSelectedProject(null)
          }}
        />
      )}
    </div>
  )
}
