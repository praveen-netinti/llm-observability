import type { SVGProps } from "react";
import type { IssueStatus, IssuePriority } from "@/lib/issues-store";

function IconBacklog(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width='14' height='14' viewBox='0 0 14 14' fill='currentColor' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path d='M13.9408 7.91426L11.9576 7.65557C11.9855 7.4419 12 7.22314 12 7C12 6.77686 11.9855 6.5581 11.9576 6.34443L13.9408 6.08573C13.9799 6.38496 14 6.69013 14 7C14 7.30987 13.9799 7.61504 13.9408 7.91426ZM13.4688 4.32049C13.2328 3.7514 12.9239 3.22019 12.5538 2.73851L10.968 3.95716C11.2328 4.30185 11.4533 4.68119 11.6214 5.08659L13.4688 4.32049ZM11.2615 1.4462L10.0428 3.03204C9.69815 2.76716 9.31881 2.54673 8.91341 2.37862L9.67951 0.531163C10.2486 0.767153 10.7798 1.07605 11.2615 1.4462ZM7.91426 0.0591659L7.65557 2.04237C7.4419 2.01449 7.22314 2 7 2C6.77686 2 6.5581 2.01449 6.34443 2.04237L6.08574 0.059166C6.38496 0.0201343 6.69013 0 7 0C7.30987 0 7.61504 0.0201343 7.91426 0.0591659ZM4.32049 0.531164L5.08659 2.37862C4.68119 2.54673 4.30185 2.76716 3.95716 3.03204L2.73851 1.4462C3.22019 1.07605 3.7514 0.767153 4.32049 0.531164ZM1.4462 2.73851L3.03204 3.95716C2.76716 4.30185 2.54673 4.68119 2.37862 5.08659L0.531164 4.32049C0.767153 3.7514 1.07605 3.22019 1.4462 2.73851ZM0.0591659 6.08574C0.0201343 6.38496 0 6.69013 0 7C0 7.30987 0.0201343 7.61504 0.059166 7.91426L2.04237 7.65557C2.01449 7.4419 2 7.22314 2 7C2 6.77686 2.01449 6.5581 2.04237 6.34443L0.0591659 6.08574ZM0.531164 9.67951L2.37862 8.91341C2.54673 9.31881 2.76716 9.69815 3.03204 10.0428L1.4462 11.2615C1.07605 10.7798 0.767153 10.2486 0.531164 9.67951ZM2.73851 12.5538L3.95716 10.968C4.30185 11.2328 4.68119 11.4533 5.08659 11.6214L4.32049 13.4688C3.7514 13.2328 3.22019 12.9239 2.73851 12.5538ZM6.08574 13.9408L6.34443 11.9576C6.5581 11.9855 6.77686 12 7 12C7.22314 12 7.4419 11.9855 7.65557 11.9576L7.91427 13.9408C7.61504 13.9799 7.30987 14 7 14C6.69013 14 6.38496 13.9799 6.08574 13.9408ZM9.67951 13.4688L8.91341 11.6214C9.31881 11.4533 9.69815 11.2328 10.0428 10.968L11.2615 12.5538C10.7798 12.9239 10.2486 13.2328 9.67951 13.4688ZM12.5538 11.2615L10.968 10.0428C11.2328 9.69815 11.4533 9.31881 11.6214 8.91341L13.4688 9.67951C13.2328 10.2486 12.924 10.7798 12.5538 11.2615Z' stroke='none' />
    </svg>
  );
}

function IconTodo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <rect x='1' y='1' width='12' height='12' rx='6' stroke='currentColor' strokeWidth='1.5' />
      <path fill='currentColor' stroke='none' d='M 3.5,3.5 L3.5,0 A3.5,3.5 0 0,1 3.5, 0 z' transform='translate(3.5,3.5)' />
    </svg>
  );
}

function IconInProgress(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <rect x='1' y='1' width='12' height='12' rx='6' stroke='currentColor' strokeWidth='1.5' />
      <path fill='currentColor' stroke='none' d='M 3.5,3.5 L3.5,0 A3.5,3.5 0 0,1 3.5, 7 z' transform='translate(3.5,3.5)' />
    </svg>
  );
}

function IconDone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width='14' height='14' viewBox='0 0 14 14' fill='currentColor' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path fillRule='evenodd' clipRule='evenodd' d='M7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0ZM11.101 5.10104C11.433 4.76909 11.433 4.23091 11.101 3.89896C10.7691 3.56701 10.2309 3.56701 9.89896 3.89896L5.5 8.29792L4.10104 6.89896C3.7691 6.56701 3.2309 6.56701 2.89896 6.89896C2.56701 7.2309 2.56701 7.7691 2.89896 8.10104L4.89896 10.101C5.2309 10.433 5.7691 10.433 6.10104 10.101L11.101 5.10104Z' />
    </svg>
  );
}

