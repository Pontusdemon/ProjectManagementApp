import { useAppState } from "@/state/app-state-context"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TASK_STATUS_LABELS, TASK_STATUS_VALUES } from "@/lib/constants"
import type { Task } from "@/types/domain"

const STATUS_ITEMS = TASK_STATUS_VALUES.map((status) => ({
  value: status,
  label: TASK_STATUS_LABELS[status],
}))

interface TaskStatusMenuProps {
  task: Task
  className?: string
}

const TaskStatusMenu = ({ task, className }: TaskStatusMenuProps) => {
  const { actions } = useAppState()

  return (
    <Select
      value={task.status}
      items={STATUS_ITEMS}
      onValueChange={(nextStatus) => {
        if (nextStatus !== null) actions.moveTask(task.id, nextStatus)
      }}
    >
      <SelectTrigger
        id={`task-status-${task.id}`}
        size="sm"
        className={className}
        aria-label={`Status for ${task.title}`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUS_ITEMS.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default TaskStatusMenu