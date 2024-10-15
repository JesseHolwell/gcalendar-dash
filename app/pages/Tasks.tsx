import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableBody, TableRow, TableCell, Table } from "@/components/ui/table";
// import { Table } from "lucide-react";

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
    if (!gapi?.client?.tasks?.tasks) {
      console.error("couldnt get tasks?");
      return;
    }

    gapi.client.tasks.tasks
      .list({ tasklist: "@default", maxResults: 10 })
      .then((response: any) => {
        setTasks(response.result.items || []);
        console.log("tasks >", tasks);
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
                <TableCell>
                  <Button onClick={() => handleCompleteTask(task.id)}>
                    Done
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
