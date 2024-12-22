import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { refreshToken } from "@/utils/refreshToken";

async function fetchTaskLists(accessToken: string | undefined) {
  const response = await fetch(
    "https://tasks.googleapis.com/tasks/v1/users/@me/lists",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Google Tasks API error: ${response.statusText}`);
  }

  return response.json();
}

async function fetchTasksForList(
  accessToken: string | undefined,
  taskListId: string
) {
  const response = await fetch(
    `https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Google Tasks API error: ${response.statusText}`);
  }

  return response.json();
}

export async function GET(req: NextRequest) {
  try {
    let token = await getToken({ req });

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (token.expiresAt && Date.now() > token.expiresAt) {
      token = await refreshToken(req);
    }

    // Fetch all task lists
    const taskLists = await fetchTaskLists(token.accessToken);

    // Fetch tasks for each task list
    const taskListsWithTasks = await Promise.all(
      taskLists.items.map(async (taskList: { id: string; title: string }) => {
        const tasksData = await fetchTasksForList(
          token.accessToken,
          taskList.id
        );
        return {
          id: taskList.id,
          title: taskList.title,
          tasks: tasksData.items || [],
        };
      })
    );

    return NextResponse.json(taskListsWithTasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    let token = await getToken({ req });

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (token.expiresAt && Date.now() > token.expiresAt) {
      token = await refreshToken(req);
    }

    const body = await req.json();
    const { taskListId, task } = body;

    if (!taskListId || !task) {
      return NextResponse.json(
        { error: "Missing taskListId or task data" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      }
    );

    if (!response.ok) {
      throw new Error(`Google Tasks API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
