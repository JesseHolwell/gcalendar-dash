"use client";

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
    <div className="bg-blue-100 p-4 rounded shadow-md">
      <h2 className="text-xl font-bold mb-2">Daily Affirmation</h2>
      <p className="text-lg">{affirmation}</p>
    </div>
  );
};

export default Affirmation;
