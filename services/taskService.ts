import { Session } from "next-auth";

export interface TaskViewModel {
  id: string;
  title: string;
  category: string;
  categoryId: string;
  status: "needsAction" | "completed";
  notes?: string;
  due?: string;
}

export interface TaskModel {
  id: string;
  title: string;
  status: "needsAction" | "completed";
  notes?: string;
  due?: string;
}

export interface TaskList {
  id: string;
  title: string;
  tasks: TaskModel[];
}

export async function fetchTasks(session: Session | null): Promise<TaskList[]> {
  if (!session) {
    throw new Error("No active session");
  }

  const response = await fetch("/api/tasks", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  const taskLists: TaskList[] = await response.json();

  // Filter out completed tasks for each task list
  return taskLists.map((taskList) => ({
    ...taskList,
    tasks: taskList.tasks.filter((task) => task.status !== "completed"),
  }));
}

export async function updateTask(
  session: Session | null,
  taskListId: string,
  task: TaskViewModel
): Promise<TaskViewModel> {
  if (!session) {
    throw new Error("No active session");
  }

  //TODO this doesnt update
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ taskListId, task }),
  });

  if (!response.ok) {
    throw new Error("Failed to update task");
  }

  return response.json();
}
