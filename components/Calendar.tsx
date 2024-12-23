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
import { fetchEvents, CalendarEvent } from "@/services/calendarService";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function Calendar() {
  const { data: session } = useSession();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isWeeklyView, setIsWeeklyView] = useState(false);

  const { data: events, isLoading } = useQuery<CalendarEvent[]>({
    queryKey: ["events", session, isWeeklyView],
    queryFn: () => fetchEvents(session, isWeeklyView),
    // enabled: !!session,
  });

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const toggleView = () => {
    setIsWeeklyView(!isWeeklyView);
  };

  const formatTime = (event: CalendarEvent) => {
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

  return (
    <Card className="bg-white/10 border-none text-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{isWeeklyView ? "Weekly" : "Today's"} Events</CardTitle>
        <Button onClick={toggleView} variant="default">
          {isWeeklyView ? "Show Today" : "Show Week"}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableBody>
              {events?.map((event) => (
                <TableRow
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className="cursor-pointer"
                >
                  <TableCell>
                    {new Date(
                      event.start.dateTime || event.start.date!
                    ).toLocaleDateString([], {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>{formatTime(event)}</TableCell>
                  <TableCell>{event.summary}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.summary}</DialogTitle>
            <DialogDescription>Event Details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right">Date</span>
              <span className="col-span-3">
                {selectedEvent && selectedEvent?.start.date
                  ? new Date(selectedEvent.start.date).toLocaleDateString()
                  : new Date(
                      selectedEvent?.start.dateTime || ""
                    ).toLocaleDateString()}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right">Time</span>
              <span className="col-span-3">
                {selectedEvent && formatTime(selectedEvent)}
              </span>
            </div>
            {selectedEvent?.location && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right">Location</span>
                <span className="col-span-3">{selectedEvent.location}</span>
              </div>
            )}
            {selectedEvent?.description && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right">Description</span>
                <span className="col-span-3">{selectedEvent.description}</span>
              </div>
            )}
          </div>
          <DialogFooter className="text-sm text-muted-foreground">
            Calendar event details
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
