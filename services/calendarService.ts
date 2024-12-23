import { SAMPLE_DATA } from "@/utils/sampleData";
import { Session } from "next-auth";

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: { date?: string; dateTime?: string };
  end: { date?: string; dateTime?: string };
}

export async function fetchEvents(
  session: Session | null,
  isWeeklyView: boolean
): Promise<CalendarEvent[]> {
  if (!session) {
    // throw new Error("No active session");

    return isWeeklyView
      ? SAMPLE_DATA.dailyEvents.concat(SAMPLE_DATA.weeklyEvents)
      : SAMPLE_DATA.dailyEvents;
  }

  const now = new Date();
  const timeMin = now.toISOString();
  const timeMax = isWeeklyView
    ? new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 7
      ).toISOString()
    : new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      ).toISOString();

  const response = await fetch(
    `/api/calendar?timeMin=${encodeURIComponent(
      timeMin
    )}&timeMax=${encodeURIComponent(timeMax)}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  const data = await response.json();

  console.log("calendar", data.items);
  return data.items;
}

export async function updateEvent(
  session: Session | null,
  event: CalendarEvent
): Promise<CalendarEvent> {
  if (!session) {
    throw new Error("No active session");
  }

  const response = await fetch(`/api/calendar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    throw new Error("Failed to update event");
  }

  return response.json();
}
