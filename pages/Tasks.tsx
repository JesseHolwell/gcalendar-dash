"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  Task,
} from "@/services/taskService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash } from "lucide-react";

export default function Tasks() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, [session]);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const fetchedTasks = await fetchTasks(session);
      console.log("got tasks", fetchedTasks);
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const newTask = await createTask(session, {
        title: newTaskTitle,
        status: "needsAction",
      });
      setTasks([...tasks, newTask]);
      setNewTaskTitle("");
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleToggleTask = async (task: Task) => {
    try {
      const updatedTask = await updateTask(session, {
        ...task,
        status: task.status === "completed" ? "needsAction" : "completed",
      });
      setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(session, taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <>
            <form onSubmit={handleCreateTask} className="flex space-x-2 mb-4">
              <Input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Add a new task"
                className="flex-grow"
              />
              <Button type="submit">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </form>
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li key={task.id} className="flex items-center space-x-2">
                  {/* <Checkbox
                    checked={task.status === "completed"}
                    onCheckedChange={() => handleToggleTask(task)}
                  /> */}
                  <span
                    className={
                      task.status === "completed" ? "line-through" : ""
                    }
                  >
                    {task.title}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}
