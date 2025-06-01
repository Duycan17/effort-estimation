"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, MessageSquare, AlertCircle, CheckCircle } from "lucide-react";
import type { Project } from "@/lib/types";

export function FeedbackCenter() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [feedbackData, setFeedbackData] = useState({
    rating: 0,
    comment: "",
    actualEffort: "",
  });

  const supabase = createClient();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data: user } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.user?.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  const handleEditFeedback = (project: Project) => {
    setEditingProject(project.id);
    setFeedbackData({
      rating: project.feedback_rating || 0,
      comment: project.feedback_comment || "",
      actualEffort: project.actual_effort?.toString() || "",
    });
  };

  const handleSaveFeedback = async (projectId: string) => {
    const { error } = await supabase
      .from("projects")
      .update({
        feedback_rating: feedbackData.rating,
        feedback_comment: feedbackData.comment,
        actual_effort: feedbackData.actualEffort
          ? Number.parseFloat(feedbackData.actualEffort)
          : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId);

    if (!error) {
      setEditingProject(null);
      fetchProjects();
      setFeedbackData({ rating: 0, comment: "", actualEffort: "" });
    }
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setFeedbackData({ rating: 0, comment: "", actualEffort: "" });
  };

  const getEffortCategory = (effort: number) => {
    if (effort < 100)
      return { name: "Low", color: "bg-green-100 text-green-800" };
    if (effort < 300)
      return { name: "Medium", color: "bg-yellow-100 text-yellow-800" };
    if (effort < 600)
      return { name: "High", color: "bg-orange-100 text-orange-800" };
    return { name: "Very High", color: "bg-red-100 text-red-800" };
  };

  const projectsWithFeedback = projects.filter((p) => p.feedback_rating);
  const projectsWithoutFeedback = projects.filter((p) => !p.feedback_rating);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">
            Loading feedback center...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Feedback Center</h1>
        <p className="text-gray-600">
          Manage and review project feedback to improve predictions
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Projects with Feedback
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projectsWithFeedback.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {projects.length > 0
                ? `${Math.round(
                    (projectsWithFeedback.length / projects.length) * 100
                  )}% completion rate`
                : "No projects yet"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Feedback
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projectsWithoutFeedback.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Projects awaiting feedback
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projectsWithFeedback.length > 0
                ? (
                    projectsWithFeedback.reduce(
                      (sum, p) => sum + (p.feedback_rating || 0),
                      0
                    ) / projectsWithFeedback.length
                  ).toFixed(1)
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {projectsWithFeedback.length > 0
                ? "out of 5 stars"
                : "No ratings yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Feedback */}
      {projectsWithoutFeedback.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Projects Awaiting Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectsWithoutFeedback.map((project) => {
                const category = getEffortCategory(project.predicted_effort);
                const isEditing = editingProject === project.id;

                return (
                  <div key={project.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        <p className="text-sm text-gray-500">
                          Created{" "}
                          {new Date(project.created_at).toLocaleDateString()}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm">
                            Predicted:{" "}
                            <strong>
                              {project.predicted_effort.toFixed(1)}
                            </strong>{" "}
                            {project.dataset === "albrecht"
                              ? "person-months"
                              : "person-hours"}
                          </span>
                          <Badge className={category.color}>
                            {category.name}
                          </Badge>
                        </div>
                      </div>
                      {!isEditing && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditFeedback(project)}>
                          Add Feedback
                        </Button>
                      )}
                    </div>

                    {isEditing && (
                      <div className="space-y-4 border-t pt-4">
                        <div>
                          <Label className="text-sm font-medium">
                            Accuracy Rating
                          </Label>
                          <div className="flex items-center gap-1 mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                className="p-1"
                                onClick={() =>
                                  setFeedbackData({
                                    ...feedbackData,
                                    rating: star,
                                  })
                                }>
                                <Star
                                  className={`h-6 w-6 ${
                                    star <= feedbackData.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="actualEffort">
                            Actual Effort (optional)
                          </Label>
                          <Input
                            id="actualEffort"
                            type="number"
                            placeholder="Enter actual effort"
                            value={feedbackData.actualEffort}
                            onChange={(e) =>
                              setFeedbackData({
                                ...feedbackData,
                                actualEffort: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div>
                          <Label htmlFor="comment">Comments (optional)</Label>
                          <Textarea
                            id="comment"
                            placeholder="Share your thoughts about the prediction..."
                            value={feedbackData.comment}
                            onChange={(e) =>
                              setFeedbackData({
                                ...feedbackData,
                                comment: e.target.value,
                              })
                            }
                            rows={3}
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleSaveFeedback(project.id)}
                            disabled={feedbackData.rating === 0}>
                            Save Feedback
                          </Button>
                          <Button variant="outline" onClick={handleCancelEdit}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Projects with Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          {projectsWithFeedback.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No feedback provided yet.</p>
              <p className="text-sm text-gray-400 mt-2">
                Complete projects and add feedback to see them here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {projectsWithFeedback.map((project) => {
                const category = getEffortCategory(project.predicted_effort);
                const isEditing = editingProject === project.id;
                const variance = project.actual_effort
                  ? Math.abs(project.predicted_effort - project.actual_effort)
                  : null;

                return (
                  <div key={project.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        <p className="text-sm text-gray-500">
                          Created{" "}
                          {new Date(project.created_at).toLocaleDateString()}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm">
                            Predicted:{" "}
                            <strong>
                              {project.predicted_effort.toFixed(1)}
                            </strong>
                          </span>
                          {project.actual_effort && (
                            <span className="text-sm">
                              Actual:{" "}
                              <strong>
                                {project.actual_effort.toFixed(1)}
                              </strong>
                            </span>
                          )}
                          <Badge className={category.color}>
                            {category.name}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">
                            {project.feedback_rating}
                          </span>
                        </div>
                        {!isEditing && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditFeedback(project)}>
                            Edit
                          </Button>
                        )}
                      </div>
                    </div>

                    {variance && (
                      <div className="mb-4">
                        <Badge
                          className={
                            variance < project.predicted_effort * 0.1
                              ? "bg-green-100 text-green-800"
                              : variance < project.predicted_effort * 0.25
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }>
                          Variance: {variance.toFixed(1)}{" "}
                          {project.dataset === "albrecht"
                            ? "person-months"
                            : "person-hours"}
                        </Badge>
                      </div>
                    )}

                    {project.feedback_comment && !isEditing && (
                      <div className="bg-gray-50 p-3 rounded-lg mb-4">
                        <p className="text-sm text-gray-700">
                          {project.feedback_comment}
                        </p>
                      </div>
                    )}

                    {isEditing && (
                      <div className="space-y-4 border-t pt-4">
                        <div>
                          <Label className="text-sm font-medium">
                            Accuracy Rating
                          </Label>
                          <div className="flex items-center gap-1 mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                className="p-1"
                                onClick={() =>
                                  setFeedbackData({
                                    ...feedbackData,
                                    rating: star,
                                  })
                                }>
                                <Star
                                  className={`h-6 w-6 ${
                                    star <= feedbackData.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="actualEffort">Actual Effort</Label>
                          <Input
                            id="actualEffort"
                            type="number"
                            placeholder="Enter actual effort"
                            value={feedbackData.actualEffort}
                            onChange={(e) =>
                              setFeedbackData({
                                ...feedbackData,
                                actualEffort: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div>
                          <Label htmlFor="comment">Comments</Label>
                          <Textarea
                            id="comment"
                            placeholder="Share your thoughts about the prediction..."
                            value={feedbackData.comment}
                            onChange={(e) =>
                              setFeedbackData({
                                ...feedbackData,
                                comment: e.target.value,
                              })
                            }
                            rows={3}
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleSaveFeedback(project.id)}
                            disabled={feedbackData.rating === 0}>
                            Update Feedback
                          </Button>
                          <Button variant="outline" onClick={handleCancelEdit}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
