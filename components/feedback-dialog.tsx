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
import { Star } from "lucide-react"
import type { Project } from "@/lib/types"

interface FeedbackDialogProps {
  project: Project
  onSubmit: (rating: number, comment: string, actualEffort?: number) => void
  onClose: () => void
}

export function FeedbackDialog({ project, onSubmit, onClose }: FeedbackDialogProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [actualEffort, setActualEffort] = useState("")
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleSubmit = () => {
    if (rating === 0) return

    const actualEffortNum = actualEffort ? Number.parseFloat(actualEffort) : undefined
    onSubmit(rating, comment, actualEffortNum)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Provide Feedback</DialogTitle>
          <DialogDescription>How accurate was the prediction for "{project.name}"?</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Prediction Accuracy Rating</Label>
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">1 = Very inaccurate, 5 = Very accurate</p>
          </div>

          <div>
            <Label htmlFor="actualEffort">Actual Effort (optional)</Label>
            <Input
              id="actualEffort"
              type="number"
              placeholder="Enter actual effort if known"
              value={actualEffort}
              onChange={(e) => setActualEffort(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">Predicted: {project.predicted_effort.toFixed(1)} person-days</p>
          </div>

          <div>
            <Label htmlFor="comment">Comments (optional)</Label>
            <Textarea
              id="comment"
              placeholder="Share your thoughts about the prediction accuracy..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={rating === 0}>
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
