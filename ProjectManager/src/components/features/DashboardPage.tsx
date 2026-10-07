import { Plus } from "lucide-react"
import { Link } from "react-router"
import { useState } from "react"
import { useAppState } from "@/state/app-state-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { formatDueLabel, formatShortDate, isTaskOverdue } from "@/lib/dates"
import {
  getDashboardStats,
  getDueSoonTasks,
  getInitials,
  getProjectById,
  getProjectProgress,
  getUserById,
} from "@/lib/selectors"
import ProjectFormDialog from "./ProjectFormDialog"

function getGreeting(): string {
  const hour = new Date().getHours()

  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

const DashboardPage = () => {
  const { state, actions } = useAppState()
  const [projectFormOpen, setProjectFormOpen] = useState(false)
  const { comments, currentUserId, projects, tasks, users } = state

  const stats = getDashboardStats(projects, tasks)
  const currentUser = getUserById(users, currentUserId) ?? users[0]
  const dueSoonTasks = getDueSoonTasks(tasks, 7).slice(0, 5)
  const recentComments = [...comments]
    .sort(
      (first, second) =>
        new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
    )
    .slice(0, 5)

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {getGreeting()}, {currentUser?.name ?? "there"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s what needs your attention today.
          </p>
        </div>
        <Button render={<Link to="/projects" />} type="button" nativeButton={false}>
          <Plus aria-hidden="true" />
          New Project
        </Button>
      </section>

      <Separator />

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-4">
          <div className="text-2xl font-semibold">{stats.totalProjects}</div>
          <div className="text-sm text-muted-foreground">Projects</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-semibold">{stats.openTasks}</div>
          <div className="text-sm text-muted-foreground">Open Tasks</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-semibold">{stats.completedTasks}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-semibold">{stats.overdueTasks}</div>
          <div className="text-sm text-muted-foreground">Overdue</div>
        </Card>
      </section>

      <Separator />

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="order-2 lg:order-1">
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {projects.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No projects yet. Create one to start tracking work.
              </p>
            ) : (
              projects.map((project) => {
                const progress = getProjectProgress(tasks, project.id)

                return (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="block space-y-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{project.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {progress.completed} of {progress.total} tasks complete
                        </p>
                      </div>
                      <span className="text-sm tabular-nums text-muted-foreground">
                        {progress.percentage}%
                      </span>
                    </div>
                    <Progress value={progress.percentage} aria-label={`${project.name} progress`} />
                  </Link>
                )
              })
            )}
          </CardContent>
        </Card>

        <Card className="order-1 lg:order-2">
          <CardHeader>
            <CardTitle>Due Soon</CardTitle>
          </CardHeader>
          <CardContent>
            {dueSoonTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nothing due in the next 7 days.
              </p>
            ) : (
              <ul className="space-y-4">
                {dueSoonTasks.map((task) => {
                  const assignee = getUserById(users, task.assigneeId)
                  const project = getProjectById(projects, task.projectId)
                  const overdue = isTaskOverdue(task)

                  return (
                    <li key={task.id}>
                      <Link
                        to={`/projects/${task.projectId}`}
                        className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <Avatar size="sm">
                          <AvatarFallback>{getInitials(assignee?.name ?? "Unassigned")}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{task.title}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {project?.name ?? "Unknown project"}
                            {assignee ? ` · ${assignee.name}` : " · Unassigned"}
                          </p>
                        </div>
                        <Badge variant={overdue ? "destructive" : "outline"}>
                          {task.dueDate ? formatDueLabel(task.dueDate) : "No due date"}
                        </Badge>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentComments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No recent activity yet.
              </p>
            ) : (
              <ul className="space-y-5">
                {recentComments.map((comment) => {
                  const author = getUserById(users, comment.authorId)
                  const task = tasks.find((item) => item.id === comment.taskId)

                  return (
                    <li key={comment.id} className="flex items-start gap-3">
                      <Avatar size="sm">
                        <AvatarFallback>{getInitials(author?.name ?? "Team")}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{author?.name ?? "A team member"}</span>{" "}
                          commented on <span className="font-medium">{task?.title ?? "a task"}</span>
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">{comment.body}</p>
                      </div>
                      <time className="shrink-0 text-xs text-muted-foreground" dateTime={comment.createdAt}>
                        {formatShortDate(comment.createdAt)}
                      </time>
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>

      <ProjectFormDialog
        open={projectFormOpen}
        onOpenChange={setProjectFormOpen}
        onSave={(draft) => {
          actions.createProject({
            id: `project-${crypto.randomUUID()}`,
            ...draft,
            createdAt: new Date().toISOString().slice(0, 10),
          })
          setProjectFormOpen(false)
        }}
      />
    </div>
  )
}

export default DashboardPage
