import { ArrowUpRight, CalendarDays } from "lucide-react"
import { useAppState } from "@/state/app-state-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  PRIORITY_BADGE_VARIANT,
  TASK_PRIORITY_LABELS,
} from "@/lib/constants"
import { formatDate, isTaskOverdue } from "@/lib/dates"
import { getInitials, getUserById } from "@/lib/selectors"
import type { Task } from "@/types/domain"
import TaskStatusMenu from "./TaskStatusMenu"

interface TaskCardProps {
  task: Task
  onOpen: () => void
  onDragStart?: (taskId: string) => void
  onDragEnd?: () => void
}

const TaskCard = ({ task, onOpen, onDragStart, onDragEnd }: TaskCardProps) => {
  const { state } = useAppState()
  const assignee = getUserById(state.users, task.assigneeId)
  const overdue = isTaskOverdue(task)

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.effectAllowed = "move"
    event.dataTransfer.setData("application/task-id", task.id)
    event.dataTransfer.setData("text/plain", task.id)
    onDragStart?.(task.id)
  }

  const handleDragEnd = () => {
    onDragEnd?.()
  }

  return (
    <Card
      draggable={Boolean(onDragStart)}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="gap-0 py-0 transition-colors hover:bg-background"
    >
      <CardContent className="space-y-3 p-3">
        <div className="flex items-start justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onOpen}
            className="group h-auto min-w-0 flex-1 items-start justify-start gap-1 rounded-sm p-0 text-left text-sm font-medium leading-snug whitespace-normal hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="group-hover:underline">{task.title}</span>
            <ArrowUpRight
              aria-hidden="true"
              className="mt-0.5 size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
            />
          </Button>

          <Badge
            variant={PRIORITY_BADGE_VARIANT[task.priority]}
            className="shrink-0 capitalize"
          >
            {TASK_PRIORITY_LABELS[task.priority]}
          </Badge>
        </div>

        {task.dueDate && (
          <p
            className={`flex items-center gap-1.5 text-xs ${
              overdue ? "font-medium text-destructive" : "text-muted-foreground"
            }`}
          >
            <CalendarDays aria-hidden="true" className="size-3.5" />
            <time dateTime={task.dueDate}>
              {overdue ? "Overdue · " : "Due "}
              {formatDate(task.dueDate)}
            </time>
          </p>
        )}

        <div className="flex items-center justify-between gap-2 border-t pt-2">
          <span className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
            <Avatar size="sm" aria-hidden="true">
              <AvatarFallback>
                {assignee ? getInitials(assignee.name) : "—"}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">{assignee?.name ?? "Unassigned"}</span>
          </span>

          <TaskStatusMenu task={task} />
        </div>
      </CardContent>
    </Card>
  )
}

export default TaskCard
