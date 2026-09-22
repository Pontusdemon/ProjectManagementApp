type TaskStatus = "todo" | "in-progress" | "review" | "done";
   type TaskPriority = "low" | "medium" | "high";

   interface User {
     id: string;
     name: string;
     email: string;
     avatar?: string;
   }

   interface Project {
     id: string;
     name: string;
     description: string;
     color: string;
     createdAt: string;
   }

   interface Task {
     id: string;
     projectId: string;
     title: string;
     description: string;
     status: TaskStatus;
     priority: TaskPriority;
     assigneeId?: string;
     dueDate?: string;
     createdAt: string;
     updatedAt: string;
   }

   interface Comment {
     id: string;
     taskId: string;
     authorId: string;
     body: string;
     createdAt: string;
   }