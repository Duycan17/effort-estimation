import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Star } from "lucide-react";
import type {
  Project,
  CocomoInputs,
  AlbrechtInputs,
  ChinaInputs as ChinaInputType,
  DesharnaisInputs as DesharnaisInputType,
} from "@/lib/types";
import { CocomoInputs as CocomoInputsComponent } from "./project-inputs/cocomo-inputs";
import { AlbrechtInputs as AlbrechtInputsComponent } from "./project-inputs/albrecht-inputs";
import { ChinaInputs } from "./project-inputs/china-inputs";
import { DesharnaisInputs } from "./project-inputs/desharnais-inputs";

interface ProjectCardProps {
  project: Project;
  onFeedbackClick: (project: Project) => void;
}

const getEffortCategory = (effort: number) => {
  if (effort < 100)
    return { name: "Low", color: "bg-green-100 text-green-800" };
  if (effort < 300)
    return { name: "Medium", color: "bg-yellow-100 text-yellow-800" };
  if (effort < 600)
    return { name: "High", color: "bg-orange-100 text-orange-800" };
  return { name: "Very High", color: "bg-red-100 text-red-800" };
};

const getDatasetLabel = (dataset: string) => {
  switch (dataset) {
    case "china":
      return "China Dataset";
    case "desharnais":
      return "Desharnais Dataset";
    case "albrecht":
      return "Albrecht Dataset";
    case "cocomo":
      return "COCOMO Dataset";
    default:
      return dataset;
  }
};

export function ProjectCard({ project, onFeedbackClick }: ProjectCardProps) {
  const category = getEffortCategory(project.predicted_effort);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="py-2.5 px-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{project.name}</CardTitle>
              <Badge className={category.color}>{category.name}</Badge>
            </div>
            {project.description && (
              <p className="text-sm text-gray-600">{project.description}</p>
            )}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {getDatasetLabel(project.dataset)}
              </Badge>
              {project.feedback_rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs">{project.feedback_rating}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2 px-3 space-y-2">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
            <span className="text-sm text-gray-600">Predicted</span>
            <span className="text-sm font-bold">
              {project.predicted_effort.toFixed(1)} Person-Hours
            </span>
          </div>
          <div className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
            <span className="text-sm text-gray-600">Actual</span>
            <span
              className={`text-sm  ${
                project.actual_effort ? "font-bold" : "text-gray-500 italic"
              }`}>
              {project.actual_effort
                ? `${project.actual_effort.toFixed(1)} Person-Hours`
                : "Not yet evaluated"}
            </span>
          </div>
        </div>

        {project.dataset === "cocomo" && (
          <CocomoInputsComponent
            input_values={project.input_values as CocomoInputs}
          />
        )}
        {project.dataset === "albrecht" && (
          <AlbrechtInputsComponent
            input_values={project.input_values as AlbrechtInputs}
          />
        )}
        {project.dataset === "china" && (
          <ChinaInputs input_values={project.input_values as ChinaInputType} />
        )}
        {project.dataset === "desharnais" && (
          <DesharnaisInputs
            input_values={project.input_values as DesharnaisInputType}
          />
        )}

        <div className="flex items-center justify-between border-t pt-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(project.created_at).toLocaleDateString()}
          </div>
          {!project.feedback_rating && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => onFeedbackClick(project)}>
              Add Feedback
            </Button>
          )}
        </div>

        {project.feedback_comment && (
          <div className="text-xs text-gray-600 italic">
            "{project.feedback_comment}"
          </div>
        )}
      </CardContent>
    </Card>
  );
}
