import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bots = await (prisma as any).MinecraftBot.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(bots);
  } catch (error) {
    console.error("Error fetching bots:", error);
    return NextResponse.json(
      { error: "Failed to fetch bots" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { botUsername, serverName, serverIp, serverPort, version } = await request.json();

    if (!botUsername || !serverName || !serverIp) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const bot = await (prisma as any).MinecraftBot.create({
      data: {
        botUsername,
        serverName,
        serverIp,
        serverPort: serverPort || 25565,
        version: version || null,
        status: "offline"
      }
    });

    return NextResponse.json(bot, { status: 201 });
  } catch (error) {
    console.error("Error creating bot:", error);
    return NextResponse.json(
      { error: "Failed to create bot" },
      { status: 500 }
    );
  }
}
