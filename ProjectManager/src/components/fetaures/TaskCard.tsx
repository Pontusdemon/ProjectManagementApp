import { format, isBefore, parseISO, startOfToday } from "date-fns"
import { CalendarDays } from "lucide-react"
import type { Task } from "@/types/domain"
import { useAppState } from "@/components/context/app-state-provider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const priorityVariant = {
  low: "outline",
  medium: "secondary",
  high: "destructive",
} as const

interface TaskCardProps {
  task: Task
  onOpen: () => void
}

const TaskCard = ({ task, onOpen }: TaskCardProps) => {
  const { state } = useAppState()
  const { users } = state
  const assignee = users.find((user) => user.id === task.assigneeId)
  const initials = assignee
    ? assignee.name
        .split(" ")
        .map((part) => part[0])
        .join("")
    : "—"
  const isOverdue =
    task.status !== "done" &&
    task.dueDate !== undefined &&
    isBefore(parseISO(task.dueDate), startOfToday())

  return (
    <Card className="gap-0 py-0 transition-colors hover:bg-background">
      <CardContent className="space-y-3 p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium leading-snug">{task.title}</h3>
          <Badge variant={priorityVariant[task.priority]} className="capitalize">
            {task.priority}
          </Badge>
        </div>
        {task.dueDate && (
          <p
            className={`flex items-center gap-1.5 text-xs ${isOverdue ? "font-medium text-destructive" : "text-muted-foreground"}`}
          >
            <CalendarDays aria-hidden="true" className="size-3.5" />
            <time dateTime={task.dueDate}>
              {isOverdue ? "Overdue · " : "Due "}
              {format(parseISO(task.dueDate), "MMM d, yyyy")}
            </time>
          </p>
        )}
        <div className="flex items-center justify-between gap-2 border-t pt-2">
          <span className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
            <Avatar size="sm" aria-hidden="true">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="truncate">{assignee?.name ?? "Unassigned"}</span>
          </span>
          <Button type="button" variant="ghost" size="sm" onClick={onOpen}>
            View
            <span className="sr-only"> details for {task.title}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default TaskCard
