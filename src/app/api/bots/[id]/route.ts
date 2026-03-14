import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const bot = await (prisma as any).minecraftBot.findUnique({
      where: { id }
    });

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 });
    }

    return NextResponse.json(bot);
  } catch (error) {
    console.error("Error fetching bot:", error);
    return NextResponse.json(
      { error: "Failed to fetch bot" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, ...otherData } = body;

    // Fetch bot for context
    const dbBot = await (prisma as any).minecraftBot.findUnique({
      where: { id }
    });

    if (!dbBot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 });
    }

    // ✨ IMPORTANT: Bot creation/disconnection is NOW handled by server.ts via WebSocket!
    // This API route only updates the database status for persistence
    // The actual bot lifecycle is managed by server.ts (port 3001) as the single source of truth

    // Update bot status in database
    const updatedBot = await (prisma as any).minecraftBot.update({
      where: { id },
      data: { status, ...otherData }
    });

    return NextResponse.json(updatedBot);
  } catch (error) {
    console.error("Patch error:", error);
    return NextResponse.json(
      { error: "Failed to update bot" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { botUsername, serverName, serverIp, serverPort, version } = await request.json();

    const bot = await (prisma as any).minecraftBot.update({
      where: { id },
      data: {
        botUsername,
        serverName,
        serverIp,
        serverPort: serverPort || 25565,
        version: version || null
      }
    });

    return NextResponse.json(bot);
  } catch (error) {
    console.error("Error updating bot:", error);
    return NextResponse.json(
      { error: "Failed to update bot" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await (prisma as any).minecraftBot.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting bot:", error);
    return NextResponse.json(
      { error: "Failed to delete bot" },
      { status: 500 }
    );
  }
}
