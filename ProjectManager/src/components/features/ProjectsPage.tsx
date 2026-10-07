import { useState } from "react"
import { ArrowUpRight, Pencil, Plus, Trash2 } from "lucide-react"
import { Link } from "react-router"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PROJECT_COLOR_DOT_CLASS } from "@/lib/constants"
import { todayIso } from "@/lib/dates"
import { createId } from "@/lib/ids"
import { getProjectProgress } from "@/lib/selectors"
import { useAppState } from "@/state/app-state-context"
import type { Project } from "@/types/domain"
import ConfirmDialog from "./ConfirmDialog"
import ProjectFormDialog from "./ProjectFormDialog"

type ProjectDraft = Pick<Project, "name" | "description" | "color">

const ProjectsPage = () => {
  const { state, actions } = useAppState()
  const { projects, tasks } = state
  const [formOpen, setFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | undefined>()
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)

  const openCreateForm = () => {
    setEditingProject(undefined)
    setFormOpen(true)
  }

  const openEditForm = (project: Project) => {
    setEditingProject(project)
    setFormOpen(true)
  }

  const saveProject = (draft: ProjectDraft) => {
    if (editingProject) {
      actions.updateProject({ ...editingProject, ...draft })
    } else {
      actions.createProject({
        id: createId("project"),
        ...draft,
        createdAt: todayIso(),
      })
    }

    setFormOpen(false)
  }

  const deleteProject = () => {
    if (projectToDelete) {
      actions.deleteProject(projectToDelete.id)
    }
    setProjectToDelete(null)
  }

  const relatedTaskCount = projectToDelete
    ? tasks.filter((task) => task.projectId === projectToDelete.id).length
    : 0

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse your team&apos;s current work.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline">{projects.length} projects</Badge>
          <Button type="button" onClick={openCreateForm}>
            <Plus aria-hidden="true" />
            New Project
          </Button>
        </div>
      </header>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-10 text-center">
            <p className="font-medium">No projects yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Projects will appear here when they are available.
            </p>
            <Button type="button" className="mt-4" onClick={openCreateForm}>
              <Plus aria-hidden="true" />
              Create your first project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => {
            const progress = getProjectProgress(tasks, project.id)

            return (
              <li key={project.id}>
                <Card className="h-full transition-colors hover:bg-muted/20">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        to={`/projects/${project.id}`}
                        className="group min-w-0 flex-1 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <CardTitle className="flex items-center gap-2 truncate">
                            <span
                              aria-hidden="true"
                              className={`size-2.5 shrink-0 rounded-full ${PROJECT_COLOR_DOT_CLASS[project.color]}`}
                            />
                            <span className="truncate">{project.name}</span>
                          </CardTitle>
                          <ArrowUpRight
                            aria-hidden="true"
                            className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-y-0.5 group-hover:translate-x-0.5"
                          />
                        </div>
                        <CardDescription className="mt-2 line-clamp-2">
                          {project.description || "No description provided."}
                        </CardDescription>
                      </Link>

                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          aria-label={`Edit ${project.name}`}
                          onClick={() => openEditForm(project)}
                        >
                          <Pencil aria-hidden="true" />
                        </Button>
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          aria-label={`Delete ${project.name}`}
                          onClick={() => setProjectToDelete(project)}
                        >
                          <Trash2 aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="mt-auto space-y-3">
                    <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                      <span>
                        {progress.completed} of {progress.total} tasks complete
                      </span>
                      <span className="tabular-nums">{progress.percentage}%</span>
                    </div>
                    <Progress value={progress.percentage} aria-label={`${project.name} progress`} />
                  </CardContent>
                </Card>
              </li>
            )
          })}
        </ul>
      )}

      <ProjectFormDialog
        key={editingProject?.id ?? "new-project"}
        open={formOpen}
        onOpenChange={setFormOpen}
        project={editingProject}
        onSave={saveProject}
      />

      <ConfirmDialog
        open={projectToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setProjectToDelete(null)
        }}
        title={`Delete ${projectToDelete?.name ?? "project"}?`}
        description={
          relatedTaskCount === 0
            ? "This removes the project and its comments from the current demo session. Refreshing restores the original seed data."
            : `This removes the project, its ${relatedTaskCount} related tasks, and their comments from the current demo session. Refreshing restores the original seed data.`
        }
        confirmLabel="Delete project"
        onConfirm={deleteProject}
      />
    </div>
  )
}

export default ProjectsPage
