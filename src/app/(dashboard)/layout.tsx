'use client';

import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppTopbar } from '@/components/layout/app-topbar';
import { SidebarProvider } from '@/components/ui/sidebar';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex min-h-screen w-full flex-col">
        <AppTopbar />
        <main className="flex-1 bg-muted/40 p-6 md:p-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
