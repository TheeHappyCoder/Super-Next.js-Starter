'use client';

import React from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

type Props = {
  value: 'newest' | 'oldest';
  onChange: (value: 'newest' | 'oldest') => void;
};

export default function SortByDate({ value, onChange }: Props) {
  return (
    <Select value={value} onValueChange={(val) => onChange(val as 'newest' | 'oldest')}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by Date" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest First</SelectItem>
        <SelectItem value="oldest">Oldest First</SelectItem>
      </SelectContent>
    </Select>
  );
}
