import { UserRoundCog } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SEED_CURRENT_USER_ID } from "@/data/seed-state"
import { useAppState } from "@/state/app-state-context"

const SettingsPage = () => {
  const { state, actions } = useAppState()
  const currentUser = state.users.find((user) => user.id === state.currentUserId) ?? state.users[0]

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Workspace
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserRoundCog aria-hidden="true" className="size-5" />
            </div>
            <div>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Choose the identity the app uses for comments and activity.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current user</label>
            <Select
              value={currentUser?.id ?? ""}
              onValueChange={(value) => {
                if (value) actions.setCurrentUser(value)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a user" />
              </SelectTrigger>
              <SelectContent>
                {state.users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border bg-muted/20 p-3 text-sm text-muted-foreground">
            Signed in as <span className="font-medium text-foreground">{currentUser?.name ?? "Unknown user"}</span>
          </div>

          <Button type="button" variant="outline" onClick={() => actions.setCurrentUser(SEED_CURRENT_USER_ID)}>
            Reset to demo identity
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default SettingsPage