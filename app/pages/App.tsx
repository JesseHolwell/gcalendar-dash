"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Affirmation from "./Affirmation";
import Clock from "./Clock";
import Login from "./Login";
import Tasks from "./Tasks";
import Weather from "./Weather";

const Calendar = dynamic(() => import("./Calendar"), { ssr: false });

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const SCOPES =
  "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/tasks";

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [gapi, setGapi] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadGapiAndGIS = async () => {
      const gapiScript = document.createElement("script");
      gapiScript.src = "https://apis.google.com/js/api.js";
      gapiScript.async = true;
      document.body.appendChild(gapiScript);

      gapiScript.onload = () => {
        const gapi = (window as any).gapi;
        gapi.load("client", initGapiClient);
        setGapi(gapi);
      };

      const gisScript = document.createElement("script");
      gisScript.src = "https://accounts.google.com/gsi/client";
      gisScript.async = true;
      document.body.appendChild(gisScript);
    };

    const initGapiClient = async () => {
      const gapi = (window as any).gapi;
      await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
          "https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest",
        ],
      });
    };

    // Load GAPI and GIS scripts
    loadGapiAndGIS();

    // Check if a token exists in localStorage
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      setToken(storedToken);
      setIsSignedIn(true);
    }
  }, []);

  const handleAuthClick = () => {
    const client = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (response: any) => {
        const { access_token } = response;
        setToken(access_token);
        setIsSignedIn(true);

        // Save the token in localStorage for persistence
        localStorage.setItem("access_token", access_token);
      },
    });

    client.requestAccessToken();
  };

  const handleSignoutClick = () => {
    (window as any).google.accounts.oauth2.revoke(token, () => {
      setIsSignedIn(false);
      setToken(null);

      // Remove token from localStorage on sign-out
      localStorage.removeItem("access_token");
    });
  };

  return (
    <div className="min-h-screen bg-[url('/images/forest-background.jpg')] bg-cover bg-center">
      <div className="min-h-screen bg-black/50 p-12 text-white">
        <div className="mx-auto space-y-8">
          <div className="flex justify-between items-center w-full">
            <Affirmation />
            <Clock />
            <Weather />
          </div>
          {isSignedIn ? (
            <div className="grid md:grid-cols-2 gap-8">
              <Tasks gapi={gapi} />
              <Calendar gapi={gapi} />
            </div>
          ) : (
            <Login onLogin={handleAuthClick} />
          )}
        </div>
      </div>
    </div>
  );
}
