import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TableBody, TableRow, TableCell, Table } from "@/components/ui/table";

interface Event {
  id: string;
  summary: string;
  start: { dateTime: string };
  end: { dateTime: string };
}

interface CalendarProps {
  gapi: any;
}

export default function Calendar({ gapi }: CalendarProps) {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (gapi) {
      listUpcomingEvents();
    }
  }, [gapi]);

  const listUpcomingEvents = () => {
    if (!gapi?.client?.calendar?.events) {
      console.error("couldnt get tasks?");
      return;
    }

    gapi.client.calendar.events
      .list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: "startTime",
      })
      .then((response: any) => {
        setEvents(response.result.items);
      });
  };

  return (
    <Card className="bg-white/10 border-none text-white">
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  {event.summary} -{" "}
                  {new Date(event.start.dateTime).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
