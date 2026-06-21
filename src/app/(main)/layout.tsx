"use client";

import { useRef } from "react";
import { SidebarProvider } from "@/contexts/sidebar-context";
import { IssuesProvider } from "@/contexts/issues-context";
import { SettingsProvider } from "@/contexts/settings-context";

import MainSidebar, { MainSidebarRef } from "@/components/layout/main-sidebar";
import { AppCommandMenu } from "@/components/command-menu";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const sidebarRef = useRef<MainSidebarRef>(null);

  const handleMenuClick = () => {
    sidebarRef.current?.toggleMobileSidebar();
  };

  return (
    <SidebarProvider onMenuClick={handleMenuClick}>
      <IssuesProvider>
        <SettingsProvider>
          <div className='bg-bg-weak-50 relative flex h-dvh overflow-hidden lg:h-screen'>
            <MainSidebar ref={sidebarRef} />
            <main className='w-full flex-1 overflow-hidden'>{children}</main>
            <AppCommandMenu />
          </div>
        </SettingsProvider>
      </IssuesProvider>
    </SidebarProvider>
  );
}
