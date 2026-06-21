"use client";

import { useState } from "react";
import {
  RiBroadcastLine,
  RiCheckLine,
  RiFileCopyLine,
  RiGithubFill,
  RiNotionFill,
  RiServerLine,
  RiSlackFill,
  RiWebhookFill,
} from "@remixicon/react";

import * as Button from "@/components/ui/button";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  connected: boolean;
}

const integrationsData: Integration[] = [
  { id: "slack", name: "Slack", description: "Send alerts to channels", icon: RiSlackFill, connected: true },
  { id: "pagerduty", name: "PagerDuty", description: "Page on-call for incidents", icon: RiBroadcastLine, connected: true },
  { id: "github", name: "GitHub", description: "Link traces to deploys & PRs", icon: RiGithubFill, connected: false },
  { id: "notion", name: "Notion", description: "Export incident postmortems", icon: RiNotionFill, connected: false },
  { id: "otel", name: "OpenTelemetry Collector", description: "Forward spans via OTLP", icon: RiServerLine, connected: true },
];

export default function Integrations() {
  const [connections, setConnections] = useState(() => {
    const initial: Record<string, boolean> = {};
    integrationsData.forEach((i) => (initial[i.id] = i.connected));
    return initial;
  });
  const [copied, setCopied] = useState(false);

  const webhookUrl = "https://hooks.neosigma.ai/v1/ingest/ns_wh_4f8c21";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <div className='flex h-full w-full flex-col gap-5 overflow-y-auto px-0 pb-8 lg:gap-7 lg:px-7 lg:pb-0'>
      <div className='flex flex-col gap-5 px-5 pt-5 lg:flex-row lg:gap-4 lg:px-0 lg:pt-7'>
        <div className='flex flex-col gap-1 lg:max-w-50 lg:min-w-50 xl:max-w-75 xl:min-w-75'>
          <h3 className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
            Connected apps
          </h3>
          <p className='text-text-soft-400 tracking-spacing-tiny-2 text-xs font-medium lg:text-sm'>
            Route alerts and sync incidents.
          </p>
        </div>

        <div className='border-stroke-soft-200 flex w-full flex-col gap-5 border-t pt-4 lg:gap-4 lg:border-t-0 lg:pt-0'>
          {integrationsData.map((app) => {
            const Icon = app.icon;
            const isConnected = connections[app.id];
            return (
              <div key={app.id} className='flex items-center justify-between gap-2.5'>
                <div className='flex gap-2.5 lg:items-center'>
                  <div className='bg-bg-weak-50 mt-0.5 grid size-8 shrink-0 place-items-center rounded-full lg:mt-0'>
                    <Icon className='text-text-strong-950 size-4.5' />
                  </div>
                  <div className='flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-2.5'>
                    <div className='text-text-sub-600 tracking-spacing-tiny-2 text-sm font-medium'>
                      {app.name}
                    </div>
                    <div className='text-text-soft-400 text-xs font-medium lg:text-sm'>
                      {app.description}
                    </div>
                  </div>
                </div>
                <Button.Root
                  size='xxsmall'
                  variant='neutral'
                  mode='lighter'
                  onClick={() => setConnections((prev) => ({ ...prev, [app.id]: !prev[app.id] }))}
                  className={`!rounded-10 w-fit cursor-pointer px-2.5 text-sm font-medium ${
                    isConnected
                      ? "border border-transparent bg-green-600/10 text-green-600 shadow-none hover:border-green-600 hover:bg-transparent hover:text-green-600"
                      : "text-text-sub-600"
                  }`}
                >
                  {isConnected ? "Connected" : "Connect"}
                </Button.Root>
              </div>
            );
          })}
        </div>
      </div>

      <div className='border-stroke-soft-200 flex flex-col gap-4 border-t px-5 pt-5 lg:flex-row lg:border-t-0 lg:px-0 lg:pt-7'>
        <div className='flex flex-col gap-1 lg:max-w-50 lg:min-w-50 xl:max-w-75 xl:min-w-75'>
          <h3 className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
            Webhooks
          </h3>
          <p className='text-text-soft-400 tracking-spacing-tiny-2 text-xs font-medium lg:text-sm'>
            Stream events to your own endpoint.
          </p>
        </div>

        <div className='border-stroke-soft-200 flex w-full flex-col gap-5 border-t pt-4 lg:gap-3 lg:border-t-0 lg:pt-0'>
          <div className='flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center'>
            <div className='flex flex-col gap-1'>
              <div className='text-text-strong-950 tracking-spacing-tiny-2 flex items-center gap-2 text-sm font-medium'>
                <RiWebhookFill className='text-text-soft-400 size-4' />
                Outbound webhook
              </div>
              <div className='text-text-soft-400 text-xs font-medium lg:text-sm'>
                Receives alert and incident events
              </div>
            </div>
            <Button.Root
              size='xsmall'
              variant='neutral'
              mode='stroke'
              className='text-text-sub-600 !rounded-10 w-full cursor-pointer px-3 text-sm font-medium lg:w-fit'
            >
              Manage
            </Button.Root>
          </div>

          <div className='bg-bg-weak-50 shadow-custom-input flex items-center gap-3 rounded-xl px-4 py-3 lg:p-3'>
            <div className='text-text-sub-600 max-w-[calc(100%-32px)] flex-1 overflow-hidden font-mono text-sm whitespace-nowrap'>
              {webhookUrl}
            </div>
            <button
              onClick={handleCopy}
              className='flex shrink-0 cursor-pointer items-center justify-center p-0 transition-colors'
            >
              {copied ? (
                <RiCheckLine className='size-5 text-green-600' />
              ) : (
                <RiFileCopyLine className='text-text-soft-400 hover:text-text-sub-600 size-5' />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
