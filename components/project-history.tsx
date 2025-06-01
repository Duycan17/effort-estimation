"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Project } from "@/lib/types";
import { FeedbackDialog } from "./feedback-dialog";
import { ProjectCard } from "./project-card";
interface ProjectHistoryProps {
  onBack: () => void;
}

export function ProjectHistory({ onBack }: ProjectHistoryProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

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

  const handleFeedbackSubmit = async (
    rating: number,
    comment: string,
    actualEffort?: number
  ) => {
    if (!selectedProject) return;

    const { error } = await supabase
      .from("projects")
      .update({
        feedback_rating: rating,
        feedback_comment: comment,
        actual_effort: actualEffort,
        updated_at: new Date().toISOString(),
      })
      .eq("id", selectedProject.id);

    if (!error) {
      fetchProjects();
      setShowFeedback(false);
      setSelectedProject(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading projects...</p>
        </div>
      </div>
    );
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
            <p className="text-gray-500">
              No projects found. Create your first prediction!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onFeedbackClick={(project) => {
                setSelectedProject(project);
                setShowFeedback(true);
              }}
            />
          ))}
        </div>
      )}

      {showFeedback && selectedProject && (
        <FeedbackDialog
          project={selectedProject}
          onSubmit={handleFeedbackSubmit}
          onClose={() => {
            setShowFeedback(false);
            setSelectedProject(null);
          }}
        />
      )}
    </div>
  );
}
