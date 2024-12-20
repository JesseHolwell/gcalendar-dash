import { Session } from "next-auth";

export interface Task {
  id: string;
  title: string;
  notes?: string;
  status: "needsAction" | "completed";
  due?: string;
}

export async function fetchTasks(session: Session | null): Promise<Task[]> {
  if (!session) {
    throw new Error("No active session");
  }

  const response = await fetch("/api/tasks", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  const data = await response.json();
  return data.items.map((item: any) => ({
    id: item.id,
    title: item.title,
    notes: item.notes,
    status: item.status,
    due: item.due,
  }));
}

export async function createTask(
  session: Session | null,
  task: Omit<Task, "id">
): Promise<Task> {
  if (!session) {
    throw new Error("No active session");
  }

  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  return response.json();
}

export async function updateTask(
  session: Session | null,
  task: Task
): Promise<Task> {
  if (!session) {
    throw new Error("No active session");
  }

  const response = await fetch(`/api/tasks/${task.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error("Failed to update task");
  }

  return response.json();
}

export async function deleteTask(
  session: Session | null,
  taskId: string
): Promise<void> {
  if (!session) {
    throw new Error("No active session");
  }

  const response = await fetch(`/api/tasks/${taskId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete task");
  }
}
