"use client";

import dynamic from "next/dynamic";
import { useCallback, useState, useEffect } from "react";
import Affirmation from "./Affirmation";
import AppDrawer from "./AppDrawer";
import Clock from "./Clock";
import Login from "./Login";
import Tasks from "./Tasks";
import Weather from "./Weather";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { REFRESH_TIME } from "../utils/config";

// const Calendar = dynamic(() => import("./Calendar"), { ssr: false });
import Calendar from "./Calendar";

export default function App() {
  // const [isSignedIn, setIsSignedIn] = useState(false);
  // const [gapi, setGapi] = useState<any>(null);
  // const [token, setToken] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // const handleLoginSuccess = (accessToken: string, gapiInstance: any) => {
  // setIsSignedIn(true);
  // setToken(accessToken);
  // setGapi(gapiInstance);
  // };

  // const handleLogout = useCallback(() => {
  //   if (token) {
  //     (window as any).google.accounts.oauth2.revoke(token, () => {
  //       setIsSignedIn(false);
  //       setToken(null);
  //       setGapi(null);
  //       localStorage.removeItem("access_token");
  //     });
  //   }
  // }, [token]);

  const refreshData = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    // let interval: NodeJS.Timeout;

    // Update the data every hour
    const interval = setInterval(() => {
      refreshData();
    }, REFRESH_TIME);

    // Clean up the interval on component unmount or when user signs out
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  });

  return (
    <div className="min-h-screen bg-[url('/images/forest-background.jpg')] bg-cover bg-center bg-fixed">
      <div className="min-h-screen bg-black/75 p-12 text-white">
        <div className="mx-auto space-y-8">
          <div className="flex md:flex-row flex-col justify-between items-center w-full gap-8 items-stretch">
            <Affirmation />
            <Clock />
            <Weather refreshTrigger={refreshTrigger} />
            <div className="flex w-full md:w-auto justify-end -order-1 md:order-1 items-center">
              <Button
                variant="ghost"
                onClick={refreshData}
                className="mr-4"
                size="icon"
              >
                <RefreshCw className="h-6 w-6" />
              </Button>
              <AppDrawer />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Tasks />
            <Calendar />
          </div>
        </div>
      </div>
    </div>
  );
}
