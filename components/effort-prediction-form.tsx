"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ArrowRight, Save } from "lucide-react"
import { PredictionResult } from "@/components/prediction-result"
import { SaveProjectDialog } from "@/components/save-project-dialog"
import { predictEffort } from "@/lib/prediction"
import type { User } from "@supabase/supabase-js"

// Define the form schema with validation
const formSchema = z.object({
  afp: z.coerce.number().nonnegative("AFP must be a positive number"),
  input: z.coerce.number().nonnegative("Input must be a positive number"),
  output: z.coerce.number().nonnegative("Output must be a positive number"),
  enquiry: z.coerce.number().nonnegative("Enquiry must be a positive number"),
  file: z.coerce.number().nonnegative("File must be a positive number"),
  interface: z.coerce.number().nonnegative("Interface must be a positive number"),
  resource: z.coerce.number().nonnegative("Resource must be a positive number"),
  duration: z.coerce.number().nonnegative("Duration must be a positive number"),
})

interface EffortPredictionFormProps {
  user: User
}

export type FormValues = z.infer<typeof formSchema>

export function EffortPredictionForm({ user }: EffortPredictionFormProps) {
  const [result, setResult] = useState<{
    explanation: {
      prediction: number;
      feature_importance: Array<{
        feature: string;
        importance: number;
      }>;
    };
    success: boolean;
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [currentFormValues, setCurrentFormValues] = useState<FormValues | null>(null)

  const supabase = createClient()

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      afp: 0,
      input: 0,
      output: 0,
      enquiry: 0,
      file: 0,
      interface: 0,
      resource: 0,
      duration: 0,
    },
  })

  // Handle form submission
  async function onSubmit(values: FormValues) {
    setIsLoading(true)
    setError(null)

    try {
      // Calculate prediction
      const predictionResponse = await predictEffort(values)
      setResult(predictionResponse)
      setCurrentFormValues(values)
    } catch (err) {
      setError("An error occurred while calculating the prediction. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle saving project
  const handleSaveProject = async (name: string, description: string) => {
    if (!currentFormValues || !result) return

    const { error } = await supabase.from("projects").insert({
      user_id: user.id,
      name,
      description,
      afp: currentFormValues.afp,
      input: currentFormValues.input,
      output: currentFormValues.output,
      enquiry: currentFormValues.enquiry,
      file: currentFormValues.file,
      interface: currentFormValues.interface,
      resource: currentFormValues.resource,
      duration: currentFormValues.duration,
      predicted_effort: result.explanation.prediction,
    })

    if (error) {
      setError("Failed to save project. Please try again.")
    } else {
      setShowSaveDialog(false)
      // You could show a success message here
    }
  }

  // Reset the form and results
  function handleReset() {
    form.reset()
    setResult(null)
    setError(null)
    setCurrentFormValues(null)
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="afp"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>AFP</FormLabel>
                        <div className="text-xs text-slate-500">(Adjusted Function Points)</div>
                      </div>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="input"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>Input</FormLabel>
                        <div className="text-xs text-slate-500">(Number of input types)</div>
                      </div>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="output"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>Output</FormLabel>
                        <div className="text-xs text-slate-500">(Number of output types)</div>
                      </div>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enquiry"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>Enquiry</FormLabel>
                        <div className="text-xs text-slate-500">(Number of enquiry types)</div>
                      </div>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>File</FormLabel>
                        <div className="text-xs text-slate-500">(Number of logical files)</div>
                      </div>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interface"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>Interface</FormLabel>
                        <div className="text-xs text-slate-500">(Number of external interfaces)</div>
                      </div>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="resource"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>Resource</FormLabel>
                        <div className="text-xs text-slate-500">(Number of resources allocated)</div>
                      </div>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>Duration</FormLabel>
                        <div className="text-xs text-slate-500">(Expected duration in months)</div>
                      </div>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="text-center text-sm text-slate-500">
                All fields are required and must be non-negative numbers
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={handleReset}>
                  Reset
                </Button>
                <Button type="submit" disabled={isLoading} className="gap-2">
                  {isLoading ? "Calculating..." : "Predict Effort"}
                  {!isLoading && <ArrowRight className="h-4 w-4" />}
                </Button>
              </div>
            </form>
          </Form>
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
          predictedEffort={result.explanation.prediction}
          onSave={handleSaveProject}
          onClose={() => setShowSaveDialog(false)}
        />
      )}
    </div>
  )
}
