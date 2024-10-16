import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableBody, TableRow, TableCell, Table } from "@/components/ui/table";
import { CheckCircle } from "lucide-react";
// import { Table } from "lucide-react";

interface Task {
  id: string;
  title: string;
  category: string;
  categoryId: string;
  status: string;
}

interface TasksProps {
  gapi: any;
  refreshTrigger: number;
}

export default function Tasks({ gapi, refreshTrigger }: TasksProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (gapi) {
      listTasks();
    }
  }, [gapi, refreshTrigger]);

  const listTasks = async () => {
    if (!gapi?.client?.tasks?.tasklists) {
      console.error("GAPI client not initialized or missing.");
      return;
    }

    try {
      // Step 1: Fetch all task lists
      const taskListsResponse = await gapi.client.tasks.tasklists.list();
      const taskLists = taskListsResponse.result.items || [];

      console.log("Task lists:", taskLists);

      let allTasks: Task[] = [];

      // Step 2: Iterate through each task list and fetch its tasks
      for (const taskList of taskLists) {
        const taskListId = taskList.id;
        const taskListName = taskList.title; // Capture the name of the task list

        const tasksResponse = await gapi.client.tasks.tasks.list({
          tasklist: taskListId,
          maxResults: 100, // Adjust as needed
          showCompleted: false,
        });

        const tasks = tasksResponse.result.items || [];

        // Add the taskListName to each task object
        const tasksWithListName = tasks.map((task: any) => ({
          ...task,
          category: taskListName, // Add the name of the task list
          categoryId: taskListId,
        }));

        // Merge the tasks into the allTasks array
        allTasks = [...allTasks, ...tasksWithListName];
      }

      console.log("All tasks:", allTasks);
      setTasks(allTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleCompleteTask = (taskId: string, taskListId: string) => {
    console.log("Completing task:", { taskId, taskListId });

    if (!taskId || !taskListId) {
      console.error("Missing taskId or taskListId.");
      return;
    }

    gapi.client.tasks.tasks
      .patch({
        tasklist: taskListId, // The ID of the task list
        task: taskId, // The ID of the task to update
        resource: {
          status: "completed",
        }, // Update the task status
      })
      .then(() => {
        console.log(`Task ${taskId} marked as completed.`);

        // Remove the completed task from the local state
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      })
      .catch((error: any) => {
        console.error("Error updating task:", error);
      });
  };

  return (
    <Card className="bg-white/10 border-none text-white">
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.category}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleCompleteTask(task.id, task.categoryId)}
                    variant="default"
                    size="icon"
                  >
                    <CheckCircle className="h-6 w-6" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
