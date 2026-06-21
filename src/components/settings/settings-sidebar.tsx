"use client";

import {
  RiAlarmWarningFill,
  RiArrowRightSLine,
  RiBankCardFill,
  RiEyeFill,
  RiFolder3Fill,
  RiGroupFill,
  RiKey2Fill,
  RiPlugFill,
  RiRobot2Fill,
  RiSettings4Fill,
  RiShieldKeyholeFill,
  RiShieldUserFill,
  RiTerminalBoxFill,
  RiUser3Fill,
} from "@remixicon/react";

import type { SettingsPageId } from "@/contexts/settings-context";
import SettingsHeader from "@/components/layout/settings-header";

interface BaseItem {
  id: SettingsPageId;
  label: string;
}

interface RegularItem extends BaseItem {
  icon: React.ComponentType<{ className?: string }>;
  isUserItem?: false;
}

interface UserItem extends BaseItem {
  icon: null;
  isUserItem: true;
}

type SidebarItem = RegularItem | UserItem;

interface Section {
  id: string;
  title: string;
  items: SidebarItem[];
}

interface SettingsData {
  user: {
    name: string;
    isPro: boolean;
  };
  sections: Section[];
}

function isUserItem(item: SidebarItem): item is UserItem {
  return item.isUserItem === true;
}

function isRegularItem(item: SidebarItem): item is RegularItem {
  return item.isUserItem !== true;
}

const settingsData: SettingsData = {
  user: {
    name: "Neosigma",
    isPro: true,
  },
  sections: [
    {
      id: "organization",
      title: "Organization",
      items: [
        { id: "organization", label: "Neosigma", icon: null, isUserItem: true },
        { id: "members", label: "Members", icon: RiGroupFill },
        { id: "billing-usage", label: "Billing & Usage", icon: RiBankCardFill },
      ],
    },
    {
      id: "account",
      title: "Account",
      items: [
        { id: "profile", label: "Profile", icon: RiUser3Fill },
        { id: "preferences", label: "Preferences", icon: RiSettings4Fill },
        { id: "appearance", label: "Appearance", icon: RiEyeFill },
      ],
    },
    {
      id: "observability",
      title: "Observability",
      items: [
        { id: "projects", label: "Projects", icon: RiFolder3Fill },
        { id: "model-providers", label: "Model Providers", icon: RiRobot2Fill },
        { id: "api-keys", label: "API Keys", icon: RiKey2Fill },
        { id: "alerts", label: "Alerts", icon: RiAlarmWarningFill },
      ],
    },
    {
      id: "security",
      title: "Security & Data",
      items: [
        { id: "security", label: "Security", icon: RiShieldKeyholeFill },
        { id: "data-privacy", label: "Data & Privacy", icon: RiShieldUserFill },
      ],
    },
    {
      id: "developer",
      title: "Developer",
      items: [
        { id: "integrations", label: "Integrations", icon: RiPlugFill },
        { id: "advanced", label: "Advanced", icon: RiTerminalBoxFill },
      ],
    },
  ],
};

interface SettingsSidebarProps {
  activePage: SettingsPageId;
  onPageChange: (pageId: SettingsPageId) => void;
  onClose?: () => void;
  isMobileContentShown?: boolean;
}

export default function SettingsSidebar({
  activePage,
  onPageChange,
  onClose,
  isMobileContentShown,
}: SettingsSidebarProps) {
  return (
    <div className='bg-bg-white-0 flex h-dvh w-full flex-col rounded-t-3xl py-4 lg:h-full lg:min-h-full lg:w-1/5 lg:min-w-60 lg:rounded-none lg:p-3.5'>
      <div className='flex w-full flex-shrink-0 lg:hidden'>
        <SettingsHeader
          title='Settings'
          description='Manage your organization and observability settings.'
          onClose={onClose}
        />
      </div>
      <div className='flex min-h-0 w-full flex-1 flex-col gap-4 overflow-y-auto lg:gap-3'>
        {settingsData.sections.map((section, sectionIndex) => (
          <div
            key={section.id}
            className={`border-stroke-soft-200 flex flex-col gap-1 border-t pt-4 lg:border-none lg:pt-0 ${sectionIndex === 0 ? "border-t-0" : ""} ${sectionIndex === settingsData.sections.length - 1 ? "pb-3" : ""}`}
          >
            <div className='text-text-soft-400 px-7 py-1 text-xs font-medium lg:px-2'>
              {section.title}
            </div>

            <div className='flex flex-col gap-1 px-4 lg:px-0'>
              {section.items.map((item) => {
                const isActive =
                  isMobileContentShown === false ? false : activePage === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => onPageChange(item.id)}
                    className={`group rounded-10 flex cursor-pointer items-center gap-2 p-2 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "bg-bg-weak-50 text-text-strong-950"
                        : "text-text-sub-600 hover:bg-bg-weak-50 hover:text-text-sub-600"
                    }`}
                  >
                    {isUserItem(item) ? (
                      <>
                        <div className='ease flex size-5 items-center justify-center rounded-full bg-gray-200 transition duration-200'>
                          <div className='text-static-black text-xs font-medium'>
                            {settingsData.user.name.charAt(0)}
                          </div>
                        </div>
                        <div className='flex items-center gap-1'>
                          <div
                            className={`ease text-sm font-medium transition duration-200 ${
                              isActive ? "text-text-strong-950" : "text-text-sub-600"
                            }`}
                          >
                            {settingsData.user.name}
                          </div>
                          {settingsData.user.isPro && (
                            <div className='text-feature-base text-2xs bg-feature-lighter rounded-[5px] px-1.5 py-0.5 font-semibold uppercase'>
                              PRO
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        {isRegularItem(item) && (
                          <item.icon
                            className={`ease size-5 transition duration-200 ${
                              isActive
                                ? "text-green-600"
                                : "text-text-disabled-300 group-hover:text-text-soft-400"
                            }`}
                          />
                        )}
                        {item.label}
                      </>
                    )}
                    {isActive && (
                      <RiArrowRightSLine className='text-text-soft-400 ml-auto size-4' />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
