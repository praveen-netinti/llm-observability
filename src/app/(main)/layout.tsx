"use client";

import { useRef } from "react";
import { SidebarProvider } from "@/contexts/sidebar-context";

import MainSidebar, { MainSidebarRef } from "@/components/layout/main-sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const sidebarRef = useRef<MainSidebarRef>(null);

  const handleMenuClick = () => {
    sidebarRef.current?.toggleMobileSidebar();
  };

  return (
    <SidebarProvider onMenuClick={handleMenuClick}>
      <div className='bg-bg-weak-50 relative flex h-dvh overflow-hidden lg:h-screen'>
        <MainSidebar ref={sidebarRef} />
        <main className='w-full flex-1'>{children}</main>
      </div>
    </SidebarProvider>
  );
}
