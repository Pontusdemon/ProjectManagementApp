export type TaskStatus = "todo" | "in-progress" | "review" | "done"
export type TaskPriority = "low" | "medium" | "high"

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
  color: string
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
  projects: Project[]
  tasks: Task[]
  users: User[]
  comments: Comment[]
}
