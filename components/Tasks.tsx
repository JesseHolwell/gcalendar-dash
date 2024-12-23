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
import { Check, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function Tasks() {
  const { data: session } = useSession();
  const [selectedTask, setSelectedTask] = useState<TaskViewModel | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery<TaskViewModel[]>({
    queryKey: ["tasks", session],
    queryFn: () => fetchTasks(session),
    // enabled: !!session,
  });

  const updateTaskMutation = useMutation({
    mutationFn: (task: TaskViewModel) =>
      updateTask(session, task.categoryId, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleToggleTask = async (
    event: React.MouseEvent,
    task: TaskViewModel
  ) => {
    event.stopPropagation();
    updateTaskMutation.mutate({
      ...task,
      status: task.status === "completed" ? "needsAction" : "completed",
    });
  };

  const handleTaskClick = (task: TaskViewModel) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  return (
    <Card className="border-none text-white">
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
              {tasks?.map((task) => (
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
                      variant="outline"
                      size="icon"
                      disabled={updateTaskMutation.isPending || !session}
                    >
                      {updateTaskMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-6 w-6" />
                      )}
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
