"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Login() {
  const { data: session, status } = useSession();

  const handleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <Card className="bg-white/10 border-none text-white">
      <CardHeader></CardHeader>
      {/* <CardContent>
        {session ? (
          <div>
            <p className="mb-4">Signed in as {session.user?.email}</p>
            <Button onClick={handleSignOut} variant="default">
              Sign Out
            </Button>
          </div>
        ) : (
          <>
            <p className="mb-4">
              Sign in with your Google account to access personalized features:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li>Manage your tasks</li>
              <li>View and edit your calendar</li>
              <li>Sync your data across devices</li>
            </ul>
            <Button onClick={handleSignIn} variant="default">
              Sign In with Google
            </Button>
          </>
        )}
      </CardContent> */}
    </Card>
  );
}
