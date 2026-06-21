"use client";

import { useState } from "react";
import { RiCheckLine, RiCloseLine, RiMore2Line, RiSearchLine, RiVipCrownLine } from "@remixicon/react";

import * as Button from "@/components/ui/button";
import * as Input from "@/components/ui/input";
import * as Select from "@/components/ui/select";

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: "Paid" | "Pending" | "Failed";
}

const currentPlan = {
  planName: "Scale Plan",
  description: "Up to 50M spans / month",
  price: "$499",
  priceDetails: "/ month",
  manageButtonText: "Manage",
  items: [
    { id: "spans", label: "Included spans", value: "50M / month" },
    { id: "overage", label: "Overage", value: "$2.00 / 1M spans" },
    { id: "retention", label: "Trace retention", value: "30 days" },
    { id: "renewal", label: "Plan renewal", value: "June 20, 2025" },
    { id: "status", label: "Status", value: "Active" },
  ],
};

const meteredUsage = [
  { label: "Spans ingested", value: 32_000_000, limit: 50_000_000, unit: "spans" },
  { label: "Tokens processed", value: 482_000_000, limit: 1_000_000_000, unit: "tokens" },
  { label: "Eval runs", value: 7_400, limit: 20_000, unit: "runs" },
];

const invoices: Invoice[] = [
  { id: "1", date: "April 15, 2025", amount: "$499", status: "Paid" },
  { id: "2", date: "May 15, 2025", amount: "$499", status: "Paid" },
  { id: "3", date: "June 15, 2025", amount: "$564", status: "Paid" },
];

function compact(n: number) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

