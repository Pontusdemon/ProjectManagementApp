export const TASK_STATUS_VALUES = ["todo", "in-progress", "review", "done"] as const
export type TaskStatus = (typeof TASK_STATUS_VALUES)[number]

export const TASK_PRIORITY_VALUES = ["low", "medium", "high"] as const
export type TaskPriority = (typeof TASK_PRIORITY_VALUES)[number]

export const PROJECT_COLOR_VALUES = ["violet", "sky", "emerald", "amber"] as const
export type ProjectColor = (typeof PROJECT_COLOR_VALUES)[number]

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface Project {
  id: string
  name: string
  description: string
  color: ProjectColor
  createdAt: string
}

export interface Task {
  id: string
  projectId: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId?: string
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  taskId: string
  authorId: string
  body: string
  createdAt: string
}

export interface AppState {
  currentUserId: string
  projects: Project[]
  tasks: Task[]
  users: User[]
  comments: Comment[]
}
