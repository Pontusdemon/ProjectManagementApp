import { useState, type FormEvent } from "react"
import { z } from "zod"
import { useAppState } from "@/state/app-state-context"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
    TASK_PRIORITY_LABELS,
    TASK_PRIORITY_VALUES,
    TASK_STATUS_LABELS,
    TASK_STATUS_VALUES,
} from "@/lib/constants"
import { isValidDateOnly } from "@/lib/dates"
import type { Task, TaskPriority, TaskStatus } from "@/types/domain"

const UNASSIGNED = "unassigned"

const taskSchema = z.object({
    title: z.string().trim().min(1, "Enter a task title").max(120, "Use 120 characters or fewer"),
    description: z.string().trim().max(2000, "Use 2000 characters or fewer"),
    projectId: z.string().min(1, "Choose a project"),
    status: z.enum(TASK_STATUS_VALUES),
    priority: z.enum(TASK_PRIORITY_VALUES),
    assigneeId: z.string().transform((value) => (value === UNASSIGNED ? undefined : value)),
    dueDate: z.string().transform((value, context) => {
        if (value === "") return undefined
        if (!isValidDateOnly(value)) {
            context.addIssue({ code: "custom", message: "Enter a valid due date." })
            return z.NEVER
        }
        return value
    })
})

export type TaskDraft = Pick<
    Task,
    "projectId" | "title" | "description" | "status" | "priority" | "assigneeId" | "dueDate"
>
type TaskField = keyof z.input<typeof taskSchema>
type TaskFormValues = z.input<typeof taskSchema>

interface TaskFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    /** Locks the task to a project when the form is opened from that project. */
    fixedProjectId?: string
    /** Present when editing; omitted when creating. */
    task?: Task
    onSave: (draft: TaskDraft) => void
}

