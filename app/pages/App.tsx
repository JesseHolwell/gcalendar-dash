"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Login from "./Login";
import Tasks from "./Tasks";
import Weather from "./Weather";
import Affirmation from "./Affirmation";

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

    loadGapiAndGIS();
  }, []);

  const handleAuthClick = () => {
    const client = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (response: any) => {
        setToken(response.access_token);
        setIsSignedIn(true);
      },
    });

    client.requestAccessToken();
  };

  const handleSignoutClick = () => {
    (window as any).google.accounts.oauth2.revoke(token, () => {
      setIsSignedIn(false);
      setToken(null);
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-bold mb-4">Weather</h1>
        <Weather />
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-4">Affirmation</h1>
        <Affirmation />
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-4">Google Calendar & Tasks</h1>
        {isSignedIn ? (
          <>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleSignoutClick}
            >
              Sign Out
            </button>
            <Calendar gapi={gapi} />
            <Tasks gapi={gapi} />
          </>
        ) : (
          <Login onLogin={handleAuthClick} />
        )}
      </div>
    </div>
  );
}
