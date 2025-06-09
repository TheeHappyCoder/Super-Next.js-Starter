'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, XIcon } from 'lucide-react';

type Props = {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
};

export default function DateRangeFilter({ value, onChange }: Props) {
  const from = value?.from;
  const to = value?.to;

  const displayValue =
    from && to
      ? `${format(from, 'LLL dd, y')} - ${format(to, 'LLL dd, y')}`
      : 'Select date range';

  const showClear = !!from || !!to;

  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[260px] justify-start text-left font-normal pr-10"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayValue}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="range"
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {showClear && (
        <button
          className="absolute right-3 top-2.5 text-muted-foreground hover:text-destructive transition-colors"
          onClick={() => onChange(undefined)}
          aria-label="Clear date filter"
        >
          <XIcon className="h-4 w-4 cursor-pointer" />
        </button>
      )}
    </div>
  );
}
