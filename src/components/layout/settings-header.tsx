import { RiCloseLine } from "@remixicon/react";

import * as Button from "@/components/ui/button";

interface SettingsHeaderProps {
  title: string;
  description: string;
  onClose?: () => void;
}

export default function SettingsHeader({ title, description, onClose }: SettingsHeaderProps) {
  return (
    <div className='flex w-full justify-between gap-4 px-0 lg:px-7'>
      <div className='border-stroke-soft-200 flex w-full items-center justify-between border-b px-5 pb-5 lg:px-0 lg:pb-7'>
        <div className='flex flex-col gap-1'>
          <h2 className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
            {title}
          </h2>
          <p className='text-text-soft-400 tracking-spacing-tiny-2 text-xs font-medium lg:text-sm'>
            {description}
          </p>
        </div>
        <Button.Root
          size='small'
          className='group bg-bg-white-0 hover:bg-bg-weak-50 size-6 cursor-pointer rounded-md'
          onClick={onClose}
        >
          <Button.Icon
            as={RiCloseLine}
            className='text-text-soft-400 group-hover:text-text-sub-600 ease size-4.5 duration-200'
          />
        </Button.Root>
      </div>
    </div>
  );
}
