import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TASK_COLUMNS } from "@/lib/constants"
import { groupTasksByStatus } from "@/lib/selectors"
import { useAppState } from "@/state/app-state-context"
import type { Task, TaskStatus } from "@/types/domain"
import TaskCard from "./TaskCard"
import TaskDetailsDialog from "./TaskDetailsDialog"

interface KanbanBoardProps {
  tasks: Task[]
}

const KanbanBoard = ({ tasks }: KanbanBoardProps) => {
  const { actions } = useAppState()
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  const tasksByStatus = groupTasksByStatus(tasks)

  const handleDropToStatus = (status: TaskStatus) => {
    if (!draggedTaskId) return
    actions.moveTask(draggedTaskId, status)
    setDraggedTaskId(null)
  }

  return (
    <>
      <div className="-mx-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0">
        <div className="grid min-w-[1040px] grid-cols-4 gap-4">
          {TASK_COLUMNS.map((column) => {
            const columnTasks = tasksByStatus[column.status]

            return (
              <section
                key={column.status}
                aria-labelledby={`column-${column.status}`}
                className="min-w-0"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault()
                  handleDropToStatus(column.status)
                }}
              >
                <Card className="h-full bg-muted/30">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle id={`column-${column.status}`}> {column.title} </CardTitle>
                      <span
                        className="rounded-full bg-background px-2 py-0.5 text-xs tabular-nums text-muted-foreground"
                        aria-label={`${columnTasks.length} tasks`}
                      >
                        {columnTasks.length}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {columnTasks.length === 0 ? (
                      <p className="rounded-lg border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">
                        No tasks in this column.
                      </p>
                    ) : (
                      columnTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onOpen={() => setSelectedTaskId(task.id)}
                          onDragStart={(taskId) => setDraggedTaskId(taskId)}
                          onDragEnd={() => setDraggedTaskId(null)}
                        />
                      ))
                    )}
                  </CardContent>
                </Card>
              </section>
            )
          })}
        </div>
      </div>
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

export default KanbanBoard
