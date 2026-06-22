"use client";

import { createContext, useContext } from "react";

interface SidebarContextType {
  onMenuClick?: () => void;
  toggleSidebar?: () => void;
}

const SidebarContext = createContext<SidebarContextType>({});

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({
  children,
  onMenuClick,
  toggleSidebar,
}: {
  children: React.ReactNode;
  onMenuClick?: () => void;
  toggleSidebar?: () => void;
}) => {
  return (
    <SidebarContext.Provider value={{ onMenuClick, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};
