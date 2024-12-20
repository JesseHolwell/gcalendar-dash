import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Event {
  id: string;
  summary: string;
  start: { dateTime: string };
  end: { dateTime: string };
}

interface CalendarProps {
  gapi: any;
}

export default function CalendarWrite({ gapi }: CalendarProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState({ summary: "", start: "", end: "" });

  useEffect(() => {
    if (gapi) {
      listUpcomingEvents();
    }
  }, [gapi]);

  const listUpcomingEvents = () => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = () => {
    const event = {
      summary: newEvent.summary,
      start: {
        dateTime: new Date(newEvent.start).toISOString(),
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: new Date(newEvent.end).toISOString(),
        timeZone: "America/Los_Angeles",
      },
    };

    gapi.client.calendar.events
      .insert({
        calendarId: "primary",
        resource: event,
      })
      .then(() => {
        setNewEvent({ summary: "", start: "", end: "" });
        listUpcomingEvents();
      });
  };

  const handleDeleteEvent = (eventId: string) => {
    gapi.client.calendar.events
      .delete({
        calendarId: "primary",
        eventId: eventId,
      })
      .then(() => {
        listUpcomingEvents();
      });
  };

  return (
    <div className="mt-4 space-y-4">
      <h2 className="text-2xl font-bold">Your Calendar Events</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="summary">Event Summary</Label>
          <Input
            id="summary"
            name="summary"
            value={newEvent.summary}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="start">Start Time</Label>
          <Input
            id="start"
            name="start"
            type="datetime-local"
            value={newEvent.start}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end">End Time</Label>
          <Input
            id="end"
            name="end"
            type="datetime-local"
            value={newEvent.end}
            onChange={handleInputChange}
          />
        </div>
        <Button onClick={handleAddEvent}>Add Event</Button>
      </div>
      <ul className="space-y-2">
        {events.map((event) => (
          <li
            key={event.id}
            className="flex justify-between items-center bg-secondary p-2 rounded"
          >
            <span>
              {event.summary} -{" "}
              {new Date(event.start.dateTime).toLocaleString()}
            </span>
            <Button
              onClick={() => handleDeleteEvent(event.id)}
              variant="destructive"
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
