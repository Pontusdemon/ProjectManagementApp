import type { AppState, Comment, Project, Task, TaskStatus } from '@/types/domain'

export type AppAction =
    | { type: "project/created"; project: Project }
    | { type: "project/updated"; project: Project }
    | { type: "project/deleted"; projectId: string }
    | { type: "task/created"; task: Task }
    | { type: "task/updated"; task: Task }
    | { type: "task/deleted"; taskId: string }
    | { type: "task/moved"; taskId: string; status: TaskStatus }
    | { type: "comment/added"; comment: Comment }
    | { type: "current-user/set"; userId: string }

export function appReducer(state: AppState, action: AppAction) {
    switch (action.type) {
        case "project/created":
            return {
                ...state,
                projects: [...state.projects, action.project],
            }

        case "project/updated":
            return {
                ...state,
                projects: state.projects.map((project) =>
                    project.id === action.project.id
                        ? { ...action.project, id: project.id, createdAt: project.createdAt }
                        : project
                ),
            }

        case "project/deleted": {
            const deletedTaskIds = new Set(
                state.tasks
                    .filter((task) => task.projectId === action.projectId)
                    .map((task) => task.id)
            )

            return {
                ...state,
                projects: state.projects.filter((project) => project.id !== action.projectId),
                tasks: state.tasks.filter((task) => task.projectId !== action.projectId),
                comments: state.comments.filter(
                    (comment) => !deletedTaskIds.has(comment.taskId)
                ),
            }
        }

        case "task/created":
            // A task must belong to a project that exists.
            if (!state.projects.some((project) => project.id === action.task.projectId)) {
                return state
            }
            return {
                ...state,
                tasks: [...state.tasks, action.task],
            }

        case "task/updated":
            return {
                ...state,
                tasks: state.tasks.map((task) =>
                    task.id === action.task.id
                        ? {
                            ...action.task,
                            id: task.id,
                            projectId: task.projectId,
                            createdAt: task.createdAt,
                        }
                        : task
                ),
            }

        case "task/deleted":
            return {
                ...state,
                tasks: state.tasks.filter((task) => task.id !== action.taskId),
                comments: state.comments.filter(
                    (comment) => comment.taskId !== action.taskId
                ),
            }

        case "task/moved":
            return {
                ...state,
                tasks: state.tasks.map((task) =>
                    task.id === action.taskId
                        ? { ...task, status: action.status, updatedAt: new Date().toISOString() }
                        : task
                ),
            }

        case "comment/added":
            if (!state.tasks.some((task) => task.id === action.comment.taskId)) {
                return state
            }
            return {
                ...state,
                comments: [...state.comments, action.comment],
            }

        case "current-user/set":
            // Fails closed: an unknown id leaves the current user untouched rather
            // than pointing the whole app at a user that does not exist.
            if (!state.users.some((user) => user.id === action.userId)) {
                return state
            }
            return {
                ...state,
                currentUserId: action.userId,
            }

        default: {
            const exhaustive: never = action
            return exhaustive
        }
    }
}