function IconCancelled(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width='14' height='14' viewBox='0 0 14 14' fill='currentColor' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path fillRule='evenodd' clipRule='evenodd' d='M7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14ZM5.03033 3.96967C4.73744 3.67678 4.26256 3.67678 3.96967 3.96967C3.67678 4.26256 3.67678 4.73744 3.96967 5.03033L5.93934 7L3.96967 8.96967C3.67678 9.26256 3.67678 9.73744 3.96967 10.0303C4.26256 10.3232 4.73744 10.3232 5.03033 10.0303L7 8.06066L8.96967 10.0303C9.26256 10.3232 9.73744 10.3232 10.0303 10.0303C10.3232 9.73744 10.3232 9.26256 10.0303 8.96967L8.06066 7L10.0303 5.03033C10.3232 4.73744 10.3232 4.26256 10.0303 3.96967C9.73744 3.67678 9.26256 3.67678 8.96967 3.96967L7 5.93934L5.03033 3.96967Z' stroke='none' />
    </svg>
  );
}

export function IconNoAssignee(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width='16' height='16' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path fillRule='evenodd' clipRule='evenodd' d='M10.25 6.75C10.25 7.99264 9.24264 9 8 9C6.75736 9 5.75 7.99264 5.75 6.75C5.75 5.50736 6.75736 4.5 8 4.5C9.24264 4.5 10.25 5.50736 10.25 6.75Z' />
      <path fillRule='evenodd' clipRule='evenodd' d='M8.5752 10C9.97242 10 11.2611 10.6106 12.1436 11.6143C12.1563 11.5997 12.17 11.586 12.1826 11.5713C12.4518 11.2567 12.9255 11.2202 13.2402 11.4893C13.5548 11.7585 13.5913 12.2321 13.3223 12.5469C13.0953 12.8123 12.8478 13.0593 12.584 13.2881C12.5484 13.3246 12.5106 13.3593 12.4668 13.3887C11.3913 14.2811 10.0437 14.8571 8.56738 14.9756C8.56118 14.9762 8.55508 14.978 8.54883 14.9785C8.51409 14.9812 8.4792 14.9822 8.44434 14.9844C8.38882 14.9879 8.3332 14.991 8.27734 14.9932C8.18529 14.9968 8.09287 15 8 15C7.90681 15 7.81406 14.9968 7.72168 14.9932C7.66583 14.991 7.6102 14.9879 7.55469 14.9844C7.52015 14.9822 7.48558 14.9812 7.45117 14.9785C7.44459 14.978 7.43816 14.9763 7.43164 14.9756C5.94988 14.8564 4.59683 14.2772 3.51953 13.3789C3.50616 13.3677 3.49384 13.3556 3.48145 13.3438C3.47213 13.3365 3.46218 13.33 3.45312 13.3223C3.17492 13.0844 2.91561 12.8251 2.67773 12.5469C2.40865 12.2321 2.44515 11.7585 2.75977 11.4893C3.07452 11.2202 3.54818 11.2567 3.81738 11.5713C3.83028 11.5864 3.84339 11.6013 3.85645 11.6162C4.73898 10.612 6.02721 10.0001 7.4248 10H8.5752ZM7.4248 11.5C6.47086 11.5001 5.59107 11.9168 4.9873 12.6016C5.85267 13.1696 6.88689 13.5 8 13.5C9.11327 13.5 10.1472 13.1687 11.0127 12.6006C10.4088 11.9164 9.52878 11.5 8.5752 11.5H7.4248Z' />
      <path fillRule='evenodd' clipRule='evenodd' d='M1.82715 6.76172C2.24007 6.79385 2.54868 7.15444 2.5166 7.56738C2.50553 7.70999 2.5 7.85427 2.5 8C2.5 8.14573 2.50553 8.29001 2.5166 8.43262C2.54868 8.84556 2.24007 9.20615 1.82715 9.23828C1.41418 9.27036 1.05357 8.9618 1.02148 8.54883C1.00741 8.36759 1 8.18457 1 8C1 7.81543 1.00741 7.63241 1.02148 7.45117C1.05357 7.0382 1.41418 6.72964 1.82715 6.76172Z' />
      <path fillRule='evenodd' clipRule='evenodd' d='M14.1729 6.76172C14.5858 6.72964 14.9464 7.0382 14.9785 7.45117C14.9926 7.63241 15 7.81543 15 8C15 8.18457 14.9926 8.36759 14.9785 8.54883C14.9464 8.9618 14.5858 9.27036 14.1729 9.23828C13.7599 9.20615 13.4513 8.84556 13.4834 8.43262C13.4945 8.29001 13.5 8.14573 13.5 8C13.5 7.85427 13.4945 7.70999 13.4834 7.56738C13.4513 7.15444 13.7599 6.79385 14.1729 6.76172Z' />
      <path fillRule='evenodd' clipRule='evenodd' d='M3.45312 2.67773C3.76789 2.40865 4.24155 2.44515 4.51074 2.75977C4.77982 3.07452 4.74329 3.54818 4.42871 3.81738C4.20954 4.00475 4.00475 4.20954 3.81738 4.42871C3.54818 4.74329 3.07452 4.77982 2.75977 4.51074C2.44515 4.24155 2.40865 3.76789 2.67773 3.45312C2.91561 3.17492 3.17492 2.91561 3.45312 2.67773Z' />
      <path fillRule='evenodd' clipRule='evenodd' d='M11.4893 2.75977C11.7585 2.44515 12.2321 2.40865 12.5469 2.67773C12.8251 2.91561 13.0844 3.17492 13.3223 3.45312C13.5913 3.76789 13.5548 4.24155 13.2402 4.51074C12.9255 4.77982 12.4518 4.74329 12.1826 4.42871C11.9953 4.20954 11.7905 4.00475 11.5713 3.81738C11.2567 3.54818 11.2202 3.07452 11.4893 2.75977Z' />
      <path fillRule='evenodd' clipRule='evenodd' d='M8 1C8.18457 1 8.36759 1.00741 8.54883 1.02148C8.9618 1.05357 9.27036 1.41418 9.23828 1.82715C9.20615 2.24007 8.84556 2.54868 8.43262 2.5166C8.29001 2.50553 8.14573 2.5 8 2.5C7.85427 2.5 7.70999 2.50553 7.56738 2.5166C7.15444 2.54868 6.79385 2.24007 6.76172 1.82715C6.72964 1.41418 7.0382 1.05357 7.45117 1.02148C7.63241 1.00741 7.81543 1 8 1Z' />
    </svg>
  );
}

