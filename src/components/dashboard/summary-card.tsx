'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type Props = {
  title: string;
  value: number | string;
  className?: string;
};

export default function SummaryCard({ title, value, className }: Props) {
  return (
    <div
      className={cn(
        'p-4 rounded-lg shadow-sm border border-gray-200 bg-white dark:bg-zinc-900 dark:border-zinc-800',
        'flex flex-col gap-1',
        className
      )}
    >
      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</span>
      <span className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}
