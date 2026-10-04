import {
  PROJECT_COLOR_VALUES,
  TASK_PRIORITY_VALUES,
  TASK_STATUS_VALUES,
  type ProjectColor,
  type TaskPriority,
  type TaskStatus,
} from "@/types/domain"

export { PROJECT_COLOR_VALUES, TASK_PRIORITY_VALUES, TASK_STATUS_VALUES }

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  review: "Review",
  done: "Done",
}

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
}

export const PROJECT_COLOR_LABELS: Record<ProjectColor, string> = {
  violet: "Violet",
  sky: "Sky",
  emerald: "Emerald",
  amber: "Amber",
}

export const PROJECT_COLOR_DOT_CLASS: Record<ProjectColor, string> = {
  violet: "bg-violet-500",
  sky: "bg-sky-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
}

export type PriorityBadgeVariant = "outline" | "secondary" | "destructive"

export const PRIORITY_BADGE_VARIANT: Record<TaskPriority, PriorityBadgeVariant> = {
  low: "outline",
  medium: "secondary",
  high: "destructive",
}

export interface TaskColumn {
  status: TaskStatus
  title: string
}

/** The board's column order and titles. The single source of truth for both. */
export const TASK_COLUMNS: readonly TaskColumn[] = TASK_STATUS_VALUES.map((status) => ({
  status,
  title: TASK_STATUS_LABELS[status],
}))
