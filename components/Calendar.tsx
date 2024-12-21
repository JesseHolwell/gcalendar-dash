"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

interface Event {
  id: string;
  summary: string;
  description?: string;
  location?: string;
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
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
        console.log("Retrieved events:", response.result.items);
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

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
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
          <TableBody>
            {Object.entries(groupedEvents).map(([date, dateEvents]) =>
              dateEvents.map((event, index) => (
                <TableRow
                  key={event.id}
                  className="cursor-pointer hover:bg-white/5"
                  onClick={() => handleEventClick(event)}
                >
                  <TableCell>
                    {new Date(date).toLocaleDateString([], {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>{formatTime(event)}</TableCell>
                  <TableCell>{event.summary}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.summary}</DialogTitle>
            <DialogDescription>Event Details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium text-right">Date:</span>
              <span className="col-span-3">
                {selectedEvent?.start.date
                  ? new Date(selectedEvent.start.date).toLocaleDateString()
                  : new Date(
                      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                      selectedEvent?.start.dateTime!
                    ).toLocaleDateString()}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium text-right">Time:</span>
              <span className="col-span-3">
                {selectedEvent && formatTime(selectedEvent)}
              </span>
            </div>
            {selectedEvent?.location && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium text-right">Location:</span>
                <span className="col-span-3">{selectedEvent.location}</span>
              </div>
            )}
            {selectedEvent?.description && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium text-right">Description:</span>
                <span className="col-span-3">{selectedEvent.description}</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
