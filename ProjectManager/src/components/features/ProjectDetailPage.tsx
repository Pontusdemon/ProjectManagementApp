import { useState } from "react"
import { ArrowLeft, Plus } from "lucide-react"
import { Link, useParams } from "react-router"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAppState } from "@/state/app-state-context"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { createId } from "@/lib/ids"
import KanbanBoard from "./KanbanBoard"
import TaskFormDialog, { type TaskDraft } from "./TaskFormDialog"

const ProjectDetailPage = () => {
    const { state, actions } = useAppState()
    const { projects, tasks } = state
    const { projectId } = useParams<{ projectId: string }>()
    const project = projects.find((item) => item.id === projectId)
    const [createOpen, setCreateOpen] = useState(false)

    if (!project) {
        return (
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
                <Link to="/projects" className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft aria-hidden="true" className="size-4" />
                    Back to projects
                </Link>

                <Card>
                    <CardHeader>
                        <CardTitle>Project not found</CardTitle>
                        <CardDescription>
                            This project may have been removed or the link may be incorrect
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    const projectTasks = tasks.filter((task) => task.projectId === project.id)
    const completedCount = projectTasks.filter((task) => task.status === "done").length
    const progress = projectTasks.length ? Math.round((completedCount / projectTasks.length) * 100) : 0

    const handleCreateTask = (draft: TaskDraft) => {
        const now = new Date().toISOString()

        actions.createTask({
            id: createId("task"),
            projectId: project.id,
            title: draft.title,
            description: draft.description,
            status: draft.status,
            priority: draft.priority,
            assigneeId: draft.assigneeId,
            dueDate: draft.dueDate,
            createdAt: now,
            updatedAt: now,
        })

        setCreateOpen(false)
    }

    return (
        <>
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
                <Link to="/projects" className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft aria-hidden="true" className="size-4" />
                    All projects
                </Link>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0 space-y-2">
                                <CardTitle className="text-xl"> {project.name} </CardTitle>
                                <CardDescription> {project.description} </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                    {projectTasks.length} {projectTasks.length === 1 ? "task" : "tasks"}
                                </Badge>
                                <Button type="button" onClick={() => setCreateOpen(true)}>
                                    <Plus aria-hidden="true" className="size-4" />
                                    Add task
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span> {completedCount} tasks completed</span>
                            <span className="tabular-nums"> {progress}% </span>
                        </div>
                        <Progress value={progress} aria-label={`${project.name} progress`} />
                    </CardContent>
                </Card>

                <section aria-labelledby="project-board-heading" className="space-y-3">
                    <div>
                        <h2 id="project-board-heading" className="text-lg font-semibold">
                            Board
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Tasks grouped by their current status.
                        </p>
                    </div>
                    <KanbanBoard tasks={projectTasks} />
                </section>
            </div>

            <TaskFormDialog
                key={`project-create-${project.id}`}
                open={createOpen}
                onOpenChange={setCreateOpen}
                fixedProjectId={project.id}
                onSave={handleCreateTask}
            />
        </>
    )
}

export default ProjectDetailPage
