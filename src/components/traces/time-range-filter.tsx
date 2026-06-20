'use client';

import * as React from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine, RiHourglassLine } from '@remixicon/react';
import { format, subDays, subHours } from 'date-fns';
import { type DateRange } from 'react-day-picker';

import * as Button from '@/components/ui/button';
import * as DatepickerPrimitives from '@/components/ui/datepicker';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Popover from '@/components/ui/popover';
import { cn } from '@/utils/cn';

const presets = [
  { label: 'Last 1 hour', value: '1h', getRange: () => ({ from: subHours(new Date(), 1), to: new Date() }) },
  { label: 'Last 3 hours', value: '3h', getRange: () => ({ from: subHours(new Date(), 3), to: new Date() }) },
  { label: 'Last 6 hours', value: '6h', getRange: () => ({ from: subHours(new Date(), 6), to: new Date() }) },
  { label: 'Last 12 hours', value: '12h', getRange: () => ({ from: subHours(new Date(), 12), to: new Date() }) },
  { label: 'Last 1 day', value: '1d', getRange: () => ({ from: subDays(new Date(), 1), to: new Date() }) },
  { label: 'Last 2 days', value: '2d', getRange: () => ({ from: subDays(new Date(), 2), to: new Date() }) },
  { label: 'Last 7 days', value: '7d', getRange: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
  { label: 'Last 14 days', value: '14d', getRange: () => ({ from: subDays(new Date(), 14), to: new Date() }) },
  { label: 'Last 30 days', value: '30d', getRange: () => ({ from: subDays(new Date(), 30), to: new Date() }) },
  { label: 'All time', value: 'all', getRange: () => ({ from: new Date(2020, 0, 1), to: new Date() }) },
];

const PresetItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { isActive?: boolean }
>(({ className, isActive, ...rest }, ref) => (
  <button
    ref={ref}
    type='button'
    className={cn(
      'h-8 w-full rounded-lg px-3 text-left text-label-sm',
      'transition duration-200 ease-out',
      isActive ? 'bg-bg-weak-50 text-text-strong-950' : 'text-text-sub-600',
      'hover:bg-bg-weak-50',
      className,
    )}
    {...rest}
  />
));
PresetItem.displayName = 'PresetItem';

export function TimeRangeFilter() {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string>('1d');
  const [showCustom, setShowCustom] = React.useState(false);
  const [range, setRange] = React.useState<DateRange | undefined>();
  const [startTime, setStartTime] = React.useState('00:00');
  const [endTime, setEndTime] = React.useState('23:59');
  const [customLabel, setCustomLabel] = React.useState<string | null>(null);

  const activeLabel = customLabel ?? presets.find((p) => p.value === selected)?.label ?? 'Last 1 day';

  const handlePresetSelect = (value: string) => {
    setSelected(value);
    setCustomLabel(null);
    setShowCustom(false);
    setOpen(false);
  };

  const handleApply = () => {
    if (range?.from && range?.to) {
      setCustomLabel(`${format(range.from, 'MMM dd')} – ${format(range.to, 'MMM dd')}`);
      setSelected('custom');
      setShowCustom(false);
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setShowCustom(false);
    setRange(undefined);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button.Root
          variant='neutral'
          mode='stroke'
          size='xxsmall'
          className='gap-2 px-3 text-[13px]'
        >
          <Button.Icon as={RiHourglassLine} className='size-3.5' />
          {activeLabel}
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content
        align='start'
        showArrow={false}
        className='w-auto overflow-hidden rounded-xl p-0'
      >
        <div className='flex'>
          {/* Presets */}
          <div className='w-45 space-y-1 border-r border-stroke-soft-200 px-3 py-3'>
            {presets.map((preset) => (
              <PresetItem
                key={preset.value}
                isActive={selected === preset.value && !customLabel}
                onClick={() => handlePresetSelect(preset.value)}
              >
                {preset.label}
              </PresetItem>
            ))}
            <PresetItem
              isActive={showCustom || !!customLabel}
              onClick={() => setShowCustom(true)}
            >
              Custom Date
            </PresetItem>
          </div>

          {/* Custom date range picker */}
          {showCustom && (
            <div className='flex flex-col'>
              <div className='flex border-b border-stroke-soft-200'>
                {/* Calendar */}
                <div className='flex-1'>
                  <DatepickerPrimitives.Calendar
                    mode='range'
                    selected={range}
                    onSelect={setRange}
                    numberOfMonths={1}
                    weekStartsOn={1}
                    showOutsideDays={false}
                    classNames={{
                      caption:
                        'flex justify-center items-center relative h-9 px-3 py-2 rounded-full text-center w-full bg-bg-weak-50 mb-2',
                      tbody: 'w-full',
                      head: 'w-full',
                      nav_button_previous: 'top-1/2 -translate-y-1/2 left-1.5 rounded-full!',
                      nav_button_next: 'top-1/2 -translate-y-1/2 right-1.5 rounded-full!',
                      day: cn(
                        'flex aspect-square h-full w-full items-center justify-center rounded-full text-center text-label-sm text-text-sub-600 outline-none',
                        'transition duration-200 ease-out',
                        'hover:bg-bg-weak-50 hover:text-text-strong-950',
                        'aria-[selected]:bg-primary-base aria-[selected]:text-static-white',
                        'focus:outline-none focus-visible:bg-bg-weak-50 focus-visible:text-text-strong-950',
                      ),
                      table: 'w-full border-collapse flex justify-center items-center flex-col mt-0!',
                      row: 'grid grid-flow-col auto-cols-fr w-full mt-2 gap-2',
                      head_cell:
                        'text-text-soft-400 text-label-sm uppercase size-10 flex items-center justify-center text-center select-none w-full',
                      cell: cn(
                        'group/cell relative h-10 w-full select-none p-0',
                        'has-[.day-range-middle]:bg-primary-alpha-10',
                        '[&:has(.day-range-start):not(:has(.day-range-end))]:rounded-l-full [&:has(.day-range-start):not(:has(.day-range-end))]:bg-primary-alpha-10 [&:has(.day-range-start):not(:has(.day-range-end))]:before:block',
                        '[&:has(.day-range-end):not(:has(.day-range-start))]:rounded-r-full [&:has(.day-range-end):not(:has(.day-range-start))]:bg-primary-alpha-10',
                        '[&:not(:has(+_*_[type=button]))]:before:hidden',
                        'before:absolute before:inset-y-0 before:-right-2 before:hidden before:w-2 before:bg-primary-alpha-10',
                        'last:has-[.day-range-middle]:before:hidden',
                        'has-[.day-range-middle]:before:block',
                        'has-[.day-range-end]:before:left-0 has-[.day-range-end]:before:right-auto',
                      ),
                    }}
                    components={{
                      IconLeft: () => <RiArrowLeftSLine className='size-5 rounded-full!' />,
                      IconRight: () => <RiArrowRightSLine className='size-5 rounded-full!' />,
                    }}
                  />
                </div>

                {/* Start/End datetime inputs */}
                <div className='w-55 border-l border-stroke-soft-200'>
                  <div className='flex flex-col gap-3 p-4'>
                    <div className='flex flex-col gap-1.5'>
                      <Label.Root htmlFor='tr-start-date'>Start date</Label.Root>
                      <Input.Root className='w-full'>
                        <Input.Wrapper>
                          <Input.Input
                            id='tr-start-date'
                            type='text'
                            value={range?.from ? format(range.from, 'yyyy-MM-dd') : ''}
                            readOnly
                            className='text-label-sm text-text-sub-600'
                          />
                          <Input.Input
                            type='time'
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className='border-l border-stroke-soft-200 pl-3 text-label-sm text-text-sub-600 [&::-webkit-calendar-picker-indicator]:hidden'
                          />
                        </Input.Wrapper>
                      </Input.Root>
                    </div>
                    <div className='flex flex-col gap-1.5'>
                      <Label.Root htmlFor='tr-end-date'>End date</Label.Root>
                      <Input.Root className='w-full'>
                        <Input.Wrapper>
                          <Input.Input
                            id='tr-end-date'
                            type='text'
                            value={range?.to ? format(range.to, 'yyyy-MM-dd') : ''}
                            readOnly
                            className='text-label-sm text-text-sub-600'
                          />
                          <Input.Input
                            type='time'
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className='border-l border-stroke-soft-200 pl-3 text-label-sm text-text-sub-600 [&::-webkit-calendar-picker-indicator]:hidden'
                          />
                        </Input.Wrapper>
                      </Input.Root>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className='flex items-center justify-between p-4'>
                <div>
                  <span className='text-label-sm text-text-soft-400'>Range:</span>{' '}
                  <span className='text-paragraph-sm text-text-sub-600'>
                    {range?.from && range?.to
                      ? `${format(range.from, 'MMMM dd, yyyy')} - ${format(range.to, 'MMMM dd, yyyy')}`
                      : 'Select a range'}
                  </span>
                </div>
                <div className='flex gap-4'>
                  <Button.Root variant='neutral' mode='stroke' size='small' onClick={handleCancel}>
                    Cancel
                  </Button.Root>
                  <Button.Root variant='primary' mode='filled' size='small' onClick={handleApply}>
                    Apply
                  </Button.Root>
                </div>
              </div>
            </div>
          )}
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
