"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState, useEffect } from "react";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

interface WeatherData {
  main: { temp: number };
  weather: { description: string; icon: string }[];
  name: string;
}

interface WeatherProps {
  refreshTrigger: number;
}

export default function Weather({ refreshTrigger }: WeatherProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch weather based on user location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(latitude, longitude);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Unable to fetch your location.");
      }
    );
  }, [refreshTrigger]);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const data = await response.json();
      if (response.ok) {
        setWeather(data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Weather fetch error:", err);
      setError("Failed to fetch weather data.");
    }
  };

  return (
    <Card className="bg-white/10 border-none text-white">
      <CardHeader>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <span>
            {weather ? (
              <p>
                {Math.round(weather.main.temp)}°C -{" "}
                {weather.weather[0].description}
              </p>
            ) : (
              <p>Loading weather...</p>
            )}
          </span>
        )}
      </CardHeader>
    </Card>
  );
}