export const STATUS_CONFIG: Record<IssueStatus, { icon: React.ElementType; color: string }> = {
  backlog: { icon: IconBacklog, color: "text-text-soft-400" },
  todo: { icon: IconTodo, color: "text-text-sub-600" },
  "in-progress": { icon: IconInProgress, color: "text-warning-base" },
  done: { icon: IconDone, color: "text-purple-500" },
  cancelled: { icon: IconCancelled, color: "text-text-disabled-300" },
};

function IconNoPriority(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width='16' height='16' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg' {...props}>
      <rect x='1.5' y='7.25' width='3' height='1.5' rx='0.5' opacity='0.9' />
      <rect x='6.5' y='7.25' width='3' height='1.5' rx='0.5' opacity='0.9' />
      <rect x='11.5' y='7.25' width='3' height='1.5' rx='0.5' opacity='0.9' />
    </svg>
  );
}

function IconUrgent(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width='16' height='16' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path d='M3 1C1.91067 1 1 1.91067 1 3V13C1 14.0893 1.91067 15 3 15H13C14.0893 15 15 14.0893 15 13V3C15 1.91067 14.0893 1 13 1H3ZM7 4L9 4L8.75391 8.99836H7.25L7 4ZM9 11C9 11.5523 8.55228 12 8 12C7.44772 12 7 11.5523 7 11C7 10.4477 7.44772 10 8 10C8.55228 10 9 10.4477 9 11Z' />
    </svg>
  );
}

function IconHigh(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width='16' height='16' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg' {...props}>
      <rect x='1.5' y='8' width='3' height='6' rx='1' />
      <rect x='6.5' y='5' width='3' height='9' rx='1' />
      <rect x='11.5' y='2' width='3' height='12' rx='1' />
    </svg>
  );
}

function IconMedium(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width='16' height='16' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg' {...props}>
      <rect x='1.5' y='8' width='3' height='6' rx='1' />
      <rect x='6.5' y='5' width='3' height='9' rx='1' />
      <rect x='11.5' y='2' width='3' height='12' rx='1' fillOpacity='0.4' />
    </svg>
  );
}

function IconLow(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width='16' height='16' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg' {...props}>
      <rect x='1.5' y='8' width='3' height='6' rx='1' />
      <rect x='6.5' y='5' width='3' height='9' rx='1' fillOpacity='0.4' />
      <rect x='11.5' y='2' width='3' height='12' rx='1' fillOpacity='0.4' />
    </svg>
  );
}

export const PRIORITY_CONFIG: Record<IssuePriority, { icon: React.ElementType; color: string }> = {
  "no-priority": { icon: IconNoPriority, color: "text-text-soft-400" },
  urgent: { icon: IconUrgent, color: "text-orange-500" },
  high: { icon: IconHigh, color: "text-text-sub-600" },
  medium: { icon: IconMedium, color: "text-text-sub-600" },
  low: { icon: IconLow, color: "text-text-sub-600" },
};

const AVATAR_COLORS = [
  "bg-purple-alpha-16 text-purple-700",
  "bg-blue-alpha-16 text-blue-700",
  "bg-green-alpha-16 text-green-800",
  "bg-orange-alpha-16 text-orange-700",
  "bg-pink-alpha-16 text-pink-700",
  "bg-teal-alpha-16 text-teal-700",
  "bg-sky-alpha-16 text-sky-700",
  "bg-red-alpha-16 text-red-700",
  "bg-yellow-alpha-16 text-yellow-900",
];

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
