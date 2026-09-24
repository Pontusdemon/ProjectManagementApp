import { useState } from "react"
import type { Task, TaskStatus } from "@/types/domain"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TaskCard from "./TaskCard"
import TaskDetailsDialog from "./TaskDetailsDialog"

const columns: { status: TaskStatus; title: string }[] = [
    { status: "todo", title: "To Do" },
    { status: "in-progress", title: "In Progress" },
    { status: "review", title: "Review" },
    { status: "done", title: "Done" },
]

interface KanbanBoardProps {
    tasks: Task[]
}

const KanbanBoard = ({ tasks }: KanbanBoardProps) => {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    return (
        <>
            <div className="-mx-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0">
                <div className="grid min-w-[1040px] grid-cols-4 gap-4">
                    {columns.map((column) => {
                        const columnTasks = tasks.filter((task) => task.status === column.status)

                        return (
                            <section key={column.status} aria-labelledby={`column-${column.status}`} className="min-w-0">
                                <Card className="h-full bg-muted/30">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between gap-2">
                                            <CardTitle id={`column-${column.status}`}> {column.title} </CardTitle>
                                            <span className="rounded-full bg-background px-2 py-0.5 text-xs tabular-nums text-muted-foreground"
                                            aria-label={`${columnTasks.length} tasks`}>
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
                                                    onOpen={() => setSelectedTask(task)}
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
                task={selectedTask}
                open={selectedTask !== null}
                onOpenChange={(open) => {
                    if (!open) setSelectedTask(null)
                }}
            />
        </>
    )
}

export default KanbanBoard
