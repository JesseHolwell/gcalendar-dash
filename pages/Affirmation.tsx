"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React, { useEffect, useState } from "react";

const affirmations = [
  "I am capable of achieving my goals.",
  "I am worthy of love and respect.",
  "I embrace the challenges that come my way.",
  "I believe in my abilities.",
  "I am enough just as I am.",
  "I am grateful for the opportunities I have.",
  "I attract positivity and abundance.",
  "I choose to be happy and content.",
  "I am surrounded by love and support.",
  "I have the power to create my reality.",
];

const getRandomAffirmation = () => {
  const randomIndex = Math.floor(Math.random() * affirmations.length);
  return affirmations[randomIndex];
};

const Affirmation: React.FC = () => {
  const [affirmation, setAffirmation] = useState("");

  useEffect(() => {
    const dailyAffirmation = getRandomAffirmation();
    setAffirmation(dailyAffirmation);
  }, []);

  return (
    <Card className="bg-white/10 border-none text-white content-center">
      <CardHeader>
        <span>{affirmation}</span>
      </CardHeader>
    </Card>
  );
};

export default Affirmation;
