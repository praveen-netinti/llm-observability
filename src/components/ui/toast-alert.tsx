import React from "react";
import {
  RiAlertFill,
  RiCheckboxCircleFill,
  RiCloseLine,
  RiErrorWarningFill,
  RiInformationFill,
} from "@remixicon/react";

import { toast } from "./toast";

type AlertToastProps = {
  t: string | number;
  status?: "info" | "success" | "warning" | "error";
  title?: string;
  description?: string;
  dismissable?: boolean;
  icon?: React.ElementType;
};

const iconClassNames = {
  success: "text-green-600 dark:text-green-400",
  warning: "text-yellow-600 dark:text-yellow-400",
  error: "text-red-600 dark:text-red-400",
  info: "text-blue-600 dark:text-blue-400",
};

export const AlertToast = React.forwardRef<HTMLDivElement, AlertToastProps>(
  ({ t, status, icon, title, description }, forwardedRef) => {
    let Icon: React.ElementType;

    if (icon) {
      Icon = icon;
    } else {
      switch (status) {
        case "success":
          Icon = RiCheckboxCircleFill;
          break;
        case "warning":
          Icon = RiAlertFill;
          break;
        case "error":
          Icon = RiErrorWarningFill;
          break;
        case "info":
          Icon = RiInformationFill;
          break;
        default:
          Icon = RiErrorWarningFill;
          break;
      }
    }

    return (
      <div ref={forwardedRef} className='flex items-start'>
        <div className='flex w-full gap-3'>
          <div className='*:h-5 *:w-5 *:leading-4'>
            {icon ? <Icon /> : <Icon className={iconClassNames[status || "info"]} />}
          </div>
          <div className='grid w-full gap-1'>
            {title && <div className='text-primary max-w-3/4 font-semibold text-wrap'>{title}</div>}
            {description && (
              <div className='text-secondary font-medium opacity-90'>{description}</div>
            )}
          </div>
        </div>
        <button
          type='button'
          onClick={() => toast.dismiss(t)}
          className='text-secondary rounded-md p-1 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 focus:ring-2 focus:outline-none group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600'
        >
          <RiCloseLine className='size-4' />
        </button>
      </div>
    );
  },
);
AlertToast.displayName = "AlertToast";
