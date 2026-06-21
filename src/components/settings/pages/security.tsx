"use client";

import { useState } from "react";
import { RiCloseLine, RiComputerLine, RiSmartphoneLine } from "@remixicon/react";

import * as Button from "@/components/ui/button";
import * as Switch from "@/components/ui/switch";

interface AccountSecuritySetting {
  id: string;
  label: string;
  description: string;
  type: "button" | "switch";
  buttonText?: string;
  enabled?: boolean;
}

interface ActiveSession {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  mobile?: boolean;
}

const accountSecurityData: AccountSecuritySetting[] = [
  { id: "password", label: "Password", description: "Last changed 3 months ago", type: "button", buttonText: "Change" },
  { id: "two-factor-auth", label: "Two-factor authentication", description: "Add an extra layer of security to your account", type: "button", buttonText: "Enable 2FA" },
  { id: "sso", label: "SAML SSO", description: "Require single sign-on for all members", type: "switch", enabled: true },
  { id: "login-notifications", label: "Login notifications", description: "Get notified of new sign-ins", type: "switch", enabled: true },
];

const initialSessions: ActiveSession[] = [
  { id: "1", device: "Chrome · macOS", location: "New York, US", ipAddress: "108.62.8.33" },
  { id: "2", device: "Firefox · Linux", location: "London, UK", ipAddress: "81.12.69.144" },
  { id: "3", device: "Neosigma iOS", location: "Toronto, CA", ipAddress: "206.14.2.89", mobile: true },
];

export default function Security() {
  const [accountSecurity, setAccountSecurity] = useState(() => {
    const initial: Record<string, boolean> = {};
    accountSecurityData.forEach((s) => {
      if (s.type === "switch" && s.enabled !== undefined) initial[s.id] = s.enabled;
    });
    return initial;
  });
  const [sessions, setSessions] = useState(initialSessions);

  return (
    <div className='flex h-full w-full flex-col gap-5 overflow-y-auto px-0 pb-8 lg:gap-7 lg:px-7 lg:pb-0'>
      <div className='flex flex-col gap-5 px-5 pt-5 lg:flex-row lg:gap-4 lg:px-0 lg:pt-7'>
        <div className='flex flex-col gap-1 lg:max-w-50 lg:min-w-50 xl:max-w-75 xl:min-w-75'>
          <h3 className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
            Account security
          </h3>
          <p className='text-text-soft-400 tracking-spacing-tiny-2 text-xs font-medium lg:text-sm'>
            Password & login security settings.
          </p>
        </div>

        <div className='border-stroke-soft-200 flex w-full flex-col gap-5 border-t pt-4 lg:gap-4 lg:border-t-0 lg:pt-0'>
          {accountSecurityData.map((setting) => (
            <div
              key={setting.id}
              className={`flex ${setting.type === "button" ? "flex-col items-start gap-4 lg:flex-row lg:items-center" : "items-center"} justify-between`}
            >
              <div className='flex flex-col gap-1'>
                <div className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
                  {setting.label}
                </div>
                <div className='text-text-soft-400 text-xs font-medium lg:text-sm'>
                  {setting.description}
                </div>
              </div>

              {setting.type === "button" && (
                <Button.Root
                  size='xsmall'
                  variant='neutral'
                  mode='stroke'
                  className='text-text-sub-600 !rounded-10 w-full cursor-pointer px-3 text-sm font-medium lg:w-fit'
                >
                  {setting.buttonText}
                </Button.Root>
              )}

              {setting.type === "switch" && (
                <Switch.Root
                  checked={accountSecurity[setting.id]}
                  onCheckedChange={(checked) =>
                    setAccountSecurity((prev) => ({ ...prev, [setting.id]: checked }))
                  }
                  className='[&>div]:group-data-[state=checked]/switch:!bg-success-base [&>div]:group-hover:data-[state=checked]/switch:!bg-success-base cursor-pointer'
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className='border-stroke-soft-200 flex flex-col gap-5 border-t px-5 pt-5 lg:flex-row lg:gap-4 lg:px-0 lg:pt-7'>
        <div className='flex flex-col gap-1 lg:max-w-50 lg:min-w-50 xl:max-w-75 xl:min-w-75'>
          <h3 className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
            Active sessions
          </h3>
          <p className='text-text-soft-400 tracking-spacing-tiny-2 text-xs font-medium lg:text-sm'>
            Manage your logged-in devices.
          </p>
        </div>

        <div className='flex w-full flex-col gap-4'>
          <div className='flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-center lg:gap-4'>
            <div className='flex flex-col gap-1'>
              <div className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
                Where you&apos;re signed in
              </div>
              <div className='text-text-soft-400 text-xs font-medium lg:text-sm'>
                Revoke any session you don&apos;t recognize
              </div>
            </div>
            <Button.Root
              size='xsmall'
              variant='neutral'
              mode='stroke'
              className='text-text-sub-600 !rounded-10 w-full cursor-pointer px-3 text-sm font-medium lg:w-fit'
            >
              Revoke all
            </Button.Root>
          </div>

          <div className='border-stroke-soft-200 flex flex-col gap-5 border-t pt-5'>
            {sessions.map((session) => (
              <div key={session.id} className='flex items-center justify-between gap-2.5'>
                <div className='flex w-[40%] items-center gap-2'>
                  <div className='bg-bg-weak-50 grid size-7 shrink-0 place-items-center rounded-full'>
                    {session.mobile ? (
                      <RiSmartphoneLine className='text-text-soft-400 size-4' />
                    ) : (
                      <RiComputerLine className='text-text-soft-400 size-4' />
                    )}
                  </div>
                  <div className='text-text-sub-600 tracking-spacing-tiny-2 truncate text-sm font-medium'>
                    {session.device}
                  </div>
                </div>
                <div className='text-text-soft-400 w-[30%] truncate text-xs font-medium lg:text-sm'>
                  {session.location}
                </div>
                <div className='text-text-soft-400 hidden w-[20%] text-xs font-medium sm:block lg:text-sm'>
                  {session.ipAddress}
                </div>
                <Button.Root
                  size='xsmall'
                  variant='neutral'
                  mode='ghost'
                  className='hover:bg-bg-weak-50 size-5 cursor-pointer rounded-sm p-0 transition-colors'
                  onClick={() => setSessions((prev) => prev.filter((s) => s.id !== session.id))}
                >
                  <RiCloseLine className='text-text-soft-400 size-5' />
                </Button.Root>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
