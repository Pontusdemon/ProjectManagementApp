import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { useAppState } from "@/state/app-state-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PRIORITY_BADGE_VARIANT, TASK_PRIORITY_LABELS } from "@/lib/constants"
import { formatDate } from "@/lib/dates"
import { getProjectById, getTaskById, getUserById } from "@/lib/selectors"
import TaskFormDialog from "./TaskFormDialog"
import TaskStatusMenu from "./TaskStatusMenu"
import ConfirmDialog from "./ConfirmDialog"
import CommentSection from "./CommentSection"

interface TaskDetailsDialogProps {
  taskId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const TaskDetailsDialog = ({
  taskId,
  open,
  onOpenChange,
}: TaskDetailsDialogProps) => {
  const { state, actions } = useAppState()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const task = getTaskById(state.tasks, taskId)
  const project = task ? getProjectById(state.projects, task.projectId) : undefined
  const assignee = task ? getUserById(state.users, task.assigneeId) : undefined

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          {task ? (
          <>
            <DialogHeader className="pr-8">
              <DialogTitle>{task.title}</DialogTitle>
              <DialogDescription>
                {project?.name ?? "Unknown project"}
              </DialogDescription>
            </DialogHeader>

            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {task.description || "No description provided."}
            </p>

            <dl className="grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-2">
              <div className="space-y-1">
                <dt className="text-xs text-muted-foreground">Status</dt>
                <dd>
                  <TaskStatusMenu task={task} className="w-full" />
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs text-muted-foreground">Priority</dt>
                <dd>
                  <Badge variant={PRIORITY_BADGE_VARIANT[task.priority]}>
                    {TASK_PRIORITY_LABELS[task.priority]}
                  </Badge>
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs text-muted-foreground">Assignee</dt>
                <dd className="text-sm">{assignee?.name ?? "Unassigned"}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs text-muted-foreground">Due date</dt>
                <dd className="text-sm">
                  {task.dueDate ? formatDate(task.dueDate) : "No due date"}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs text-muted-foreground">Created</dt>
                <dd className="text-sm">{formatDate(task.createdAt)}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs text-muted-foreground">Last updated</dt>
                <dd className="text-sm">{formatDate(task.updatedAt)}</dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-2 border-t pt-4">
              <Button type="button" variant="outline" onClick={() => setEditOpen(true)}>
                <Pencil aria-hidden="true" />
                Edit task
              </Button>
              <Button type="button" variant="destructive" onClick={() => setDeleteOpen(true)}>
                <Trash2 aria-hidden="true" />
                Delete task
              </Button>
            </div>

            <CommentSection taskId={task.id} />
          </>
          ) : (
            <DialogHeader className="pr-8">
              <DialogTitle>Task not found</DialogTitle>
              <DialogDescription>
                This task may have been deleted. Close this dialog to continue.
              </DialogDescription>
            </DialogHeader>
          )}
        </DialogContent>
      </Dialog>

      {task && (
        <>
          <TaskFormDialog
            key={task.id}
            open={editOpen}
            onOpenChange={setEditOpen}
            fixedProjectId={task.projectId}
            task={task}
            onSave={(draft) => {
              actions.updateTask({
                ...task,
                ...draft,
                updatedAt: new Date().toISOString(),
              })
              setEditOpen(false)
            }}
          />

          <ConfirmDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            title={`Delete ${task.title}?`}
            description="This also deletes the comments on this task. This cannot be undone."
            confirmLabel="Delete task"
            onConfirm={() => {
              onOpenChange(false)
              setDeleteOpen(false)
              actions.deleteTask(task.id)
            }}
          />
        </>
      )}
    </>
  )
}

export default TaskDetailsDialog
