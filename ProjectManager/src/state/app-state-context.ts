import { createContext, useContext } from "react"
import type { AppState, Comment, Project, Task, TaskStatus } from "@/types/domain"

export interface AppStateActions {
  createProject: (project: Project) => void
  updateProject: (project: Project) => void
  deleteProject: (projectId: string) => void
  createTask: (task: Task) => void
  updateTask: (task: Task) => void
  deleteTask: (taskId: string) => void
  moveTask: (taskId: string, status: TaskStatus) => void
  addComment: (comment: Comment) => void
  setCurrentUser: (userId: string) => void
}

export interface AppStateContextValue {
    state: AppState
    actions: AppStateActions
}

export const AppStateContext = createContext<AppStateContextValue | null>(null)

export function useAppState(): AppStateContextValue {
  const context = useContext(AppStateContext)

  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider")
  }

  return context
}