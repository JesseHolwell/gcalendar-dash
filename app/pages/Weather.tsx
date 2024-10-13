// components/Weather.tsx

"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

interface WeatherData {
  main: { temp: number };
  weather: { description: string; icon: string }[];
  name: string;
}

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get user location and fetch weather
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
  }, []);

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

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-blue-100 p-4 rounded shadow-md">
      {weather ? (
        <>
          <h2 className="text-xl font-bold">{weather.name}</h2>
          <p className="text-lg">
            {Math.round(weather.main.temp)}°C - {weather.weather[0].description}
          </p>
          <Image
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Weather Icon"
          />
        </>
      ) : (
        <p>Loading weather...</p>
      )}
    </div>
  );
}
