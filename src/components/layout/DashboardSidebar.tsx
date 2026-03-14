"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { LogOut, Users, Bot, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

export function DashboardSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component only renders theme-dependent UI after mounting on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isSuperadmin = session?.user?.role === "superadmin";

  const menuItems = [
    {
      label: "Minecraft Bots",
      href: "/dashboard/bots",
      icon: Bot,
      visible: true
    },
    {
      label: "User Management",
      href: "/dashboard/users",
      icon: Users,
      visible: isSuperadmin
    }
  ];

  const visibleItems = menuItems.filter((item) => item.visible);

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold">Bot Dashboard</h2>
        <p className="text-xs text-muted-foreground mt-1">
          {session?.user?.email}
        </p>
        <p className="text-xs text-muted-foreground">
          {isSuperadmin ? "👑 Superadmin" : "👤 Admin"}
        </p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Theme & Logout */}
      <div className="p-4 border-t border-border space-y-2">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition font-medium text-sm"
        >
          {isMounted ? (
            <>
              {theme === "dark" ? (
                <>
                  <Sun className="h-5 w-5" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-5 w-5" />
                  <span>Dark Mode</span>
                </>
              )}
            </>
          ) : (
            // Server-side render placeholder - won't cause hydration mismatch
            <>
              <Sun className="h-5 w-5" />
              <span>Light Mode</span>
            </>
          )}
        </button>

        {/* Logout Button */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition font-medium text-sm"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
