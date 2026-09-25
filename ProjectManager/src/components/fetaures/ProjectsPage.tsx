import { ArrowUpRight } from "lucide-react"
import { Link } from "react-router"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAppState } from "@/components/context/app-state-provider"

const ProjectsPage = () => {
  const { state } = useAppState()
  const { projects, tasks } = state

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse your team’s current work.
          </p>
        </div>
        <Badge variant="outline">{projects.length} projects</Badge>
      </header>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="font-medium">No projects yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Projects will appear here when they are available.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => {
            const projectTasks = tasks.filter(
              (task) => task.projectId === project.id
            )
            const completedCount = projectTasks.filter(
              (task) => task.status === "done"
            ).length
            const progress = projectTasks.length
              ? Math.round((completedCount / projectTasks.length) * 100)
              : 0

            return (
              <li key={project.id}>
                <Link
                  to={`/projects/${project.id}`}
                  className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Card className="h-full transition-colors group-hover:bg-muted/30">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <CardTitle className="truncate">{project.name}</CardTitle>
                          <CardDescription className="mt-2 line-clamp-2">
                            {project.description}
                          </CardDescription>
                        </div>
                        <ArrowUpRight
                          aria-hidden="true"
                          className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="mt-auto space-y-3">
                      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                        <span>
                          {completedCount} of {projectTasks.length} tasks complete
                        </span>
                        <span className="tabular-nums">{progress}%</span>
                      </div>
                      <Progress
                        value={progress}
                        aria-label={`${project.name} progress`}
                      />
                    </CardContent>
                  </Card>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default ProjectsPage
