"use client";

import { SVGProps } from "react";
import { useSidebar } from "@/contexts/sidebar-context";
import { RiArrowRightSLine, RiLayoutLeft2Line, RiUser6Fill, RiUser6Line } from "@remixicon/react";

import * as Breadcrumb from "@/components/ui/breadcrumb";
import * as Button from "@/components/ui/button";

export default function TracesPage() {
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

          <Breadcrumb.Root className='ml-2.5 gap-0.5'>
            <Breadcrumb.Item className='text-[13px]!'>
              <Breadcrumb.Icon as={IconUserBox} className='size-4' />
              Praveen-netinti
            </Breadcrumb.Item>

            <Breadcrumb.ArrowIcon as={RiArrowRightSLine} />

            <Breadcrumb.Item className='text-[13px]!' active>
              Traces
            </Breadcrumb.Item>
          </Breadcrumb.Root>
        </div>
      </div>
    </div>
  );
}

function IconUserBox(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M12.5 13.5V15H3.5V13.5H12.5ZM13.5 12.5V3.5C13.5 3.23478 13.3946 2.98043 13.2071 2.79289C13.0196 2.60536 12.7652 2.5 12.5 2.5H3.5C3.23478 2.5 2.98043 2.60536 2.79289 2.79289C2.60536 2.98043 2.5 3.23478 2.5 3.5V12.5C2.5 12.7652 2.60536 13.0196 2.79289 13.2071C2.98043 13.3946 3.23478 13.5 3.5 13.5V15L3.244 14.987C2.67237 14.9282 2.13844 14.6742 1.7321 14.2679C1.32576 13.8616 1.07181 13.3276 1.013 12.756L1 12.5V3.5C0.999965 2.88126 1.22938 2.28448 1.64388 1.8251C2.05838 1.36571 2.62851 1.07636 3.244 1.013L3.5 1H12.5L12.756 1.013C13.3715 1.07636 13.9416 1.36571 14.3561 1.8251C14.7706 2.28448 15 2.88126 15 3.5V12.5L14.987 12.756C14.9282 13.3276 14.6742 13.8616 14.2679 14.2679C13.8616 14.6742 13.3276 14.9282 12.756 14.987L12.5 15V13.5C12.7652 13.5 13.0196 13.3946 13.2071 13.2071C13.3946 13.0196 13.5 12.7652 13.5 12.5Z'
        fill='#D758FC'
      />
      <path
        d='M10 6C10 6.53043 9.78931 7.03914 9.41423 7.41421C9.03916 7.78929 8.53045 8 8.00002 8C7.46959 8 6.96088 7.78929 6.58581 7.41421C6.21073 7.03914 6.00002 6.53043 6.00002 6C6.00002 5.46957 6.21073 4.96086 6.58581 4.58579C6.96088 4.21071 7.46959 4 8.00002 4C8.53045 4 9.03916 4.21071 9.41423 4.58579C9.78931 4.96086 10 5.46957 10 6ZM11.405 12H4.59502C4.18802 12 3.88102 11.664 4.04502 11.307C4.40702 10.517 5.38902 9.333 8.02502 9.333C10.673 9.333 11.622 10.529 11.96 11.319C12.112 11.674 11.807 12 11.405 12Z'
        fill='#D758FC'
      />
    </svg>
  );
}
