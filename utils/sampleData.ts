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

export const SAMPLE_DATA: {
  username: string;
  tasks: TaskViewModel[];
  events: CalendarEvent[];
} = {
  username: "Sample User",
  tasks: [
    {
      id: "cFVwU2lTN1RmSFRWTV9HNQ",
      title: "Get a job",
      category: "Work",
      categoryId: "MTYzMjc3NTY2MDg1MDE1MzQ0MDY6MDow",
      status: "needsAction",
    },
    {
      id: "SlJlVTBpRHdaS18zcHJ6cA",
      title: "100 pushups",
      category: "Health & Fitness",
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
      title: "Task",
      category: "Programming",
      categoryId: "cnVnblNZVVlSZ0FjdUhSOQ",
      status: "needsAction",
    },
    {
      id: "WDEzYTUyclhHT3d0QmxlQQ",
      title: "Yoga",
      category: "Life",
      categoryId: "d09FQ1F2VzNNblVHb1cyYg",
      status: "needsAction",
    },
  ],
  events: [
    {
      id: "cgpjcd356pi32b9hcko3eb9k65gm2bb2cco64b9k6dhm8o9m68s3gp1o6o",
      summary: "Event 1 Summary",
      start: { dateTime: "2024-12-23T10:00:00Z" },
      end: { dateTime: "2024-12-23T11:00:00Z" },
    },
    {
      id: "c5j30d1pc5j62b9nckq3cb9k60pj2b9pchh32bb271gjgchm65ijie1ick",
      summary: "Event 2 Summary",
      start: { dateTime: "2024-12-24T14:00:00Z" },
      end: { dateTime: "2024-12-24T15:00:00Z" },
    },
    {
      id: "ckr3ccj4clhm6bb660s3gb9k6lh32b9p6cr6abb6c4p66opgc8qmcopg74",
      summary: "Event 3 Summary",
      start: { dateTime: "2024-12-25T08:00:00Z" },
      end: { dateTime: "2024-12-25T09:00:00Z" },
    },
    {
      id: "c9hm6c9gc5hj6bb36hi3eb9kc4r6cbb2c8p32b9h64r68p346ksm4eb2co",
      summary: "Event 4 Summary",
      start: { dateTime: "2024-12-26T18:00:00Z" },
      end: { dateTime: "2024-12-26T19:00:00Z" },
    },
  ],
};
