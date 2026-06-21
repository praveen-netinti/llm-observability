"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useSidebar } from "@/contexts/sidebar-context";
import { RiArrowRightSLine, RiFilter3Line, RiLayoutLeft2Line } from "@remixicon/react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/utils";

import { IssuesDisplayOptions, type DisplayState } from "@/components/issues/display-options";
import * as Breadcrumb from "@/components/ui/breadcrumb";
import * as Button from "@/components/ui/button";

import { IconUserBox } from "../traces/layout";

export type IssuesViewFilter = "all" | "active" | "backlog";

type IssuesLayoutContextType = {
  display: DisplayState;
  setDisplay: (d: DisplayState | ((prev: DisplayState) => DisplayState)) => void;
};

const IssuesLayoutContext = createContext<IssuesLayoutContextType | null>(null);

export function useIssuesLayout() {
  const ctx = useContext(IssuesLayoutContext);
  if (!ctx) throw new Error("useIssuesLayout must be used within IssuesLayout");
  return ctx;
}

const TABS = [
  { value: "all", label: "All Issues", href: "/issues/all" },
  { value: "active", label: "Active", href: "/issues/active" },
  { value: "backlog", label: "Backlog", href: "/issues/backlog" },
];

export default function IssuesLayout({ children }: { children: ReactNode }) {
  const { onMenuClick } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const [display, setDisplay] = useState<DisplayState>({
    view: "list",
    grouping: "status",
    showEmptyGroups: false,
    nestedSubIssues: false,
    visibleProperties: ["id", "status", "priority", "assignee", "created"],
  });

  const currentTab = pathname.includes("/active")
    ? "active"
    : pathname.includes("/backlog")
      ? "backlog"
      : "all";

  const isDetailPage = /\/issues\/[A-Z]+-\d+/i.test(pathname);

  if (isDetailPage) {
    return (
      <IssuesLayoutContext.Provider value={{ display, setDisplay }}>
        {children}
      </IssuesLayoutContext.Provider>
    );
  }

  return (
    <IssuesLayoutContext.Provider value={{ display, setDisplay }}>
      <div className='flex h-full flex-col select-none lg:p-2 lg:pl-0'>
        <div className='bg-bg-white-0 lg:border-stroke-soft-200 flex h-full flex-col lg:rounded-2xl lg:border'>
          {/* Header */}
          <div className='border-faded-lighter dark:border-stroke-soft-200 flex h-11 w-full items-center border-b px-2'>
            <Button.Root
              variant='neutral'
              mode='ghost'
              size='xxsmall'
              onClick={onMenuClick}
              className='size-7 cursor-pointer rounded-lg p-0 lg:hidden'
              autoFocus={false}
            >
              <Button.Icon as={RiLayoutLeft2Line} className='text-text-soft-400' />
            </Button.Root>

            <Breadcrumb.Root className='ml-2.5 gap-0.5'>
              <Breadcrumb.Item className='text-[13px]!'>
                <Breadcrumb.Icon as={IconUserBox} className='size-4' />
                Praveen-netinti
              </Breadcrumb.Item>

              <Breadcrumb.ArrowIcon as={RiArrowRightSLine} />

              <Breadcrumb.Item className='text-[13px]!' active>
                Issues
              </Breadcrumb.Item>
            </Breadcrumb.Root>
          </div>

          {/* Tabs + toolbar */}
          <div className='flex h-11 w-full items-center gap-1.5 px-2.5'>
            {TABS.map((tab) => (
              <Button.Root
                key={tab.value}
                size='xxsmall'
                className={cn(
                  "text-text-sub-600 hover:ring-stroke-soft-200 rounded-full px-2.5 text-xs shadow-none!",
                  currentTab === tab.value && "bg-bg-weak-50 text-text-strong-950",
                )}
                variant='neutral'
                mode='stroke'
                onClick={() => router.push(tab.href)}
              >
                {tab.label}
              </Button.Root>
            ))}

            <Button.Root
              variant='neutral'
              mode='stroke'
              size='xxsmall'
              className='ml-auto size-7 gap-1.5 rounded-full'
            >
              <Button.Icon as={RiFilter3Line} className='size-3.5' />
              <span className='sr-only'>Filter</span>
            </Button.Root>

            <IssuesDisplayOptions
              display={display}
              onChange={setDisplay}
            />
          </div>

          {/* Content */}
          <div className='relative flex-1 overflow-hidden'>{children}</div>
        </div>
      </div>
    </IssuesLayoutContext.Provider>
  );
}
