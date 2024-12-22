"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { fetchTasks, TaskViewModel, updateTask } from "@/services/taskService";
import { CheckCircle, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { takeCoverage } from "v8";

export default function Tasks() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<TaskViewModel[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskViewModel | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, [session]);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const fetchedTaskLists = await fetchTasks(session);

      // Deconstruct task lists into a single list of TaskViewModel
      const tasksWithCategories = fetchedTaskLists.flatMap((taskList) =>
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

      setTasks(tasksWithCategories);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTask = async (
    event: React.MouseEvent,
    task: TaskViewModel
  ) => {
    event.stopPropagation();
    try {
      const updatedTask = await updateTask(session, task.categoryId, {
        ...task,
        status: task.status === "completed" ? "needsAction" : "completed",
      });
      setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleTaskClick = (task: TaskViewModel) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  return (
    <Card className="bg-white/10 border-none text-white">
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
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
                      onClick={(event) => handleToggleTask(event, task)}
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
        )}
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
