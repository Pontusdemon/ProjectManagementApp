import { format, isBefore, isToday, isValid, parseISO, startOfToday } from 'date-fns'
import type { Task } from '@/types/domain'

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

/** Today as `YYYY-MM-DD`, the storage format for due dates. */
export function todayIso(): string {
    return format(startOfToday(), 'yyyy-MM-dd')
}

export function isValidDateOnly(value: string): boolean {
    if (!DATE_ONLY_PATTERN.test(value)) return false
    return isValid(parseISO(value))
}

export function isOverdueDate(dueDate: string): boolean {
    const due = parseISO(dueDate)
    return isValid(due) && isBefore(due, startOfToday())
}

/**
 * The one definition of "overdue" for the whole app:
 * a task that is not done and whose due date has passed.
 */
export function isTaskOverdue(task: Pick<Task, "dueDate" | "status">): boolean {
    if (task.status === "done" || !task.dueDate) return false
    return isOverdueDate(task.dueDate)
}

export function formatDate(value: string): string {
    const date = parseISO(value)
    return isValid(date) ? format(date, "MMM d, yyyy") : "—"
}

export function formatShortDate(value: string): string {
    const date = parseISO(value)
    return isValid(date) ? format(date, "MMM d") : "—"
}

export function formatDueLabel(dueDate: string): string {
    const due = parseISO(dueDate)
    if (!isValid(due)) return "—"
    if (isBefore(due, startOfToday())) return "Overdue"
    if (isToday(due)) return "Due today"
    return format(due, "MMM d")
}