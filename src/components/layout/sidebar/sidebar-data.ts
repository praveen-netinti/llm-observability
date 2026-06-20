import React from "react";
import {
  RiAlarmWarningLine,
  RiAlertLine,
  RiBarChartBoxLine,
  RiDashboardLine,
  RiFlowChart,
  RiKey2Line,
  RiLoginBoxLine,
  RiMoneyDollarCircleLine,
  RiPlayCircleLine,
  RiQuestionAnswerLine,
  RiSettings2Line,
  RiShieldCheckLine,
  RiStackLine,
  RiTerminalBoxLine,
} from "@remixicon/react";

export type NavItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: string;
};

export type NavSection = {
  id: string;
  title: string | null;
  items: NavItem[];
};

export type SidebarSection = NavSection;

export type ProfileMenuItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  variant?: string;
};

export type SidebarUser = {
  name: string;
  email: string;
  avatar: string;
  isPro: boolean;
  profileMenu: ProfileMenuItem[];
  version: string;
  termsUrl: string;
};

export type SidebarData = {
  user: SidebarUser;
  sections: SidebarSection[];
  announcement?: {
    title: string;
    description: string;
    href: string;
    linkLabel?: string;
    badge?: string;
  };
};

export const sidebarData: SidebarData = {
  user: {
    name: "James Brown",
    email: "james@alignui.com",
    avatar: "JB",
    isPro: true,
    profileMenu: [
      { id: "settings", label: "Settings", icon: RiSettings2Line, href: "/settings" },
      { id: "help", label: "Need help?", icon: RiQuestionAnswerLine, href: "/help" },
      { id: "logout", label: "Log out", icon: RiLoginBoxLine, href: "/login", variant: "danger" },
    ],
    version: "v0.1.0",
    termsUrl: "/terms",
  },
  sections: [
    {
      id: "main",
      title: null,
      items: [
        { id: "dashboard", label: "Dashboard", icon: RiDashboardLine, href: "/" },
        { id: "traces", label: "Traces", icon: RiFlowChart, href: "/traces" },
        { id: "issues", label: "Issues", icon: RiAlertLine, href: "/issues", badge: "3" },
        { id: "alerts", label: "Alerts", icon: RiAlarmWarningLine, href: "/alerts" },
        { id: "playground", label: "Playground", icon: RiPlayCircleLine, href: "/playground" },
      ],
    },
    {
      id: "observe",
      title: "Observe",
      items: [
        { id: "models", label: "Models", icon: RiStackLine, href: "/models" },
        { id: "prompts", label: "Prompts", icon: RiTerminalBoxLine, href: "/prompts" },
        { id: "evaluations", label: "Evaluations", icon: RiBarChartBoxLine, href: "/evaluations" },
        { id: "cost", label: "Cost & Usage", icon: RiMoneyDollarCircleLine, href: "/cost" },
      ],
    },
    {
      id: "manage",
      title: "Manage",
      items: [
        { id: "api-keys", label: "API Keys", icon: RiKey2Line, href: "/api-keys" },
        { id: "guardrails", label: "Guardrails", icon: RiShieldCheckLine, href: "/guardrails" },
        { id: "settings", label: "Settings", icon: RiSettings2Line, href: "/settings" },
      ],
    },
  ],
  announcement: {
    title: "New version available",
    description: "An improved version of App is available. Please restart now to upgrade.",
    href: "/changelog",
    linkLabel: "Upgrade",
  },
};
