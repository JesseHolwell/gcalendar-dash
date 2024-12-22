"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const Greeting: React.FC = () => {
  const { data: session } = useSession();

  return (
    <Card className="bg-white/10 border-none text-white content-center">
      <CardHeader>
        <span>Hello {session?.user?.name}!</span>
      </CardHeader>
    </Card>
  );
};

export default Greeting;
