"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bot, Users, Activity } from "lucide-react";

export default function DashboardHome() {
  const { data: session } = useSession();
  const router = useRouter();
  const isSuperadmin = session?.user?.role === "superadmin";

  // Redirect to bots page after 2 seconds or allow navigation
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard/bots");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="p-8 h-screen flex flex-col">
      <div className="max-w-6xl mx-auto flex-1 flex flex-col justify-center">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {session?.user?.email?.split("@")[0]}! 👋
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your Minecraft bots and {isSuperadmin ? "system users" : "configurations"}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Bots Card */}
          <div
            onClick={() => router.push("/dashboard/bots")}
            className="p-6 bg-card border border-border rounded-lg hover:border-primary/50 cursor-pointer transition group"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-lg">Minecraft Bots</h3>
              <Bot className="h-6 w-6 text-primary group-hover:scale-110 transition" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Create, manage, and monitor your Minecraft bot instances
            </p>
            <p className="text-xs text-muted-foreground">Click to manage bots →</p>
          </div>

          {/* Users Card (Superadmin only) */}
          {isSuperadmin && (
            <div
              onClick={() => router.push("/dashboard/users")}
              className="p-6 bg-card border border-border rounded-lg hover:border-primary/50 cursor-pointer transition group"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-lg">User Management</h3>
                <Users className="h-6 w-6 text-primary group-hover:scale-110 transition" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Create users, assign roles, and manage system access
              </p>
              <p className="text-xs text-muted-foreground">Click to manage users →</p>
            </div>
          )}

          {/* Activity Card */}
          <div className="p-6 bg-card border border-border rounded-lg">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-lg">Activity</h3>
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              System status and bot activity logs
            </p>
            <div className="text-xs text-green-600 font-medium">✓ All systems operational</div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Getting Started</h2>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="shrink-0 font-bold text-primary">1</span>
              <span>Navigate to <strong>Minecraft Bots</strong> to create your first bot</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 font-bold text-primary">2</span>
              <span>Enter bot configuration (username, server IP, port, version)</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 font-bold text-primary">3</span>
              <span>Toggle bot <strong>Online</strong> to connect to the Minecraft server</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 font-bold text-primary">4</span>
              <span>Click the <strong>Chat</strong> button to manage the bot in real-time</span>
            </li>
            {isSuperadmin && (
              <li className="flex gap-3">
                <span className="shrink-0 font-bold text-primary">5</span>
                <span>Visit <strong>User Management</strong> to create additional accounts</span>
              </li>
            )}
          </ol>
        </div>
      </div>
    </div>
  );
}
