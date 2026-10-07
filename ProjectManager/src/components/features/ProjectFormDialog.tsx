import { useState, type FormEvent } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PROJECT_COLOR_LABELS, PROJECT_COLOR_VALUES } from "@/lib/constants"
import type { Project } from "@/types/domain"

const projectSchema = z.object({
  name: z.string().trim().min(1, "Enter a project name.").max(80, "Use 80 characters or fewer."),
  description: z.string().trim().max(300, "Use 300 characters or fewer."),
  color: z.enum(PROJECT_COLOR_VALUES),
})

export type ProjectDraft = Pick<Project, "name" | "description" | "color">
type ProjectField = keyof ProjectDraft

interface ProjectFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: Project
  onSave: (draft: ProjectDraft) => void
}

const ProjectFormDialog = ({ open, onOpenChange, project, onSave }: ProjectFormDialogProps) => {
  const [errors, setErrors] = useState<Partial<Record<ProjectField, string>>>({})

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const result = projectSchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description"),
      color: formData.get("color"),
    })

    if (!result.success) {
      const nextErrors: Partial<Record<ProjectField, string>> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0]
        if (typeof field === "string" && field in projectSchema.shape) {
          nextErrors[field as ProjectField] ??= issue.message
        }
      }
      setErrors(nextErrors)
      return
    }

    setErrors({})
    onSave(result.data)
  }

  const nameError = errors.name
  const descriptionError = errors.description
  const colorError = errors.color

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="pr-8">
          <DialogTitle>{project ? "Edit project" : "Create project"}</DialogTitle>
          <DialogDescription>
            {project
              ? "Update the project name, description, or accent color."
              : "Add a project to organize its tasks and progress."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project name</Label>
              <Input
                id="project-name"
                name="name"
                defaultValue={project?.name ?? ""}
                maxLength={80}
                aria-invalid={Boolean(nameError)}
                aria-describedby={nameError ? "project-name-error" : undefined}
                autoFocus
              />
              {nameError && (
                <p id="project-name-error" className="text-sm text-destructive">
                  {nameError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-description">Description</Label>
              <Textarea
                id="project-description"
                name="description"
                defaultValue={project?.description ?? ""}
                maxLength={300}
                aria-invalid={Boolean(descriptionError)}
                aria-describedby={descriptionError ? "project-description-error" : undefined}
                rows={4}
              />
              {descriptionError && (
                <p id="project-description-error" className="text-sm text-destructive">
                  {descriptionError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-color">Accent color</Label>
              <select
                id="project-color"
                name="color"
                defaultValue={project?.color ?? "violet"}
                aria-invalid={Boolean(colorError)}
                aria-describedby={colorError ? "project-color-error" : undefined}
                className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {PROJECT_COLOR_VALUES.map((color) => (
                  <option key={color} value={color}>
                    {PROJECT_COLOR_LABELS[color]}
                  </option>
                ))}
              </select>
              {colorError && (
                <p id="project-color-error" className="text-sm text-destructive">
                  {colorError}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{project ? "Save changes" : "Create project"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ProjectFormDialog