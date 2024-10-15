"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import Affirmation from "./Affirmation";
import AppDrawer from "./AppDrawer";
import Clock from "./Clock";
import Login from "./Login";
import Tasks from "./Tasks";
import Weather from "./Weather";

const Calendar = dynamic(() => import("./Calendar"), { ssr: false });

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [gapi, setGapi] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  // const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleLoginSuccess = (accessToken: string, gapiInstance: any) => {
    setIsSignedIn(true);
    setToken(accessToken);
    setGapi(gapiInstance);
  };

  const handleLogout = useCallback(() => {
    //TODO: put this in Login.tsx
    if (token) {
      (window as any).google.accounts.oauth2.revoke(token, () => {
        setIsSignedIn(false);
        setToken(null);
        setGapi(null);
        localStorage.removeItem("access_token");
      });
    }
  }, [token]);

  // const toggleDrawer = () => {
  //   setIsDrawerOpen(!isDrawerOpen);
  // };

  return (
    <div className="min-h-screen bg-[url('/images/forest-background.jpg')] bg-cover bg-center">
      <div className="min-h-screen bg-black/50 p-12 text-white">
        <div className="mx-auto space-y-8">
          <div className="flex md:flex-row flex-col justify-between items-center w-full gap-8">
            <Affirmation />
            <Clock />
            <Weather />
            <AppDrawer onSignOut={handleLogout} isSignedIn={isSignedIn} />
          </div>
          {isSignedIn ? (
            <div className="grid md:grid-cols-2 gap-8">
              <Tasks gapi={gapi} />
              <Calendar gapi={gapi} />
            </div>
          ) : (
            <Login
              onLoginSuccess={handleLoginSuccess}
              onLogout={handleLogout}
            />
          )}
        </div>
      </div>
    </div>
  );
}
