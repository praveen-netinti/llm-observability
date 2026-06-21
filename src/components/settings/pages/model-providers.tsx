"use client";

import { useState } from "react";
import {
  RiAmazonFill,
  RiGoogleFill,
  RiMetaFill,
  RiOpenaiFill,
  RiSparklingFill,
} from "@remixicon/react";

import * as Button from "@/components/ui/button";
import * as Select from "@/components/ui/select";
import * as Switch from "@/components/ui/switch";

interface Provider {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  connected: boolean;
}

const providersData: Provider[] = [
  {
    id: "openai",
    name: "OpenAI",
    description: "GPT-4o, o3, embeddings",
    icon: RiOpenaiFill,
    connected: true,
  },
  {
    id: "anthropic",
    name: "Anthropic",
    description: "Claude Opus, Sonnet, Haiku",
    icon: RiSparklingFill,
    connected: true,
  },
  {
    id: "google",
    name: "Google Vertex AI",
    description: "Gemini 1.5 Pro & Flash",
    icon: RiGoogleFill,
    connected: false,
  },
  {
    id: "bedrock",
    name: "Amazon Bedrock",
    description: "Titan, Claude, Llama via AWS",
    icon: RiAmazonFill,
    connected: false,
  },
  {
    id: "meta",
    name: "Meta Llama",
    description: "Llama 3.1 self-hosted",
    icon: RiMetaFill,
    connected: false,
  },
];

const costModelOptions = [
  { value: "auto", label: "Auto-detect from spans" },
  { value: "openai-public", label: "OpenAI public pricing" },
  { value: "custom", label: "Custom price book" },
];

export default function ModelProviders() {
  const [providers, setProviders] = useState(() => {
    const initial: Record<string, boolean> = {};
    providersData.forEach((p) => (initial[p.id] = p.connected));
    return initial;
  });
  const [costModel, setCostModel] = useState("auto");
  const [trackTokenCost, setTrackTokenCost] = useState(true);

  return (
    <div className='flex h-full w-full flex-col gap-5 overflow-y-auto px-0 pb-8 lg:gap-7 lg:px-7 lg:pb-0'>
      <div className='flex flex-col gap-5 px-5 pt-5 lg:flex-row lg:gap-4 lg:px-0 lg:pt-7'>
        <div className='flex flex-col gap-1 lg:max-w-50 lg:min-w-50 xl:max-w-75 xl:min-w-75'>
          <h3 className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
            Providers
          </h3>
          <p className='text-text-soft-400 tracking-spacing-tiny-2 text-xs font-medium lg:text-sm'>
            Connect LLM providers to enrich traces.
          </p>
        </div>

        <div className='border-stroke-soft-200 flex w-full flex-col gap-5 border-t pt-4 lg:gap-4 lg:border-t-0 lg:pt-0'>
          {providersData.map((provider) => {
            const Icon = provider.icon;
            const isConnected = providers[provider.id];
            return (
              <div key={provider.id} className='flex items-center justify-between gap-2.5'>
                <div className='flex gap-2.5 lg:items-center'>
                  <div className='bg-bg-weak-50 mt-0.5 grid size-8 shrink-0 place-items-center rounded-full lg:mt-0'>
                    <Icon className='text-text-strong-950 size-4.5' />
                  </div>
                  <div className='flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-2.5'>
                    <div className='text-text-sub-600 tracking-spacing-tiny-2 text-sm font-medium'>
                      {provider.name}
                    </div>
                    <div className='text-text-soft-400 text-xs font-medium lg:text-sm'>
                      {provider.description}
                    </div>
                  </div>
                </div>
                <Button.Root
                  size='xxsmall'
                  variant='neutral'
                  mode='lighter'
                  onClick={() =>
                    setProviders((prev) => ({ ...prev, [provider.id]: !prev[provider.id] }))
                  }
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
            Cost tracking
          </h3>
          <p className='text-text-soft-400 tracking-spacing-tiny-2 text-xs font-medium lg:text-sm'>
            How token spend is calculated.
          </p>
        </div>

        <div className='border-stroke-soft-200 flex w-full flex-col gap-5 border-t pt-4 lg:gap-4 lg:border-t-0 lg:pt-0'>
          <div className='flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center'>
            <div className='flex flex-col gap-1'>
              <div className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
                Pricing source
              </div>
              <div className='text-text-soft-400 text-xs font-medium lg:text-sm'>
                Used to compute cost per trace
              </div>
            </div>
            <Select.Root size='xsmall' value={costModel} onValueChange={setCostModel}>
              <Select.Trigger className='text-text-sub-600 w-full text-sm lg:w-auto'>
                <Select.Value placeholder={costModel} />
              </Select.Trigger>
              <Select.Content className='z-62'>
                {costModelOptions.map((option) => (
                  <Select.Item key={option.value} value={option.value}>
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>

          <div className='border-stroke-soft-200 flex items-center justify-between border-t pt-5'>
            <div className='flex flex-col gap-1'>
              <div className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
                Track token cost
              </div>
              <div className='text-text-soft-400 text-xs font-medium lg:text-sm'>
                Attach estimated USD cost to every span
              </div>
            </div>
            <Switch.Root
              checked={trackTokenCost}
              onCheckedChange={setTrackTokenCost}
              className='[&>div]:group-data-[state=checked]/switch:!bg-success-base [&>div]:group-hover:data-[state=checked]/switch:!bg-success-base cursor-pointer'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
