import { format, parseISO } from "date-fns"
import type { Task } from "@/types/domain"
import { projects, users } from "@/types/Seeddata"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const statusLabels = {
  todo: "To Do",
  "in-progress": "In Progress",
  review: "Review",
  done: "Done",
} satisfies Record<Task["status"], string>

interface TaskDetailsDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const TaskDetailsDialog = ({
  task,
  open,
  onOpenChange,
}: TaskDetailsDialogProps) => {
  const assignee = task
    ? users.find((user) => user.id === task.assigneeId)
    : undefined
  const project = task
    ? projects.find((item) => item.id === task.projectId)
    : undefined

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        {task && (
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
                  <Badge variant="outline">{statusLabels[task.status]}</Badge>
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs text-muted-foreground">Priority</dt>
                <dd>
                  <Badge variant="secondary" className="capitalize">
                    {task.priority}
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
                  {task.dueDate
                    ? format(parseISO(task.dueDate), "MMM d, yyyy")
                    : "No due date"}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs text-muted-foreground">Created</dt>
                <dd className="text-sm">
                  {format(parseISO(task.createdAt), "MMM d, yyyy")}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs text-muted-foreground">Last updated</dt>
                <dd className="text-sm">
                  {format(parseISO(task.updatedAt), "MMM d, yyyy")}
                </dd>
              </div>
            </dl>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default TaskDetailsDialog
