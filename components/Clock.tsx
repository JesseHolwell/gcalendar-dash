"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function Clock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const getDate = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };

    getDate();

    // Update the time every second
    const interval = setInterval(() => {
      getDate();
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-white/10 border-none text-white content-center">
      <CardHeader>
        <span>{time}</span>
      </CardHeader>
    </Card>
  );
}
