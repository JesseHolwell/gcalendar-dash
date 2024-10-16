"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableBody, TableRow, TableCell, Table } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

interface Task {
  id: string;
  title: string;
  category: string;
  categoryId: string;
  status: string;
  notes?: string;
  due?: string;
}

interface TasksProps {
  gapi: any;
  refreshTrigger: number;
}

export default function Tasks({ gapi, refreshTrigger }: TasksProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (gapi) {
      listTasks();
    }
  }, [gapi, refreshTrigger]);

  const listTasks = async () => {
    console.log("Getting tasks");

    if (!gapi?.client?.tasks?.tasklists) {
      console.error("GAPI client not initialized or missing.");
      return;
    }

    try {
      const taskListsResponse = await gapi.client.tasks.tasklists.list();
      const taskLists = taskListsResponse.result.items || [];

      let allTasks: Task[] = [];

      for (const taskList of taskLists) {
        const taskListId = taskList.id;
        const taskListName = taskList.title;

        const tasksResponse = await gapi.client.tasks.tasks.list({
          tasklist: taskListId,
          maxResults: 100,
          showCompleted: false,
        });

        const tasks = tasksResponse.result.items || [];

        const tasksWithListName = tasks.map((task: any) => ({
          ...task,
          category: taskListName,
          categoryId: taskListId,
        }));

        allTasks = [...allTasks, ...tasksWithListName];
      }

      console.log("Retrieved tasks:", allTasks);

      setTasks(allTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleCompleteTask = (
    e: React.MouseEvent,
    taskId: string,
    taskListId: string
  ) => {
    e.stopPropagation();
    console.log("Completing task:", { taskId, taskListId });

    if (!taskId || !taskListId) {
      console.error("Missing taskId or taskListId.");
      return;
    }

    gapi.client.tasks.tasks
      .patch({
        tasklist: taskListId,
        task: taskId,
        resource: {
          status: "completed",
        },
      })
      .then(() => {
        console.log(`Task ${taskId} marked as completed.`);
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      })
      .catch((error: any) => {
        console.error("Error updating task:", error);
      });
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
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
              <TableRow
                key={task.id}
                onClick={() => handleTaskClick(task)}
                className="cursor-pointer"
              >
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.category}</TableCell>
                <TableCell>
                  <Button
                    onClick={(e) =>
                      handleCompleteTask(e, task.id, task.categoryId)
                    }
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTask?.title}</DialogTitle>
            <DialogDescription>Task Details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right">Category</span>
              <span className="col-span-3">{selectedTask?.category || ""}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right">Status</span>
              <span id="status" className="col-span-3">
                {selectedTask?.status || ""}
              </span>
            </div>
            {selectedTask?.notes && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right">Notes</span>
                <span id="notes" className="col-span-3">
                  {selectedTask.notes}
                </span>
              </div>
            )}
            {selectedTask?.due && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right">Due Date</span>
                <span id="due" className="col-span-3">
                  {new Date(selectedTask.due).toLocaleString()}
                </span>
              </div>
            )}
          </div>
          <DialogFooter className="text-sm text-muted-foreground">
            Affirmation for {selectedTask?.category} goes here
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
