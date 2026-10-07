import { useMemo, useState } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  TASK_PRIORITY_LABELS,
  TASK_PRIORITY_VALUES,
  TASK_STATUS_LABELS,
  TASK_STATUS_VALUES,
} from "@/lib/constants"
import { createId } from "@/lib/ids"
import { useAppState } from "@/state/app-state-context"
import type { TaskPriority, TaskStatus } from "@/types/domain"
import TaskCard from "./TaskCard"
import TaskDetailsDialog from "./TaskDetailsDialog"
import TaskFormDialog, { type TaskDraft } from "./TaskFormDialog"

const TasksPage = () => {
  const { state, actions } = useAppState()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | TaskStatus>("all")
  const [priorityFilter, setPriorityFilter] = useState<"all" | TaskPriority>("all")
  const [assigneeFilter, setAssigneeFilter] = useState("all")
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase()

    return [...state.tasks]
      .filter((task) => {
        const matchesText =
          query.length === 0 ||
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)

        const matchesStatus = statusFilter === "all" || task.status === statusFilter
        const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
        const matchesAssignee =
          assigneeFilter === "all" || task.assigneeId === assigneeFilter

        return matchesText && matchesStatus && matchesPriority && matchesAssignee
      })
      .sort((first, second) => second.updatedAt.localeCompare(first.updatedAt))
  }, [assigneeFilter, priorityFilter, search, state.tasks, statusFilter])

  const handleCreateTask = (draft: TaskDraft) => {
    const now = new Date().toISOString()

    actions.createTask({
      id: createId("task"),
      projectId: draft.projectId,
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
            <p className="text-sm text-muted-foreground">
              Search, filter, and manage work across every project.
            </p>
          </div>

          <Button type="button" onClick={() => setCreateOpen(true)}>
            <Plus aria-hidden="true" className="size-4" />
            New task
          </Button>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
            <label className="relative block">
              <span className="sr-only">Search tasks</span>
              <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tasks..."
                className="pl-9"
              />
            </label>

            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter((value as "all" | TaskStatus) ?? "all")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {TASK_STATUS_VALUES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {TASK_STATUS_LABELS[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={priorityFilter}
              onValueChange={(value) => setPriorityFilter((value as "all" | TaskPriority) ?? "all")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Priority: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                {TASK_PRIORITY_VALUES.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {TASK_PRIORITY_LABELS[priority]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={assigneeFilter}
              onValueChange={(value) => setAssigneeFilter(value ?? "all")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Assignee: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All assignees</SelectItem>
                {state.users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-muted/20 p-8 text-center">
            <p className="text-lg font-medium">No tasks match the current filters.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting the search or creating a new task.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onOpen={() => setSelectedTaskId(task.id)}
              />
            ))}
          </div>
        )}
      </div>

      <TaskFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSave={handleCreateTask}
      />

      <TaskDetailsDialog
        taskId={selectedTaskId}
        open={selectedTaskId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedTaskId(null)
        }}
      />
    </>
  )
}

export default TasksPage
