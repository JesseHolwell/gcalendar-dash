import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Task {
  id: string;
  title: string;
  status: string;
  due?: string;
}

interface TasksProps {
  gapi: any;
}

export default function Tasks({ gapi }: TasksProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (gapi) {
      listTasks();
    }
  }, [gapi]);

  const listTasks = () => {
    gapi.client.tasks.tasks
      .list({ tasklist: "@default", maxResults: 10 })
      .then((response: any) => {
        setTasks(response.result.items || []);
      })
      .catch((error: any) => {
        console.error("Error fetching tasks:", error);
      });
  };

  const handleCompleteTask = (taskId: string) => {
    gapi.client.tasks.tasks
      .update({
        tasklist: "@default",
        task: taskId,
        resource: { status: "completed" },
      })
      .then(() => {
        listTasks(); // Refresh task list
      });
  };

  return (
    <div className="mt-4 space-y-4">
      <h2 className="text-2xl font-bold">Your Tasks</h2>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center bg-secondary p-2 rounded"
          >
            <span>
              {task.title}
              {task.due && (
                <span className="ml-2 text-sm text-gray-600">
                  (Due: {new Date(task.due).toLocaleString()})
                </span>
              )}
            </span>
            {/* {task.status !== "completed" && (
              <Button onClick={() => handleCompleteTask(task.id)}>
                Mark as Complete
              </Button>
            )} */}
          </li>
        ))}
      </ul>
    </div>
  );
}
