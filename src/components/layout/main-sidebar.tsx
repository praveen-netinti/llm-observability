"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { RiCloseLine, RiLayoutRight2Line, RiSearchLine, RiSideBarLine } from "@remixicon/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/utils/cn";

import * as Button from "@/components/ui/button";

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
          "bg-bg-weak-50 fixed z-50 h-full transition-all duration-300 ease-in-out lg:relative lg:translate-x-0",
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
              <Tooltip.Provider delayDuration={300}>
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
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className='bg-bg-strong-950 text-text-white-0 shadow-tooltip z-61 rounded-md px-2 py-1 text-xs font-medium'
                      side='right'
                      sideOffset={8}
                      align='center'
                    >
                      Toggle sidebar
                      <Tooltip.Arrow className='fill-bg-strong-950' />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>

            <div className='space-y-3'>
              <Tooltip.Provider delayDuration={300}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <Button.Root
                      variant='neutral'
                      mode='ghost'
                      size='xsmall'
                      aria-label='Toggle Search'
                      className='group/search hover:bg-bg-soft-200 cursor-pointer'
                    >
                      <Button.Icon
                        as={RiSearchLine}
                        className='text-text-soft-400 group-hover/search:text-text-sub-600'
                      />
                    </Button.Root>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className='bg-bg-strong-950 text-text-white-0 shadow-tooltip z-50 rounded-md px-2 py-1 text-xs font-medium'
                      side='right'
                      sideOffset={8}
                      align='center'
                    >
                      Toggle Search
                      <Tooltip.Arrow className='fill-bg-strong-950' />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>

              {mainNavSection.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.href.split("?")[0];
                return (
                  <Tooltip.Provider key={item.id} delayDuration={300}>
                    <Tooltip.Root>
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
                      <Tooltip.Portal>
                        <Tooltip.Content
                          className='bg-bg-strong-950 text-text-white-0 shadow-tooltip z-50 rounded-md px-2 py-1 text-xs font-medium'
                          side='right'
                          sideOffset={8}
                          align='center'
                        >
                          {item.label}
                          <Tooltip.Arrow className='fill-bg-strong-950' />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  </Tooltip.Provider>
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
                    <Tooltip.Portal>
                      <Tooltip.Content
                        // className='bg-bg-strong-950 text-text-white-0 shadow-tooltip z-50 rounded-lg px-2.5 py-1 text-xs'
                        className='bg-bg-white-0 text-text-strong-950 shadow-tooltip border-stroke-soft-200 z-50 rounded-lg border px-2.5 py-1 text-xs'
                        sideOffset={6}
                        align='center'
                      >
                        Toggle sidebar
                      </Tooltip.Content>
                    </Tooltip.Portal>
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

            {/* Announcement footer */}
            {/* {sidebarData.announcement && (
              <div className='mx-3.5 mb-4 pt-3'>
                <div className='bg-bg-white-0 border-stroke-soft-200 flex flex-col gap-1.5 overflow-hidden rounded-xl border p-3'>
                  <span className='text-text-strong-950 text-xs font-semibold'>
                    {sidebarData.announcement.title}
                  </span>
                  <p className='text-text-sub-600 text-xs leading-relaxed text-wrap wrap-break-word'>
                    {sidebarData.announcement.description}
                  </p>
                  <Link
                    href={sidebarData.announcement.href}
                    className='text-primary-base hover:text-primary-dark text-xs font-medium'
                  >
                    {sidebarData.announcement.linkLabel ?? "Learn more"} →
                  </Link>
                </div>
              </div>
            )} */}

            <HelpDropdown />
          </nav>
        </div>
      </div>
    </>
  );
});

MainSidebar.displayName = "MainSidebar";

export default MainSidebar;
