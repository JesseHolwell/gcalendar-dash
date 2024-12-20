import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { refreshToken } from "@/utils/refreshToken";
import { JWT } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  try {
    let token = (await getToken({ req })) as JWT;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (token.expiresAt && Date.now() > token.expiresAt) {
      token = await refreshToken(req);
    }

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10`,
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
