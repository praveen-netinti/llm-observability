"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { RiCloseLine, RiLayoutRight2Line, RiSearchLine, RiSideBarLine } from "@remixicon/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/utils/cn";

import * as Button from "@/components/ui/button";
import * as Tooltip from "@/components/ui/tooltip";

import { HelpDropdown } from "./sidebar/help-dropdown";
import { NavItemLink } from "./sidebar/nav-item-link";
import { ProfileDropdown } from "./sidebar/profile-dropdown";
import { CommandMenuSearch } from "./sidebar/search";
import { sidebarData, type NavSection } from "./sidebar/sidebar-data";

export interface MainSidebarRef {
  toggleMobileSidebar: () => void;
}

const MainSidebar = forwardRef<MainSidebarRef>((_props, ref) => {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => setIsSidebarCollapsed((v) => !v);
  const toggleMobileSidebar = () => setIsMobileSidebarOpen((v) => !v);

  useImperativeHandle(ref, () => ({ toggleMobileSidebar }));

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  const handleLinkClick = () => {
    if (isMobileSidebarOpen) setIsMobileSidebarOpen(false);
  };

  const mainNavSection = sidebarData.sections[0] as NavSection;

  return (
    <>
      <div
        className={cn(
          "bg-bg-weak-50 fixed z-50 h-full transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 select-none",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
          isSidebarCollapsed ? "w-18" : "w-full lg:w-60",
        )}
      >
        {/* Collapsed sidebar */}
        <div
          onClick={toggleSidebar}
          className={cn(
            "group absolute inset-0 hidden h-full w-18 cursor-e-resize flex-col justify-between p-5 transition-opacity duration-300 lg:flex",
            isSidebarCollapsed
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0",
          )}
        >
          <div className='space-y-5'>
            <div className='before:bg-stroke-soft-200 relative flex pb-5 before:absolute before:right-0 before:bottom-0 before:left-0 before:h-px'>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Button.Root
                    variant='neutral'
                    mode='ghost'
                    size='xsmall'
                    aria-label='Toggle sidebar'
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSidebar();
                    }}
                    className='group/logo hover:bg-bg-soft-200 h-8 w-8 cursor-e-resize p-0'
                  >
                    <div className='text-static-white text-2xs grid size-8 place-items-center rounded-xl bg-[#5f6200] transition-opacity duration-200 group-hover:hidden'>
                      PR
                    </div>
                    <Button.Icon
                      as={RiSideBarLine}
                      className='text-text-soft-400 group-hover/logo:text-text-sub-600 hidden transition-opacity duration-200 group-hover:block'
                    />
                  </Button.Root>
                </Tooltip.Trigger>
                <Tooltip.Content side='right' sideOffset={8} align='center'>
                  Toggle sidebar
                </Tooltip.Content>
              </Tooltip.Root>
            </div>

            <div className='space-y-3'>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Button.Root
                    variant='neutral'
                    mode='ghost'
                    size='xsmall'
                    aria-label='Toggle Search'
                    className='group/search hover:bg-bg-soft-200 cursor-pointer'
                    onClick={(e) => {
                      e.stopPropagation();
                      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
                    }}
                  >
                    <Button.Icon
                      as={RiSearchLine}
                      className='text-text-soft-400 group-hover/search:text-text-sub-600'
                    />
                  </Button.Root>
                </Tooltip.Trigger>
                <Tooltip.Content side='right' sideOffset={8} align='center'>
                  Toggle Search
                </Tooltip.Content>
              </Tooltip.Root>

              {mainNavSection.items.map((item) => {
                const IconComponent = item.icon;
                  const isActive = pathname === item.href.split("?")[0] || (item.href !== "/" && pathname.startsWith(item.href.split("?")[0]));
                return (
                  <Tooltip.Root key={item.id}>
                    <Tooltip.Trigger asChild>
                      <Link
                        href={item.href}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLinkClick();
                        }}
                        className={cn(
                          "group/item flex items-center rounded-lg p-1.5 text-sm font-medium transition-colors duration-200",
                          isActive
                            ? "text-text-strong-950 bg-bg-soft-200"
                            : "text-text-sub-600 hover:bg-bg-soft-200",
                        )}
                      >
                        <IconComponent
                          className={cn(
                            "h-5 w-5 transition duration-200 ease-out",
                            isActive
                              ? "text-text-strong-950"
                              : "group-hover/item:text-text-sub-600 text-text-soft-400",
                          )}
                        />
                      </Link>
                    </Tooltip.Trigger>
                    <Tooltip.Content side='right' sideOffset={8} align='center'>
                      {item.label}
                    </Tooltip.Content>
                  </Tooltip.Root>
                );
              })}
            </div>
          </div>
        </div>

        {/* Expanded sidebar */}
        <div
          className={cn(
            "h-full transition-opacity duration-300 ease-in-out",
            !isSidebarCollapsed
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0",
          )}
        >
          <nav ref={sidebarRef} className='flex h-full w-full flex-col whitespace-nowrap lg:w-60'>
            {/* Header */}
            <div className='sticky top-0 z-10 pt-4.5'>
              <div className='flex items-center justify-between px-4 lg:pl-3.5'>
                <ProfileDropdown />
                <Button.Root
                  variant='neutral'
                  mode='ghost'
                  size='xxsmall'
                  onClick={toggleMobileSidebar}
                  className='group hover:bg-bg-soft-200 flex size-7 items-center justify-center p-0 lg:hidden'
                >
                  <Button.Icon
                    as={RiCloseLine}
                    className='text-text-soft-400 group-hover:text-text-sub-600'
                  />
                </Button.Root>
                <Tooltip.Provider delayDuration={300}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <Button.Root
                        variant='neutral'
                        mode='ghost'
                        size='xxsmall'
                        onClick={toggleSidebar}
                        className='group hover:bg-bg-soft-200 hidden cursor-w-resize lg:flex'
                      >
                        <Button.Icon
                          as={RiLayoutRight2Line}
                          className='text-text-soft-400 group-hover:text-text-sub-600'
                        />
                      </Button.Root>
                    </Tooltip.Trigger>
                    <Tooltip.Content sideOffset={6} align='center'>
                      Toggle sidebar
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </div>

              <CommandMenuSearch />
            </div>

            {/* Navigation sections */}
            <div className='flex-1 overflow-y-auto px-3.5' style={{ scrollbarWidth: "none" }}>
              {sidebarData.sections.map((section) => (
                <div key={section.id} className='mb-2'>
                  {section.title && (
                    <div className='text-text-soft-400 flex h-8 items-center px-2 text-xs font-medium'>
                      {section.title}
                    </div>
                  )}
                  <div className='space-y-0.5'>
                    {section.items.map((item) => (
                      <NavItemLink key={item.id} item={item} onClick={handleLinkClick} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <HelpDropdown />
          </nav>
        </div>
      </div>
    </>
  );
});

MainSidebar.displayName = "MainSidebar";

export default MainSidebar;