const TaskFormDialog = ({
    open,
    onOpenChange,
    fixedProjectId,
    task,
    onSave,
}: TaskFormDialogProps) => {
    const { state } = useAppState()
    const [values, setValues] = useState<TaskFormValues>(() => ({
        title: task?.title ?? "",
        description: task?.description ?? "",
        projectId: fixedProjectId ?? task?.projectId ?? "",
        status: task?.status ?? "todo",
        priority: task?.priority ?? "medium",
        assigneeId: task?.assigneeId ?? UNASSIGNED,
        dueDate: task?.dueDate ?? "",
    }))
    const [errors, setErrors] = useState<Partial<Record<TaskField, string>>>({})

    const setField = <K extends TaskField>(field: K, value: TaskFormValues[K]) => {
        setValues((current) => ({ ...current, [field]: value }))
        setErrors((current) => {
            if (!current[field]) return current
            const next = { ...current }
            delete next[field]
            return next
        })
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const result = taskSchema.safeParse({
            ...values,
            projectId: fixedProjectId ?? values.projectId,
        })

        if (!result.success) {
            const nextErrors: Partial<Record<TaskField, string>> = {}
            for (const issue of result.error.issues) {
                const field = issue.path[0]
                if (typeof field === "string" && field in taskSchema.shape) {
                    nextErrors[field as TaskField] ??= issue.message
                }
            }
            setErrors(nextErrors)
            return
        }

        setErrors({})
        onSave(result.data)
    }

    const titleError = errors.title
    const descriptionError = errors.description
    const projectError = errors.projectId
    const statusError = errors.status
    const priorityError = errors.priority
    const assigneeError = errors.assigneeId
    const dueDateError = errors.dueDate

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader className="pr-8">
                    <DialogTitle>{task ? "Edit task" : "Create task"}</DialogTitle>
                    <DialogDescription>
                        {task ? "Update the task details." : "Add a task to a project."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="task-title">Title</Label>
                            <Input
                                id="task-title"
                                value={values.title}
                                onChange={(event) => setField("title", event.target.value)}
                                maxLength={120}
                                required
                                aria-invalid={Boolean(titleError)}
                                aria-describedby={titleError ? "task-title-error" : undefined}
                                autoFocus
                            />
                            {titleError && <p id="task-title-error" className="text-sm text-destructive">{titleError}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="task-description">Description</Label>
                            <Textarea
                                id="task-description"
                                value={values.description}
                                onChange={(event) => setField("description", event.target.value)}
                                maxLength={2000}
                                aria-invalid={Boolean(descriptionError)}
                                aria-describedby={descriptionError ? "task-description-error" : undefined}
                                rows={4}
                            />
                            {descriptionError && <p id="task-description-error" className="text-sm text-destructive">{descriptionError}</p>}
                        </div>

                        {!fixedProjectId && (
                            <div className="space-y-2">
                                <Label htmlFor="task-project">Project</Label>
                                <Select
                                    value={values.projectId || null}
                                    items={state.projects.map((project) => ({ value: project.id, label: project.name }))}
                                    onValueChange={(value) => setField("projectId", value ?? "")}
                                >
                                    <SelectTrigger
                                        id="task-project"
                                        className="w-full"
                                        aria-invalid={Boolean(projectError)}
                                        aria-describedby={projectError ? "task-project-error" : undefined}
                                    >
                                        <SelectValue placeholder="Choose a project" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {state.projects.map((project) => (
                                            <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {projectError && <p id="task-project-error" className="text-sm text-destructive">{projectError}</p>}
                            </div>
                        )}

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="task-status">Status</Label>
                                <Select
                                    value={values.status}
                                    items={TASK_STATUS_VALUES.map((status) => ({
                                        value: status,
                                        label: TASK_STATUS_LABELS[status],
                                    }))}
                                    onValueChange={(value) => {
                                        if (value && TASK_STATUS_VALUES.includes(value as TaskStatus)) {
                                            setField("status", value as TaskStatus)
                                        }
                                    }}
                                >
                                    <SelectTrigger id="task-status" className="w-full" aria-invalid={Boolean(statusError)} aria-describedby={statusError ? "task-status-error" : undefined}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TASK_STATUS_VALUES.map((status) => (
                                            <SelectItem key={status} value={status}>{TASK_STATUS_LABELS[status]}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {statusError && <p id="task-status-error" className="text-sm text-destructive">{statusError}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="task-priority">Priority</Label>
                                <Select
                                    value={values.priority}
                                    items={TASK_PRIORITY_VALUES.map((priority) => ({
                                        value: priority,
                                        label: TASK_PRIORITY_LABELS[priority],
                                    }))}
                                    onValueChange={(value) => {
                                        if (value && TASK_PRIORITY_VALUES.includes(value as TaskPriority)) {
                                            setField("priority", value as TaskPriority)
                                        }
                                    }}
                                >
                                    <SelectTrigger id="task-priority" className="w-full" aria-invalid={Boolean(priorityError)} aria-describedby={priorityError ? "task-priority-error" : undefined}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TASK_PRIORITY_VALUES.map((priority) => (
                                            <SelectItem key={priority} value={priority}>{TASK_PRIORITY_LABELS[priority]}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {priorityError && <p id="task-priority-error" className="text-sm text-destructive">{priorityError}</p>}
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="task-assignee">Assignee</Label>
                                <Select
                                    value={values.assigneeId}
                                    items={[
                                        { value: UNASSIGNED, label: "Unassigned" },
                                        ...state.users.map((user) => ({ value: user.id, label: user.name })),
                                    ]}
                                    onValueChange={(value) => setField("assigneeId", value ?? UNASSIGNED)}
                                >
                                    <SelectTrigger id="task-assignee" className="w-full" aria-invalid={Boolean(assigneeError)} aria-describedby={assigneeError ? "task-assignee-error" : undefined}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
                                        {state.users.map((user) => (
                                            <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {assigneeError && <p id="task-assignee-error" className="text-sm text-destructive">{assigneeError}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="task-due-date">Due date</Label>
                                <Input
                                    id="task-due-date"
                                    type="date"
                                    value={values.dueDate}
                                    onChange={(event) => setField("dueDate", event.target.value)}
                                    aria-invalid={Boolean(dueDateError)}
                                    aria-describedby={dueDateError ? "task-due-date-error" : undefined}
                                />
                                {dueDateError && <p id="task-due-date-error" className="text-sm text-destructive">{dueDateError}</p>}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">{task ? "Save changes" : "Create task"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default TaskFormDialog