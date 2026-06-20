"use client";

import { useSidebar } from "@/contexts/sidebar-context";
import { RiLayoutLeft2Line } from "@remixicon/react";

import * as Button from "@/components/ui/button";

export default function MainPage() {
  const { onMenuClick } = useSidebar();

  return (
    <div className='flex h-full flex-col lg:p-2 lg:pl-0'>
      <div className='bg-bg-white-0 lg:border-stroke-soft-200 relative flex h-full flex-col lg:rounded-2xl lg:border'>
        <div className='border-faded-lighter flex h-11 w-full items-center border-b px-2'>
          <Button.Root
            variant='neutral'
            mode='ghost'
            size='xxsmall'
            onClick={onMenuClick}
            className='size-7 cursor-pointer rounded-lg p-0 lg:hidden'
          >
            <Button.Icon as={RiLayoutLeft2Line} className='text-text-soft-400' />
          </Button.Root>
        </div>
      </div>
    </div>
  );
}
