import { useMemo, useReducer, type ReactNode } from "react"
import { createSeedState } from "@/data/seed-state"
import { appReducer } from "@/state/app-reducer"
import { AppStateContext, type AppStateContextValue } from "@/state/app-state-context"

interface AppStateProviderProps {
  children: ReactNode
}

export function AppStateProvider({ children }: AppStateProviderProps) {
  const [state, dispatch] = useReducer(appReducer, undefined, createSeedState)

  const value = useMemo<AppStateContextValue>(
    () => ({
      state,
      actions: {
        createProject: (project) => dispatch({ type: "project/created", project }),
        updateProject: (project) => dispatch({ type: "project/updated", project }),
        deleteProject: (projectId) => dispatch({ type: "project/deleted", projectId }),
        createTask: (task) => dispatch({ type: "task/created", task }),
        updateTask: (task) => dispatch({ type: "task/updated", task }),
        deleteTask: (taskId) => dispatch({ type: "task/deleted", taskId }),
        moveTask: (taskId, status) => dispatch({ type: "task/moved", taskId, status }),
        addComment: (comment) => dispatch({ type: "comment/added", comment }),
        setCurrentUser: (userId) => dispatch({ type: "current-user/set", userId }),
      },
    }),
    [state]
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}