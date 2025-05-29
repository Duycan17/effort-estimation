"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight, Save } from "lucide-react";
import { PredictionResult } from "@/components/prediction-result";
import { SaveProjectDialog } from "@/components/save-project-dialog";
import { DatasetSelect } from "@/components/dataset-select";
import { ChinaForm } from "@/components/forms/china-form";
import { DesharnaisForm } from "@/components/forms/desharnais-form";
import { AlbrechtForm } from "@/components/forms/albrecht-form";
import { CocomoForm } from "@/components/forms/cocomo-form";
import {
  predictChina,
  predictDesharnais,
  predictAlbrecht,
  predictCocomo,
  explainChina,
  explainDesharnais,
  explainAlbrecht,
  explainCocomo,
  type Dataset,
} from "@/lib/prediction";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface EffortPredictionFormProps {
  user: User;
}

export function EffortPredictionForm({ user }: EffortPredictionFormProps) {
  const [selectedDataset, setSelectedDataset] = useState<Dataset>("china");
  const [result, setResult] = useState<{
    explanation?: {
      prediction: number;
      feature_importance: Array<{
        feature: string;
        importance: number;
      }>;
    };
    prediction?: number;
    success: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [currentFormValues, setCurrentFormValues] = useState<any>(null);

  const supabase = createClient();

  // Handle form submission
  async function onSubmit(values: any) {
    setIsLoading(true);
    setError(null);

    try {
      let response;

      switch (selectedDataset) {
        case "china":
          response = await explainChina(values);
          break;
        case "desharnais":
          response = await explainDesharnais(values);
          break;
        case "albrecht":
          response = await explainAlbrecht(values);
          break;
        case "cocomo":
          response = await explainCocomo(values);
          break;
      }

      setResult(response);
      setCurrentFormValues(values);
    } catch (err) {
      setError(
        "An error occurred while calculating the prediction. Please try again."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle saving project
  const handleSaveProject = async (name: string, description: string) => {
    if (!currentFormValues || !result) return;

    const { error } = await supabase.from("projects").insert({
      user_id: user.id,
      name,
      description,
      dataset: selectedDataset,
      input_values: currentFormValues,
      predicted_effort: Math.abs(
        result.explanation?.prediction || Math.abs(result.prediction || 0)
      ),
    });

    if (error) {
      setError("Failed to save project. Please try again.");
    } else {
      setShowSaveDialog(false);
    }
  };

  // Reset the form and results
  function handleReset() {
    setResult(null);
    setError(null);
    setCurrentFormValues(null);
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <DatasetSelect
              value={selectedDataset}
              onValueChange={setSelectedDataset}
            />
          </div>

          {selectedDataset === "china" && <ChinaForm onSubmit={onSubmit} />}
          {selectedDataset === "desharnais" && (
            <DesharnaisForm onSubmit={onSubmit} />
          )}
          {selectedDataset === "albrecht" && (
            <AlbrechtForm onSubmit={onSubmit} />
          )}
          {selectedDataset === "cocomo" && <CocomoForm onSubmit={onSubmit} />}

          {error && (
            <Alert variant="destructive" className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end space-x-4 mt-6">
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="gap-2"
              onClick={() => {
                const form = document.querySelector("form");
                if (form) {
                  form.requestSubmit();
                }
              }}>
              {isLoading ? "Calculating..." : "Predict Effort"}
              {!isLoading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result !== null && (
        <div className="space-y-4">
          <PredictionResult result={result} />
          <div className="flex justify-center">
            <Button onClick={() => setShowSaveDialog(true)} className="gap-2">
              <Save className="h-4 w-4" />
              Save Project
            </Button>
          </div>
        </div>
      )}

      {showSaveDialog && currentFormValues && result !== null && (
        <SaveProjectDialog
          formValues={currentFormValues}
          predictedEffort={
            result.explanation?.prediction || result.prediction || 0
          }
          onSave={handleSaveProject}
          onClose={() => setShowSaveDialog(false)}
        />
      )}
    </div>
  );
}
