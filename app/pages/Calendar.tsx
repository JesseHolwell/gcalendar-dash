"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

interface Event {
  id: string;
  summary: string;
  start: { date?: string; dateTime?: string };
  end: { date?: string; dateTime?: string };
}

interface CalendarProps {
  gapi: any;
  refreshTrigger: number;
}

export default function Calendar({ gapi, refreshTrigger }: CalendarProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isWeeklyView, setIsWeeklyView] = useState(false);

  useEffect(() => {
    if (gapi) {
      listUpcomingEvents();
    }
  }, [gapi, isWeeklyView, refreshTrigger]);

  const listUpcomingEvents = () => {
    console.log("Getting events");

    if (!gapi?.client?.calendar?.events) {
      console.error("Couldn't get calendar events");
      return;
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

    gapi.client.calendar.events
      .list({
        calendarId: "primary",
        timeMin: timeMin,
        timeMax: timeMax,
        showDeleted: false,
        singleEvents: true,
        orderBy: "startTime",
      })
      .then((response: any) => {
        setEvents(response.result.items);
      });
  };

  const toggleView = () => {
    setIsWeeklyView(!isWeeklyView);
  };

  const groupEventsByDate = (events: Event[]) => {
    const grouped: { [key: string]: Event[] } = {};
    events.forEach((event) => {
      const date =
        event.start.date || new Date(event.start.dateTime!).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(event);
    });
    return grouped;
  };

  const formatTime = (event: Event) => {
    if (event.start.date) {
      return "All day";
    }
    const startTime = new Date(event.start.dateTime!).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const endTime = new Date(event.end.dateTime!).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${startTime} - ${endTime}`;
  };

  const groupedEvents = groupEventsByDate(events);

  return (
    <Card className="bg-white/10 border-none text-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{isWeeklyView ? "Weekly" : "Today's"} Events</CardTitle>
        <Button onClick={toggleView} variant="default">
          {isWeeklyView ? "Show Today" : "Show Week"}
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="text-lg">
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Event</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(groupedEvents).map(([date, dateEvents]) =>
              dateEvents.map((event, index) => (
                <TableRow key={event.id}>
                  {/* {index === 0 && ( */}
                  <TableCell>
                    {new Date(date).toLocaleDateString([], {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  {/* )} */}
                  <TableCell>{formatTime(event)}</TableCell>
                  <TableCell>{event.summary}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
