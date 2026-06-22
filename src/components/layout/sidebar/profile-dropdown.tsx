"use client";

import * as React from "react";
import { useSettings } from "@/contexts/settings-context";
import {
  RiAddLine,
  RiArrowDownSLine,
  RiLayoutGridLine,
  RiLogoutBoxRLine,
  RiMoonLine,
  RiPulseLine,
  RiSettings2Line,
} from "@remixicon/react";
import { useTheme } from "next-themes";

import { notification } from "@/hooks/use-notification";

import * as Button from "@/components/ui/button";
import * as Divider from "@/components/ui/divider";
import * as Dropdown from "@/components/ui/dropdown";
import { ShortcutKbd } from "@/components/ui/shortcut-kbd";
import * as Switch from "@/components/ui/switch";

export function ProfileDropdown() {
  const { theme, setTheme } = useTheme();
  const { openSettings } = useSettings();

  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <Button.Root
          variant='neutral'
          mode='ghost'
          size='xxsmall'
          className='hover:bg-bg-soft-200 data-[state=open]:bg-bg-soft-200 text-text-strong-950 gap-1.5 font-medium'
        >
          <div className='text-static-white text-2xs grid size-5 place-items-center rounded-md bg-[#5f6200]'>
            PR
          </div>
          praveen-netinti
          <RiArrowDownSLine className='text-text-sub-600 size-4' />
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content align='start' className='max-w-56.5'>
        <Dropdown.Item
          onSelect={(e) => {
            e.preventDefault();
            setTheme(theme === "light" ? "dark" : "light");
          }}
        >
          <Dropdown.ItemIcon as={RiMoonLine} />
          Dark Mode
          <span className='flex-1' />
          <Switch.Root
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
        </Dropdown.Item>
        <Divider.Root variant='line-spacing' className='py-1.5' />
        <Dropdown.Item onSelect={() => openSettings()}>
          <Dropdown.ItemIcon as={RiSettings2Line} />
          Settings
          <ShortcutKbd keys={["G", "S"]} />
        </Dropdown.Item>

        <Divider.Root variant='line-spacing' className='py-1.5' />

        <Dropdown.Group>
          <Dropdown.Item onSelect={() => openSettings("profile")}>
            <Dropdown.ItemIcon as={RiPulseLine} />
            Activity
          </Dropdown.Item>
          <Dropdown.Item onSelect={() => openSettings("integrations")}>
            <Dropdown.ItemIcon as={RiLayoutGridLine} />
            Integrations
          </Dropdown.Item>
        </Dropdown.Group>
        <Divider.Root variant='line-spacing' className='py-1.5' />
        <Dropdown.Group>
          <Dropdown.Item
            onSelect={() => {
              notification({
                status: "information",
                variant: "stroke",
                title: "Coming soon",
                description: "Multi-account support is on the roadmap.",
                duration: 3000,
              });
            }}
          >
            <Dropdown.ItemIcon as={RiAddLine} />
            Add Account
          </Dropdown.Item>
          <Dropdown.Item
            onSelect={() => {
              notification({
                status: "success",
                variant: "stroke",
                title: "Logged out",
                description: "You have been signed out successfully.",
                duration: 3000,
              });
            }}
          >
            <Dropdown.ItemIcon as={RiLogoutBoxRLine} />
            Logout
            <ShortcutKbd keys="Alt+Shift+Q" />
          </Dropdown.Item>
        </Dropdown.Group>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
