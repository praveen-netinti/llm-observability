"use client";

import { useRef } from "react";
import { HotkeysProvider } from "@tanstack/react-hotkeys";
import { SidebarProvider } from "@/contexts/sidebar-context";
import { IssuesProvider } from "@/contexts/issues-context";
import { SettingsProvider } from "@/contexts/settings-context";
import { ShortcutsProvider } from "@/contexts/shortcuts-context";

import MainSidebar, { MainSidebarRef } from "@/components/layout/main-sidebar";
import { AppCommandMenu } from "@/components/command-menu";
import { GlobalHotkeys } from "@/components/global-hotkeys";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const sidebarRef = useRef<MainSidebarRef>(null);

  const handleMenuClick = () => {
    sidebarRef.current?.toggleMobileSidebar();
  };

  const handleToggleSidebar = () => {
    sidebarRef.current?.toggleSidebar();
  };

  return (
    <HotkeysProvider>
      <SidebarProvider onMenuClick={handleMenuClick} toggleSidebar={handleToggleSidebar}>
        <IssuesProvider>
          <SettingsProvider>
            <ShortcutsProvider>
              <div className='bg-bg-weak-50 relative flex h-dvh overflow-hidden lg:h-screen'>
                <MainSidebar ref={sidebarRef} />
                <main className='w-full flex-1 overflow-hidden'>{children}</main>
                <AppCommandMenu />
                <GlobalHotkeys />
              </div>
            </ShortcutsProvider>
          </SettingsProvider>
        </IssuesProvider>
      </SidebarProvider>
    </HotkeysProvider>
  );
}