export default function BillingUsage() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className='flex h-full w-full flex-col gap-5 overflow-y-auto px-0 pb-8 lg:gap-7 lg:px-7 lg:pb-0'>
      <div className='flex flex-col gap-5 pt-5 lg:flex-row lg:gap-4 lg:pt-7'>
        <div className='flex flex-col gap-1 px-5 lg:max-w-50 lg:min-w-50 lg:px-0 xl:max-w-75 xl:min-w-75'>
          <h3 className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
            Current plan
          </h3>
          <p className='text-text-soft-400 tracking-spacing-tiny-2 text-xs font-medium lg:text-sm'>
            Plan details and metering overview.
          </p>
        </div>

        <div className='flex w-full flex-col'>
          <div className='flex flex-col items-start justify-between gap-3 px-5 lg:flex-row lg:items-center lg:gap-4 lg:px-0 xl:gap-6'>
            <div className='flex w-full items-center justify-start gap-3 lg:justify-between lg:gap-2 xl:gap-3'>
              <div className='flex items-center gap-3 lg:gap-2 xl:gap-3'>
                <div className='bg-bg-white-0 border-stroke-soft-200 flex size-10 items-center justify-center rounded-full border lg:size-8 xl:size-10'>
                  <RiVipCrownLine className='size-5 text-green-600' />
                </div>
                <div className='flex flex-col gap-1 lg:gap-0.5 xl:gap-1'>
                  <div className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
                    {currentPlan.planName}
                  </div>
                  <div className='text-text-soft-400 text-xs font-medium'>
                    {currentPlan.description}
                  </div>
                </div>
              </div>
              <div className='text-text-strong-950 lg:flex-unset flex-1 text-end text-base font-medium -tracking-widest lg:text-left lg:text-xs xl:text-base'>
                {currentPlan.price}
                <span className='text-text-soft-400 lg:text-2xs tracking-spacing-tiny-2 ml-1 text-sm font-medium xl:text-sm'>
                  {currentPlan.priceDetails}
                </span>
              </div>
            </div>
            <Button.Root
              size='xsmall'
              variant='neutral'
              mode='stroke'
              className='text-text-sub-600 !rounded-10 ml-13 w-[calc(100%-52px)] cursor-pointer px-3 text-sm font-medium lg:ml-0 lg:w-fit'
            >
              {currentPlan.manageButtonText}
            </Button.Root>
          </div>
          <div className='border-stroke-soft-200 mt-5 flex flex-col gap-3.5 border-t px-5 pt-5 lg:px-0'>
            {currentPlan.items.map((item) => (
              <div key={item.id} className='flex items-center gap-3'>
                <span className='text-text-soft-400 tracking-spacing-tiny-2 w-3/5 text-sm font-medium lg:w-2/5'>
                  {item.label}
                </span>
                <span className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='border-stroke-soft-200 flex flex-col gap-5 border-t px-5 pt-5 lg:flex-row lg:gap-4 lg:px-0 lg:pt-7'>
        <div className='flex flex-col gap-1 lg:max-w-50 lg:min-w-50 xl:max-w-75 xl:min-w-75'>
          <h3 className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
            Usage this cycle
          </h3>
          <p className='text-text-soft-400 tracking-spacing-tiny-2 text-xs font-medium lg:text-sm'>
            Metered consumption against limits.
          </p>
        </div>
        <div className='flex w-full flex-col gap-5'>
          {meteredUsage.map((item) => {
            const pct = Math.min(100, Math.round((item.value / item.limit) * 100));
            return (
              <div key={item.label} className='flex flex-col gap-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
                    {item.label}
                  </span>
                  <span className='text-text-soft-400 text-xs font-medium'>
                    {compact(item.value)} / {compact(item.limit)} {item.unit}
                  </span>
                </div>
                <div className='bg-bg-weak-50 h-1.5 w-full overflow-hidden rounded-full'>
                  <div
                    className={`h-full rounded-full ${pct >= 80 ? "bg-error-base" : "bg-green-600"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className='border-stroke-soft-200 flex flex-col gap-4 border-t pt-5 lg:flex-row lg:pt-7'>
        <div className='flex flex-col gap-1 px-5 lg:max-w-50 lg:min-w-50 lg:px-0 xl:max-w-75 xl:min-w-75'>
          <h3 className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
            Billing history
          </h3>
          <p className='text-text-soft-400 tracking-spacing-tiny-2 text-xs font-medium lg:text-sm'>
            Invoice history and payments.
          </p>
        </div>

        <div className='flex w-full flex-col gap-5 px-5 lg:px-0'>
          <div className='flex items-center gap-3'>
            <Input.Root size='xsmall' className='hover:bg-bg-weak-50 shadow-custom-input'>
              <Input.Wrapper className='px-2.5'>
                <Input.Icon as={RiSearchLine} className='text-text-soft-400' />
                <Input.Input
                  type='text'
                  placeholder='Search invoices...'
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className='placeholder:text-text-soft-400 group-hover:hover:placeholder:text-text-sub-600'
                />
                {searchValue && (
                  <button
                    type='button'
                    onClick={() => setSearchValue("")}
                    className='text-text-soft-400 hover:text-text-sub-600 flex items-center justify-center transition-colors duration-200'
                  >
                    <RiCloseLine className='size-5' />
                  </button>
                )}
              </Input.Wrapper>
            </Input.Root>
            <Select.Root size='xsmall'>
              <Select.Trigger className='text-text-sub-600 w-auto text-sm'>
                <Select.Value placeholder='All status' />
              </Select.Trigger>
              <Select.Content className='z-62'>
                <Select.Item value='all'>All status</Select.Item>
                <Select.Item value='paid'>Paid</Select.Item>
                <Select.Item value='pending'>Pending</Select.Item>
                <Select.Item value='failed'>Failed</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>

          <div className='border-stroke-soft-200 flex flex-col gap-5 border-t pt-5'>
            {invoices.map((invoice) => (
              <div key={invoice.id} className='flex items-center justify-between gap-2.5'>
                <div className='text-text-soft-400 tracking-spacing-tiny-2 w-[37%] text-sm font-medium'>
                  {invoice.date}
                </div>
                <div className='text-text-sub-600 tracking-spacing-tiny-2 w-[33%] text-sm font-medium'>
                  {invoice.amount}
                </div>
                <div className='w-[19%]'>
                  <div className='flex items-center gap-2'>
                    <div className='grid size-3 place-items-center rounded-full bg-green-600'>
                      <RiCheckLine className='size-2.5 text-white' />
                    </div>
                    <span className='text-text-sub-600 tracking-spacing-tiny-2 text-sm font-medium'>
                      {invoice.status}
                    </span>
                  </div>
                </div>
                <Button.Root
                  size='xsmall'
                  variant='neutral'
                  mode='ghost'
                  className='hover:bg-bg-weak-50 size-5 cursor-pointer rounded-sm p-0 transition-colors'
                >
                  <RiMore2Line className='text-text-soft-400 size-5' />
                </Button.Root>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
