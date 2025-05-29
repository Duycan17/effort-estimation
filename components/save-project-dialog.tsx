"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { FormValues } from "@/lib/types"

interface SaveProjectDialogProps {
  formValues: FormValues
  predictedEffort: number
  onSave: (name: string, description: string) => void
  onClose: () => void
}

export function SaveProjectDialog({ formValues, predictedEffort, onSave, onClose }: SaveProjectDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = () => {
    if (!name.trim()) return
    onSave(name.trim(), description.trim())
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Project</DialogTitle>
          <DialogDescription>Save this prediction to your project history for future reference.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Project Name *</Label>
            <Input id="name" placeholder="Enter project name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the project..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium">Prediction Summary</p>
            <p className="text-sm text-gray-600">Estimated Effort: {predictedEffort.toFixed(1)} person-days</p>
            <p className="text-sm text-gray-600">
              AFP: {formValues.afp}, Duration: {formValues.duration} months
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            Save Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
