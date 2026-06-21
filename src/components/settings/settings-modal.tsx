"use client";

import { useState } from "react";

import type { SettingsPageId } from "@/contexts/settings-context";
import { cn } from "@/utils/cn";
import SettingsHeader from "@/components/layout/settings-header";
import SettingsSidebar from "@/components/settings/settings-sidebar";
import * as Modal from "@/components/ui/modal";
import Advanced from "@/components/settings/pages/advanced";
import Alerts from "@/components/settings/pages/alerts";
import ApiKeys from "@/components/settings/pages/api-keys";
import Appearance from "@/components/settings/pages/appearance";
import BillingUsage from "@/components/settings/pages/billing-usage";
import DataPrivacy from "@/components/settings/pages/data-privacy";
import Integrations from "@/components/settings/pages/integrations";
import Members from "@/components/settings/pages/members";
import ModelProviders from "@/components/settings/pages/model-providers";
import Organization from "@/components/settings/pages/organization";
import Preferences from "@/components/settings/pages/preferences";
import Profile from "@/components/settings/pages/profile";
import Projects from "@/components/settings/pages/projects";
import Security from "@/components/settings/pages/security";

type PageConfigEntry = {
  component: React.ComponentType;
  title: string;
  description: string;
};

const pageConfig: Record<SettingsPageId, PageConfigEntry> = {
  organization: {
    component: Organization,
    title: "Organization overview",
    description: "Manage your organization and telemetry usage.",
  },
  members: {
    component: Members,
    title: "Team members",
    description: "Manage members, roles and permissions.",
  },
  "billing-usage": {
    component: BillingUsage,
    title: "Billing & Usage",
    description: "Manage subscription and metered usage.",
  },
  profile: {
    component: Profile,
    title: "Profile",
    description: "Manage your personal account settings.",
  },
  preferences: {
    component: Preferences,
    title: "Preferences",
    description: "Customize notifications and default views.",
  },
  appearance: {
    component: Appearance,
    title: "Appearance",
    description: "Customize visual settings and interface.",
  },
  projects: {
    component: Projects,
    title: "Projects",
    description: "Manage projects, environments and sampling.",
  },
  "model-providers": {
    component: ModelProviders,
    title: "Model providers",
    description: "Connect LLM providers and configure cost tracking.",
  },
  "api-keys": {
    component: ApiKeys,
    title: "API keys",
    description: "Manage ingestion keys and OTLP endpoints.",
  },
  alerts: {
    component: Alerts,
    title: "Alerts",
    description: "Configure threshold rules and routing.",
  },
  security: {
    component: Security,
    title: "Security",
    description: "Manage account security and active sessions.",
  },
  "data-privacy": {
    component: DataPrivacy,
    title: "Data & Privacy",
    description: "Control retention, redaction and data rights.",
  },
  integrations: {
    component: Integrations,
    title: "Integrations",
    description: "Connect external apps and webhooks.",
  },
  advanced: {
    component: Advanced,
    title: "Advanced",
    description: "Developer tools and experimental features.",
  },
};

interface SettingsModalProps {
  isOpen: boolean;
  activePage: SettingsPageId;
  onActivePageChange: (pageId: SettingsPageId) => void;
  onClose: () => void;
}

export default function SettingsModal({
  isOpen,
  activePage,
  onActivePageChange,
  onClose,
}: SettingsModalProps) {
  const [showMobileContent, setShowMobileContent] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1024,
  );
  const [isPageAnimating, setIsPageAnimating] = useState(false);

  const currentPage = pageConfig[activePage] ?? pageConfig.organization;
  const PageComponent = currentPage.component;

  const handlePageChange = (pageId: SettingsPageId) => {
    onActivePageChange(pageId);
    if (window.innerWidth < 1024) {
      setIsPageAnimating(true);
      setTimeout(() => setShowMobileContent(true), 10);
    } else {
      setShowMobileContent(true);
    }
  };

  const handleClose = () => {
    onActivePageChange("organization");
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
    setShowMobileContent(isDesktop);
    onClose();
  };

  const handleContentClose = () => {
    if (window.innerWidth < 1024) {
      setIsPageAnimating(false);
      setTimeout(() => setShowMobileContent(false), 400);
    } else {
      handleClose();
    }
  };

  return (
    <Modal.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Modal.Content
        showClose={false}
        aria-label='Settings'
        overlayClassName='items-end p-0 backdrop-blur-[10px] lg:items-center'
        className={cn(
          // override the default small-dialog sizing
          "flex max-w-none items-end overflow-hidden bg-transparent p-0 shadow-none",
          "w-full rounded-none",
          "lg:bg-bg-white-0 lg:shadow-complex lg:h-180 lg:max-h-[80vh] lg:w-229.5 lg:items-center lg:gap-1.5 lg:rounded-[28px] lg:p-1.5 xl:h-180 xl:w-289.5",
        )}
      >
        <Modal.Title className='sr-only'>Settings</Modal.Title>
        <Modal.Description className='sr-only'>{currentPage.description}</Modal.Description>
        <SettingsSidebar
          activePage={activePage}
          onPageChange={handlePageChange}
          onClose={handleClose}
          isMobileContentShown={showMobileContent}
        />

        <div
          className={cn(
            "bg-overlay-gray lg:left-auto lg:top-auto absolute top-0 left-0 flex h-full w-full flex-1 items-end transition-all duration-400 lg:pointer-events-auto lg:relative lg:h-full lg:bg-transparent lg:opacity-100",
            showMobileContent ? "visible opacity-100" : "invisible opacity-0",
          )}
          onClick={handleContentClose}
        >
          <div
            className={cn(
              "shadow-custom-input bg-bg-white-0 flex h-[calc(100dvh-32px)] w-full shrink-0 flex-col rounded-t-3xl pt-5 transition-transform duration-400 ease-out lg:h-full lg:rounded-3xl lg:bg-transparent lg:pt-5.5 lg:pb-7",
              isPageAnimating ? "translate-y-0" : "translate-y-full lg:translate-y-0",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <SettingsHeader
              title={currentPage.title}
              description={currentPage.description}
              onClose={handleContentClose}
            />
            <PageComponent />
          </div>
        </div>
      </Modal.Content>
    </Modal.Root>
  );
}
