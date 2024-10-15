"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const SCOPES =
  "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/tasks";

interface LoginProps {
  onLoginSuccess: (token: string, gapi: any) => void;
  onLogout: () => void;
}

export default function Login({ onLoginSuccess, onLogout }: LoginProps) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [gapi, setGapi] = useState<any>(null);

  useEffect(() => {
    const loadGapiAndGIS = async () => {
      const gapiScript = document.createElement("script");
      gapiScript.src = "https://apis.google.com/js/api.js";
      gapiScript.async = true;
      document.body.appendChild(gapiScript);

      gapiScript.onload = () => {
        const gapi = (window as any).gapi;
        gapi.load("client", async () => {
          await initGapiClient();
          setGapi(gapi);
          restoreSession();
        });
      };

      const gisScript = document.createElement("script");
      gisScript.src = "https://accounts.google.com/gsi/client";
      gisScript.async = true;
      document.body.appendChild(gisScript);
    };

    loadGapiAndGIS();
  }, []);

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

  const restoreSession = () => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      setIsSignedIn(true);
      (window as any).gapi.client.setToken({ access_token: storedToken });
      onLoginSuccess(storedToken, (window as any).gapi);
    }
  };

  const handleAuthClick = () => {
    const client = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (response: any) => {
        const { access_token } = response;
        setIsSignedIn(true);
        localStorage.setItem("access_token", access_token);
        (window as any).gapi.client.setToken({ access_token });
        onLoginSuccess(access_token, (window as any).gapi);
      },
    });

    client.requestAccessToken();
  };

  const handleSignoutClick = () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      (window as any).google.accounts.oauth2.revoke(token, () => {
        setIsSignedIn(false);
        localStorage.removeItem("access_token");
        onLogout();
      });
    }
  };

  return (
    <Card className="bg-white/10 border-none text-white">
      <CardHeader></CardHeader>
      <CardContent>
        <p className="mb-4">
          Sign in with your Google account to access personalized features:
        </p>
        <ul className="list-disc pl-5 mb-4">
          <li>Manage your tasks</li>
          <li>View and edit your calendar</li>
          <li>Sync your data across devices</li>
        </ul>
        <Button onClick={handleAuthClick} variant="default">
          Sign In with Google
        </Button>
      </CardContent>
    </Card>
  );
}
