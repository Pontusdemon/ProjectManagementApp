import { BriefcaseBusiness, Mail, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppState } from "@/state/app-state-context"
import { getInitials } from "@/lib/selectors"

const MembersPage = () => {
  const { state } = useAppState()

  const members = state.users
    .map((user) => {
      const assignedTasks = state.tasks.filter((task) => task.assigneeId === user.id)
      const completedTasks = assignedTasks.filter((task) => task.status === "done").length

      return {
        user,
        assignedTasks,
        completedTasks,
      }
    })
    .sort((first, second) => second.assignedTasks.length - first.assignedTasks.length)

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Team
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Members</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {members.map(({ user, assignedTasks, completedTasks }) => (
          <Card key={user.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {getInitials(user.name)}
                </div>
                <div className="min-w-0">
                  <CardTitle className="truncate text-base">{user.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-muted/40 p-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BriefcaseBusiness aria-hidden="true" className="size-4" />
                    Assigned
                  </div>
                  <p className="mt-2 text-xl font-semibold">{assignedTasks.length}</p>
                </div>
                <div className="rounded-lg bg-muted/40 p-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Sparkles aria-hidden="true" className="size-4" />
                    Done
                  </div>
                  <p className="mt-2 text-xl font-semibold">{completedTasks}</p>
                </div>
              </div>

              <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail aria-hidden="true" className="size-4" />
                  <span>{user.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default MembersPage