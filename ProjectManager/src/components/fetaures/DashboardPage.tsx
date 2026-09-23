import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import { isBefore, parseISO, startOfToday } from "date-fns"
import { projects, tasks, users } from "@/types/Seeddata"

const DashboardPage = () => {
    const totalProjects  = projects.length
    const totalTasks = tasks.length
    const completedTasks = tasks.filter((task) => task.status === "done").length

    const overdueTasks = tasks.filter(
    (task) =>
      task.status !== "done" &&
      task.dueDate &&
      isBefore(parseISO(task.dueDate), startOfToday())
  )

  const overdueTaskCount = overdueTasks.length

	return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">

        {/* 1. Overview */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                    Good morning, Pontus
                </h1>
                <p className="mt-1 text-sm text-muted-foreground ">
                    Here&apos;s what needs your attention today.
                </p>
            </div>

            <button className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground sm:w-auto">
                New Project
            </button>
        </section>

        <Separator />

        {/* 2. Statistics: one card per row on mobile */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Card className="p-4">{totalProjects} Projects</Card>
            <Card className="p-4">{totalTasks} Open Tasks</Card>
            <Card className="p-4">{completedTasks} Completed</Card>
            <Card className="p-4">{overdueTaskCount} Overdue</Card>
        </section>

        <Separator />
        {/* Mobile: Due soon, then Project progress. Desktop: reversed. */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="order-2 p-6 lg:order-1">
                Project Progress
            </Card>
            <Card className="order-1 p-6 lg:order-2">
                Due Soon
            </Card>
        </section>

        <Separator />
        {/* 5. Lowest-priority overview information */}
        <section>
            <Card className="p-6">
                Recent Activity
            </Card>
        </section>
    </div>
    )
};

export default DashboardPage;