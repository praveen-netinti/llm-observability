"use client";

import * as React from "react";
import {
  RiBook2Fill,
  RiKeyboardBoxLine,
  RiMessage2Line,
  RiQuestionMark,
  RiSearchLine,
  RiSettings2Line,
  RiSlackFill,
} from "@remixicon/react";

import * as Button from "@/components/ui/button";
import * as Dropdown from "@/components/ui/dropdown";
import { useSettings } from "@/contexts/settings-context";

export function HelpDropdown() {
  const { openSettings } = useSettings();

  return (
    <div className='relative shrink-0 p-5 lg:px-3.5 lg:pt-4 lg:pb-3.5'>
      <Dropdown.Root>
        <Dropdown.Trigger asChild>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='xsmall'
            className='border-stroke-soft-200 hover:bg-bg-soft-200 size-8 rounded-full border bg-transparent shadow-none ring-0'
          >
            <Button.Icon as={RiQuestionMark} className='size-4' />
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content align='start' className='max-w-66'>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiSearchLine} />
            Search for help...
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiBook2Fill} />
            Docs
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiMessage2Line} />
            Contact us
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiKeyboardBoxLine} />
            Keyboard shortcuts
            <span className='text-2xs text-text-sub-600 ml-auto'>⌘ /</span>
          </Dropdown.Item>
          <Dropdown.Item onSelect={() => openSettings()}>
            <Dropdown.ItemIcon as={RiSettings2Line} />
            Settings
            <span className='text-2xs text-text-sub-600 ml-auto'>G then S</span>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiSlackFill} />
            Slack Community
          </Dropdown.Item>

          <div className='text-text-sub-600 flex h-7.5 items-center px-4 text-xs font-medium'>
            What&apos;s new
          </div>

          <Dropdown.Group className='relative'>
            <svg className='absolute top-3.5 left-5.75 z-10 h-16 w-0.5' xmlns='http://w3.org'>
              <rect
                x='0'
                y='0'
                width='100%'
                height='100%'
                fill='none'
                stroke='currentColor'
                stroke-width='2'
                stroke-dasharray='8, 4'
                rx='8'
                className='stroke-bg-soft-200'
              />
            </svg>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={IconDot} className='z-10' />
              Agent assisted project updates
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={IconDot} className='z-10' />
              Coding sessions in Neosigma
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={IconDot} className='z-10' />
              Full changelog
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Content>
      </Dropdown.Root>
    </div>
  );
}

function IconDot(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className=''
      width='16'
      height='16'
      viewBox='0 0 16 16'
      aria-hidden='true'
      fill='currentColor'
      {...props}
    >
      <circle cx='8' cy='8' r='3'></circle>
    </svg>
  );
}
