import { SAMPLE_DATA } from "@/utils/sampleData";
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

export async function fetchTasks(
  session: Session | null
): Promise<TaskViewModel[]> {
  if (!session) {
    return SAMPLE_DATA.tasks;
  }

  const response = await fetch("/api/tasks", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  let taskLists: TaskList[] = await response.json();

  // Filter out completed tasks for each task list
  taskLists = taskLists.map((taskList) => ({
    ...taskList,
    tasks: taskList.tasks.filter((task) => task.status !== "completed"),
  }));

  const tasksWithCategories = taskLists.flatMap((taskList) =>
    taskList.tasks.map((task) => ({
      id: task.id,
      title: task.title,
      category: taskList.title,
      categoryId: taskList.id,
      status: task.status,
      notes: task.notes,
      due: task.due,
    }))
  );

  console.log("tasks", tasksWithCategories);

  return tasksWithCategories;
}

export async function updateTask(
  session: Session | null,
  taskListId: string,
  task: TaskViewModel
): Promise<TaskViewModel> {
  if (!session) {
    throw new Error("No active session");
  }

  if (!task.id) {
    throw new Error("Task ID is required to update a task");
  }

  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      taskListId,
      taskId: task.id, // Pass the task ID to the API
      task,
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`Failed to update task: ${errorDetails}`);
  }

  return response.json();
}
