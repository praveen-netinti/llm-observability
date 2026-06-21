"use client";

import { useState } from "react";
import {
  RiCheckLine,
  RiDeleteBinLine,
  RiFileCopyLine,
  RiKey2Fill,
} from "@remixicon/react";

import { cn } from "@/utils/cn";
import * as Button from "@/components/ui/button";

interface ApiKey {
  id: string;
  name: string;
  scope: "Ingest" | "Read" | "Admin";
  prefix: string;
  created: string;
  lastUsed: string;
}

const initialKeys: ApiKey[] = [
  {
    id: "1",
    name: "Production ingest",
    scope: "Ingest",
    prefix: "ns_live_pk_8f2a",
    created: "May 16, 2025",
    lastUsed: "2 minutes ago",
  },
  {
    id: "2",
    name: "Staging ingest",
    scope: "Ingest",
    prefix: "ns_test_pk_3c91",
    created: "May 20, 2025",
    lastUsed: "1 hour ago",
  },
  {
    id: "3",
    name: "Grafana reader",
    scope: "Read",
    prefix: "ns_live_rk_a7d4",
    created: "June 02, 2025",
    lastUsed: "Yesterday",
  },
];

const scopeStyles: Record<ApiKey["scope"], string> = {
  Ingest: "bg-green-alpha-10 text-green-600",
  Read: "bg-feature-lighter text-feature-base",
  Admin: "bg-away-lighter text-away-base",
};

const endpoints = [
  { id: "otlp", label: "OTLP/HTTP endpoint", value: "https://ingest.neosigma.ai/v1/traces" },
  { id: "otlp-grpc", label: "OTLP/gRPC endpoint", value: "ingest.neosigma.ai:4317" },
];

export default function ApiKeys() {
  const [keys, setKeys] = useState(initialKeys);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (id: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(id);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <div className='flex h-full w-full flex-col gap-5 overflow-y-auto px-0 pb-8 lg:gap-7 lg:px-7 lg:pb-0'>
      <div className='flex flex-col gap-5 px-5 pt-5 lg:flex-row lg:gap-4 lg:px-0 lg:pt-7'>
        <div className='flex flex-col gap-1 lg:max-w-50 lg:min-w-50 xl:max-w-75 xl:min-w-75'>
          <h3 className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
            API keys
          </h3>
          <p className='text-text-soft-400 tracking-spacing-tiny-2 text-xs font-medium lg:text-sm'>
            Keys for sending telemetry and reading data.
          </p>
        </div>

        <div className='flex w-full flex-col gap-5 lg:gap-4'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex flex-col gap-1'>
              <div className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
                Active keys
              </div>
              <div className='text-text-soft-400 text-xs font-medium lg:text-sm'>
                Keys are shown only once at creation.
              </div>
            </div>
            <Button.Root
              size='xsmall'
              variant='neutral'
              mode='stroke'
              className='text-text-sub-600 !rounded-10 w-fit cursor-pointer px-3 text-sm font-medium'
            >
              Create key
            </Button.Root>
          </div>

          <div className='border-stroke-soft-200 flex flex-col gap-5 border-t pt-5'>
            {keys.map((key) => (
              <div key={key.id} className='flex items-center justify-between gap-2.5'>
                <div className='flex min-w-0 items-center gap-2.5'>
                  <div className='bg-bg-weak-50 grid size-8 shrink-0 place-items-center rounded-full'>
                    <RiKey2Fill className='text-text-soft-400 size-4' />
                  </div>
                  <div className='flex min-w-0 flex-col gap-0.5'>
                    <div className='flex items-center gap-2'>
                      <span className='text-text-strong-950 tracking-spacing-tiny-2 truncate text-sm font-medium'>
                        {key.name}
                      </span>
                      <span
                        className={cn(
                          "w-fit shrink-0 rounded-md px-1.5 py-0.5 text-xs font-medium",
                          scopeStyles[key.scope],
                        )}
                      >
                        {key.scope}
                      </span>
                    </div>
                    <span className='text-text-soft-400 truncate font-mono text-xs'>
                      {key.prefix}••••••••  ·  last used {key.lastUsed}
                    </span>
                  </div>
                </div>
                <Button.Root
                  size='xsmall'
                  variant='neutral'
                  mode='ghost'
                  onClick={() => setKeys((prev) => prev.filter((k) => k.id !== key.id))}
                  className='hover:bg-bg-weak-50 size-7 shrink-0 cursor-pointer rounded-sm p-0 transition-colors'
                >
                  <RiDeleteBinLine className='text-text-soft-400 size-4.5' />
                </Button.Root>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='border-stroke-soft-200 flex flex-col gap-4 border-t px-5 pt-5 lg:flex-row lg:border-t-0 lg:px-0 lg:pt-7'>
        <div className='flex flex-col gap-1 lg:max-w-50 lg:min-w-50 xl:max-w-75 xl:min-w-75'>
          <h3 className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
            Ingestion endpoints
          </h3>
          <p className='text-text-soft-400 tracking-spacing-tiny-2 text-xs font-medium lg:text-sm'>
            Point your OpenTelemetry exporter here.
          </p>
        </div>

        <div className='border-stroke-soft-200 flex w-full flex-col gap-5 border-t pt-4 lg:border-t-0 lg:pt-0'>
          {endpoints.map((endpoint) => (
            <div key={endpoint.id} className='flex flex-col gap-2'>
              <div className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
                {endpoint.label}
              </div>
              <div className='bg-bg-weak-50 shadow-custom-input flex items-center gap-3 rounded-xl px-4 py-3 lg:p-3'>
                <div className='text-text-sub-600 max-w-[calc(100%-32px)] flex-1 overflow-hidden font-mono text-sm whitespace-nowrap'>
                  {endpoint.value}
                </div>
                <button
                  onClick={() => handleCopy(endpoint.id, endpoint.value)}
                  className='flex shrink-0 cursor-pointer items-center justify-center p-0 transition-colors'
                >
                  {copied === endpoint.id ? (
                    <RiCheckLine className='size-5 text-green-600' />
                  ) : (
                    <RiFileCopyLine className='text-text-soft-400 hover:text-text-sub-600 size-5' />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
