import { addDays, parseISO, startOfToday } from 'date-fns'
import type { Project, Task, TaskStatus, User } from '@/types/domain'
import { TASK_STATUS_VALUES } from '@/types/domain'
import { isTaskOverdue } from './dates'

export interface ProjectProgress {
    total: number
    completed: number
    percentage: number
}

export interface DashboardStats {
    totalProjects: number
    totalTasks: number
    openTasks: number
    completedTasks: number
    overdueTasks: number
}

export function getProjectTasks(tasks: readonly Task[], projectId: string): Task[] {
  return tasks.filter((task) => task.projectId === projectId)
}

export const getTasksForProject = getProjectTasks

export function getProjectProgress(tasks: readonly Task[], projectId: string): ProjectProgress {
    let total = 0
    let completed = 0

    for (const task of tasks) {
        if (task.projectId === projectId) {
            total += 1
            if (task.status === "done") completed += 1
        }
    }

    return {
        total,
        completed,
        // A project with no tasks is normal, not an error. Never produce NaN.
        percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
    }
}

export function getDashboardStats(projects: readonly Project[], tasks: readonly Task[]): DashboardStats {
    const completedTasks = tasks.filter((task) => task.status === "done").length

    return {
        totalProjects: projects.length,
        totalTasks: tasks.length,
        openTasks: tasks.length - completedTasks,
        completedTasks,
        overdueTasks: tasks.filter(isTaskOverdue).length,
    }
}

export function groupTasksByStatus(tasks: readonly Task[]): Record<TaskStatus, Task[]> {
    const grouped = Object.fromEntries(
        TASK_STATUS_VALUES.map((status) => [status, [] as Task[]])
    ) as Record<TaskStatus, Task[]>

    for (const task of tasks) {
        grouped[task.status].push(task)
  }

  return grouped
}

export function getOverdueTasks(tasks: readonly Task[]): Task[] {
  return tasks.filter(isTaskOverdue)
}

export function compareByDueDate(first: Task, second: Task): number {
  return (first.dueDate ?? "").localeCompare(second.dueDate ?? "")
}

/** Tasks due within `withinDays`, soonest first. Overdue tasks are included. */
export function getDueSoonTasks(tasks: readonly Task[], withinDays: number): Task[] {
  const limit = addDays(startOfToday(), withinDays)

  return tasks
    .filter((task) => {
      if (task.status === "done" || !task.dueDate) return false
      return parseISO(task.dueDate) <= limit
    })
    .sort(compareByDueDate)
}

export function getTaskById(
  tasks: readonly Task[],
  taskId: string | null | undefined
): Task | undefined {
  if (!taskId) return undefined
  return tasks.find((task) => task.id === taskId)
}

export function getUserById(
  users: readonly User[],
  userId: string | undefined
): User | undefined {
  if (!userId) return undefined
  return users.find((user) => user.id === userId)
}

export function getProjectById(
  projects: readonly Project[],
  projectId: string | undefined
): Project | undefined {
  if (!projectId) return undefined
  return projects.find((project) => project.id === projectId)
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}