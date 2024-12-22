"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

interface WeatherData {
  main: { temp: number; temp_min: number; temp_max: number };
  weather: { description: string; icon: string }[];
  name: string;
}

export default function Weather() {
  const fetchWeather = async (): Promise<WeatherData> => {
    const position = await new Promise<GeolocationPosition>(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    );

    const { latitude, longitude } = position.coords;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    return response.json();
  };

  const {
    data: weather,
    error,
    isLoading,
  } = useQuery<WeatherData, Error>({
    queryKey: ["weather"],
    queryFn: fetchWeather,
    refetchInterval: 600000, // Refetch every 10 minutesadf
  });

  return (
    <Card className="bg-white/10 border-none text-white content-center">
      <CardHeader>
        {error ? (
          <p className="text-red-500">{error.message}</p>
        ) : isLoading ? (
          <p>Loading weather...</p>
        ) : weather ? (
          <span className="text-sm">
            <p>
              {Math.round(weather.main.temp)}°C -{" "}
              {weather.weather[0].description}
            </p>
            <p>
              min: {Math.round(weather.main.temp_min)}°C max:{" "}
              {Math.round(weather.main.temp_max)}°C
            </p>
          </span>
        ) : null}
      </CardHeader>
    </Card>
  );
}
