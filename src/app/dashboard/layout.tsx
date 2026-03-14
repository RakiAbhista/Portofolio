import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

export const metadata = {
  title: "Dashboard - Minecraft Bot Manager",
  description: "Manage your Minecraft bots"
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 bg-background">
        {children}
      </main>
    </div>
  );
}
