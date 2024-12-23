"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { SAMPLE_DATA } from "@/utils/sampleData";
import { useSession } from "next-auth/react";
import React from "react";

const Greeting: React.FC = () => {
  const { data: session } = useSession();
  const username = session?.user?.name || SAMPLE_DATA.username;

  return (
    <Card className="border-none text-white content-center">
      <CardHeader>
        <span>Hello {username}!</span>
      </CardHeader>
    </Card>
  );
};

export default Greeting;
