// export interface CalendarEvent {
//   kind: string;
//   etag: string;
//   id: string;
//   status: "confirmed" | "tentative" | "cancelled";
//   htmlLink: string;
//   summary?: string;
//   description?: string;
//   start?: { dateTime: string; timeZone?: string };
//   end?: { dateTime: string; timeZone?: string };
// }

import { CalendarEvent } from "@/services/calendarService";
import { TaskViewModel } from "@/services/taskService";

function getRandomFutureDate(startDate?: Date): {
  startDateTime: string;
  endDateTime: string;
} {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * 6 + 1); // 1 to 6 days in the future
  const randomHours = Math.floor(Math.random() * 24); // Random hour of the day

  if (!startDate) {
    startDate = new Date(now);
    startDate.setDate(now.getDate() + randomDays);
    startDate.setHours(randomHours, 0, 0, 0); // Random hour, zeroed minutes/seconds
  }

  const endDate = new Date(startDate);
  endDate.setHours(startDate.getHours() + 1); // Add one hour for the end time

  return {
    startDateTime: startDate.toISOString(),
    endDateTime: endDate.toISOString(),
  };
}

export const SAMPLE_DATA: {
  username: string;
  tasks: TaskViewModel[];
  weeklyEvents: CalendarEvent[];
  dailyEvents: CalendarEvent[];
} = {
  username: "Sample User",
  tasks: [
    {
      id: "cFVwU2lTN1RmSFRWTV9HNQ",
      title: "Center align the greeting",
      category: "Design",
      categoryId: "MTYzMjc3NTY2MDg1MDE1MzQ0MDY6MDow",
      status: "needsAction",
    },
    {
      id: "SlJlVTBpRHdaS18zcHJ6cA",
      title: "100 pushups",
      category: "Health",
      categoryId: "Nzg0YWFkMmNxYmdJZHVVXw",
      status: "needsAction",
      notes: "Try to do them in sets of 20.",
    },
    {
      id: "eVNNMkhIR01ON0trUE83Vg",
      title: "Optimise APIs",
      category: "Programming",
      categoryId: "cnVnblNZVVlSZ0FjdUhSOQ",
      status: "needsAction",
      due: "2024-12-31T23:59:59Z",
    },
    {
      id: "UGM0bnp6Tk1waHQ3Rm9Ecg",
      title: "Responsive layout",
      category: "Design",
      categoryId: "cnVnblNZVVlSZ0FjdUhSOQ",
      status: "needsAction",
    },
    {
      id: "WDEzYTUyclhHT3d0QmxlQQ",
      title: "Yoga",
      category: "Health",
      categoryId: "d09FQ1F2VzNNblVHb1cyYg",
      status: "needsAction",
    },
  ],

  // TODO: yeah this is bad clean this up
  weeklyEvents: Array.from({ length: 6 }, (_, index) => {
    const { startDateTime, endDateTime } = getRandomFutureDate();
    return {
      id: `event-${index + 2}`,
      summary: `Event ${index + 2} Summary`,
      start: { dateTime: startDateTime },
      end: { dateTime: endDateTime },
    };
  }).sort(
    (a, b) =>
      new Date(a.start.dateTime).getTime() -
      new Date(b.start.dateTime).getTime()
  ),
  dailyEvents: Array.from({ length: 1 }, (_, index) => {
    const { startDateTime, endDateTime } = getRandomFutureDate(new Date());
    return {
      id: `event-${index + 1}`,
      summary: `Event ${index + 1} Summary`,
      start: { dateTime: startDateTime },
      end: { dateTime: endDateTime },
    };
  }),
};
