import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react"
import { comments, projects, tasks, users } from "@/types/Seeddata"
import type { AppState, Comment, Project, Task, TaskStatus } from "@/types/domain"
import { appReducer } from "@/state/app-reducer"

interface AppStateContextValue {
  state: AppState
  actions: {
    createProject: (project: Project) => void
    updateProject: (project: Project) => void
    deleteProject: (projectId: string) => void
    createTask: (task: Task) => void
    updateTask: (task: Task) => void
    deleteTask: (taskId: string) => void
    moveTask: (taskId: string, status: TaskStatus) => void
    addComment: (comment: Comment) => void
  }
}

const AppStateContext = createContext<AppStateContextValue | null>(null)

function createInitialState(): AppState {
  return {
    projects: [...projects],
    tasks: [...tasks],
    users: [...users],
    comments: [...comments],
  }
}

interface AppStateProviderProps {
  children: ReactNode
}

export function AppStateProvider({ children }: AppStateProviderProps) {
  const [state, dispatch] = useReducer(appReducer, undefined, createInitialState)

  const value = useMemo<AppStateContextValue>(
    () => ({
      state,
      actions: {
        createProject: (project) => dispatch({ type: "project/created", project }),
        updateProject: (project) => dispatch({ type: "project/updated", project }),
        deleteProject: (projectId) =>
          dispatch({ type: "project/deleted", projectId }),
        createTask: (task) => dispatch({ type: "task/created", task }),
        updateTask: (task) => dispatch({ type: "task/updated", task }),
        deleteTask: (taskId) => dispatch({ type: "task/deleted", taskId }),
        moveTask: (taskId, status) =>
          dispatch({ type: "task/moved", taskId, status }),
        addComment: (comment) => dispatch({ type: "comment/added", comment }),
      },
    }),
    [state]
  )

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState(): AppStateContextValue {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider")
  }
  return context
}